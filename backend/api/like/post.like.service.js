const logger = require('../../services/logger.service')
const db = require('../../database');

async function getLikesForPost(postId) {
    try {
        const likes = await db.query(`select * from posts_liked_by where post_id = $post_id`, {
            $post_id: postId
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
        const like = await db.exec(`insert into posts_liked_by (post_id, user_id) values ($post_id, $user_id)`, {
            $post_id: postId,
            $user_id: userId
        });
        return like
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToPost({ postId, userId }) {
    try {
        await db.exec(`delete from posts_liked_by where post_id = $post_id and user_id = $user_id`, {
            $post_id: postId,
            $user_id: userId
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