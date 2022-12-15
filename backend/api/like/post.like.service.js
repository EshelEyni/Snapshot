const logger = require('../../services/logger.service')
const db = require('../../database');

async function getLikesForPost(postId) {
    try {
        const likes = await db.query(`select * from postsLikedBy where postId = $postId`, {
            $postId: postId
        });
        console.log('likes', likes)
        return likes
    } catch (err) {
        logger.error('cannot find likes', err)
        throw err
    } 
}


async function addLikeToPost({ postId, userId }) {
    try {
        const like = await db.exec(`insert into postsLikedBy (postId, userId) values ($postId, $userId)`, {
            $postId: postId,
            $userId: userId
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