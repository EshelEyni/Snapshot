const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service');


async function getLikesForComment(commentId, userId) {
    try {
        if (userId) {
            const like = await db.query(`select * from commentsLikedBy where commentId = $commentId and userId = $userId`, {
                $commentId: commentId,
                $userId: userId
            });
            return like
        } else {

            const likes = await db.query(`select * from commentsLikedBy where commentId = $commentId`, {
                $commentId: commentId
            });

            likes.forEach(like => {
                like.id = like.userId
                delete like.userId
            })

            return likes
        }
    } catch (err) {
        logger.error('cannot find likes', err)
        throw err
    }
}


async function addLikeToComment({ commentId, user }) {
    try {
        return await db.txn(async () => {

            const id = await db.exec(
                `insert into commentsLikedBy (commentId, userId, username, fullname, imgUrl ) 
            values ($commentId, $userId, $username, $fullname, $imgUrl)`, {
                $commentId: commentId,
                $userId: user.id,
                $username: user.username,
                $fullname: user.fullname,
                $imgUrl: user.imgUrl
            });

            const posts = await db.query(
                `select id, userId from posts where id = (select postId from comments where id = $commentId)`, {
                $commentId: commentId
            });
            const post = posts[0]

            if (post.userId !== user.id) {
                const noitification = {
                    type: 'like-comment',
                    byUserId: user.id,
                    userId: post.userId,
                    entityId: id,
                    postId: post.id,
                }
                await noitificationService.add(noitification)
            }

            return id
        })
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToComment({ commentId, userId }) {
    try {
        await db.txn(async () => {

            const entity = await db.query(
                `select id from commentsLikedBy where commentId = $commentId and userId = $userId`, {
                $commentId: commentId,
                $userId: userId
            });
            const entityId = entity[0].id

            await db.exec(`delete from commentsLikedBy where commentId = $commentId and userId = $userId`, {
                $commentId: commentId,
                $userId: userId
            });

            await db.exec(`delete from notifications where entityId = $entityId and type = 'like-comment'`, {
                $entityId: entityId,
            })
        })
    } catch (err) {
        logger.error('cannot delete like', err)
        throw err
    }
}

module.exports = {
    getLikesForComment,
    addLikeToComment,
    deleteLikeToComment
}
