const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service')

async function query({ postId, userId, type }) {
    try {

        if (type === 'post-preview') {
            let userIds = [userId]
            const followingIds = await db.query(`select id from following where followerId = $userId`, { $userId: userId });
            userIds = userIds.concat(followingIds.map(following => following.id))
            let commentIds = []
            for (let i = 0; i < userIds.length; i++) {
                const currCommentIds = await db.query(
                    `select id from comments where postId = $postId 
                        and userId = $userId`, {
                    $postId: postId,
                    $userId: userIds[i]
                }
                );
                commentIds = commentIds.concat(currCommentIds)
            }
            let comments = commentIds.map(commentId => {
                return getById(commentId.id)
            })
            comments = await Promise.all(comments)
            return comments
        }
        else if (type === 'post-details') {
            const commentIds = await db.query(`select id from comments where postId = $postId`, { $postId: postId });
            let comments = commentIds.map(commentId => {
                return getById(commentId.id)
            })
            comments = await Promise.all(comments)
            return comments
        }
        else if (type === 'chat-post-preview') {
            const commentId = await db.query(
                `select id from comments where postId = $postId and userId = $userId and isOriginalText = 1 limit 1`,
                {
                    $postId: postId,
                    $userId: userId
                });

            if (!commentId.length) {
                return [];
            }
            else {
                const comment= await getById(commentId[0].id)
                return [comment]
            }

        }

    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}

async function getById(commentId) {
    try {
        return await db.txn(async () => {
            const comments = await db.query(`select * from comments where id = $id`, { $id: commentId });
            if (comments.length === 0) {
                return 'comment not found';
            }
            const comment = comments[0];
            const user = await db.query(`select id, username, fullname, imgUrl from users where id = $id limit 1`, { $id: comments[0].userId });
            comment.by = user[0];
            delete comment.userId;

            const mentionRegex = /@(\w+)/g;
            let mentions = comment.text.match(mentionRegex);
            if (mentions) {
                mentions = mentions.map(mention => {
                    return mention.slice(1)
                })

                const users = await db.query(`select id, username from users where username in (${mentions.map(mention => `'${mention}'`).join(',')})`);
                comment.mentions = users.map(user => {
                    return { userId: user.id, username: user.username }
                })
            }

            return comment
        })
    } catch (err) {
        logger.error(`while finding comment ${commentId}`, err)
        throw err
    }
}

async function remove(commentId) {
    try {
        await db.txn(async () => {
            await db.exec(`delete from commentsLikedBy where commentId = $id`, { $id: commentId });
            await db.exec(`delete from comments where id = $id`, { $id: commentId });
            await db.exec(`delete from notifications where entityId = $entityId and type = 'comment'`, {
                $entityId: commentId,
            })
        })
    } catch (err) {
        logger.error(`cannot remove comment ${commentId}`, err)
        throw err
    }
}

async function update(comment) {
    try {
        await db.exec(
            `update comments set userId = $userId,
             postId = $postId,
             text = $text,
             createdAt = $createdAt,
             isOriginalText = $isOriginalText,
             likeSum = $likeSum where id = $id`, {
            $userId: comment.by.id,
            $postId: comment.postId,
            $text: comment.text,
            $createdAt: comment.createdAt,
            $isOriginalText: comment.isOriginalText,
            $likeSum: comment.likeSum,
            $id: comment.id
        })
        return comment
    } catch (err) {
        logger.error(`cannot update comment ${comment._id}`, err)
        throw err
    }
}

async function add(comment) {
    try {
        return await db.txn(async () => {
            const id = await db.exec(
                `insert into comments (userId, postId, text, createdAt, isOriginalText, likeSum) 
             values ($userId, $postId, $text, $createdAt, $isOriginalText, $likeSum)`, {
                $userId: comment.by.id,
                $postId: comment.postId,
                $text: comment.text,
                $createdAt: Date.now(),
                $isOriginalText: comment.isOriginalText,
                $likeSum: 0
            })

            const users = await db.query(`select userId from posts where id = $id`, { $id: comment.postId });
            const userId = users[0].userId;

            if (userId !== comment.by.id) {
                const noitification = {
                    type: 'comment',
                    byUserId: comment.by.id,
                    entityId: id,
                    userId,
                    postId: comment.postId,
                }
                await noitificationService.add(noitification)
            }

            const mentionRegex = /@(\w+)/g;
            const mentions = comment.text.match(mentionRegex);
            const tags = [];
            if (mentions) {
                mentions.forEach((hashtag) => {
                    const tag = hashtag.substring(1);
                    tags.push(tag);
                });
                const mentionedUsers = await db.query(
                    `select id from users where username in (${tags.map(tag => `'${tag}'`).join(',')})`
                );
                const mentionedUserIds = mentionedUsers.map(user => user.id);
                mentionedUserIds.forEach(async (mentionedUserId) => {
                    if (mentionedUserId === comment.by.id) return;
                    const noitification = {
                        type: 'mention',
                        byUserId: comment.by.id,
                        entityId: id,
                        userId: mentionedUserId,
                        postId: comment.postId,
                    }
                    await noitificationService.add(noitification)
                })
            }


            return id
        });
    } catch (err) {
        logger.error('cannot insert comment', err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}