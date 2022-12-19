const logger = require('../../services/logger.service')
const db = require('../../database');

async function getLikesForPost({ postId, userId }) {
    try {
        if (userId) {
            const likes = await db.query(`select * from postsLikedBy where postId = $postId and userId = $userId`, {
                $postId: postId,
                $userId: userId
            });
            return likes
        } else {
            const likes = await db.query(`select * from postsLikedBy where postId = $postId`, {
                $postId: postId
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


async function addLikeToPost({ postId, user }) {
    try {
        const like = await db.exec(
            `insert into postsLikedBy (postId, userId, username, fullname, imgUrl) 
            values ($postId, $userId, $username, $fullname, $imgUrl)`, {
            $postId: postId,
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

async function deleteLikeToPost({ postId, userId }) {
    try {
        await db.exec(`delete from postsLikedBy where postId = $postId and userId = $userId`, {
            $postId: postId,
            $userId: userId
        });
    } catch (err) {
        logger.error('cannot delete like', err)
        throw err
    }
}

module.exports = {
    getLikesForPost,
    addLikeToPost,
    deleteLikeToPost
}