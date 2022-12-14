const logger = require('../../services/logger.service')
const db = require('../../database');


async function getLikesForComment(commentId) {
    try {
        const likes = await db.query(`select * from comments_liked_by where comment_id = $comment_id`, {
            $comment_id: commentId
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
        const like = await db.exec(`insert into comments_liked_by (comment_id, user_id) values ($comment_id, $user_id)`, {
            $comment_id: commentId,
            $user_id: userId
        });
        return like
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToComment({ commentId, userId }) {
    try {
        await db.exec(`delete from comments_liked_by where comment_id = $comment_id and user_id = $user_id`, {
            $comment_id: commentId,
            $user_id: userId
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
