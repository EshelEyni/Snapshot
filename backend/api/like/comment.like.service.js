const logger = require('../../services/logger.service')
const db = require('../../database');


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
        const like = await db.exec(
            `insert into commentsLikedBy (commentId, userId, username, fullname, imgUrl ) 
            values ($commentId, $userId, $username, $fullname, $imgUrl)`, {
            $commentId: commentId,
            $userId: user.id,
            $username: user.username,
            $fullname: user.fullname,
            $imgUrl: user.imgUrl
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
