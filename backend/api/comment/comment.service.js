const logger = require('../../services/logger.service')
const db = require('../../database');

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
    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}

async function getById(commentId) {
    try {
        const comments = await db.query(`select * from comments where id = $id`, { $id: commentId });
        if (comments.length === 0) {
            return 'comment not found';
        }
        const user = await db.query(`select id, username, fullname, imgUrl from users where id = $id limit 1`, { $id: comments[0].userId });
        comments[0].by = user[0];
        delete comments[0].userId;
        const likeBy = await db.query(`select userId, username, fullname, imgUrl from commentsLikedBy where commentId = $id`, { $id: commentId });
        comments[0].likeBy = likeBy;
        delete comments[0].likeSum;
        console.log('comments[0]', comments[0]);
        return comments[0]
    } catch (err) {
        logger.error(`while finding comment ${commentId}`, err)
        throw err
    }
}

async function remove(commentId) {
    try {
        await db.exec(`delete from comments where id = $id`, { $id: commentId });
    } catch (err) {
        logger.error(`cannot remove comment ${commentId}`, err)
        throw err
    }
}

async function update(comment) {
    try {
        await db.exec(`update comments set userId = $userId, postId = $postId, text = $text, createdAt = $createdAt, isOriginalText = $isOriginalText likeSum = $likeSum where id = $id`, {
            $userId: comment.userId,
            $postId: comment.postId,
            $text: comment.text,
            $createdAt: comment.createdAt,
            $isOriginalText: comment.isOriginalText,
            $likeSum: comment.likeBy.length,
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
        const result = await db.exec(`insert into comments (userId, postId, text, createdAt, isOriginalText, likeSum) values ($userId, $postId, $text, $createdAt, $isOriginalText, $likeSum)`, {
            $userId: comment.by.id,
            $postId: comment.postId,
            $text: comment.text,
            $createdAt: Date.now(),
            $isOriginalText: comment.isOriginalText,
            $likeSum: 0
        })
        comment.id = result.lastID;
        return comment
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