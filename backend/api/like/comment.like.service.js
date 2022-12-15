const logger = require('../../services/logger.service')
const db = require('../../database');


async function getLikesForComment(commentId) {
    try {
        const likes = await db.query(`select * from commentsLikedBy where commentId = $commentId`, {
            $commentId: commentId
        });
        console.log('likes', likes)
        return likes
    } catch (err) {
        logger.error('cannot find likes', err)
        throw err
    }
}


async function addLikeToComment({ commentId, userId }) {
    try {
        const like = await db.exec(`insert into commentsLikedBy (commentId, userId) values ($commentId, $userId)`, {
            $commentId: commentId,
            $userId: userId
        });
        return like
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToComment({ commentId, userId }) {
    try {
        await db.exec(`delete from commentsLikedBy where commentId = $commentId and userId = $userId`, {
            $commentId: commentId,
            $userId: userId
        });
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
