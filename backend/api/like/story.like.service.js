const logger = require('../../services/logger.service')
const db = require('../../database');


async function getLikesForStory(storyId) {
    try {
        const likes = await db.query(`select * from stories_liked_by where story_id = $story_id`, {
            $story_id: storyId
        });
        console.log('likes', likes)
        return likes
    } catch (err) {
        logger.error('cannot find likes', err)
        throw err
    }
}


async function addLikeToStory({ storyId, userId }) {
    try {
        const like = await db.exec(`insert into stories_liked_by (story_id, user_id) values ($story_id, $user_id)`, {
            $story_id: storyId,
            $user_id: userId
        });
        return like
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToStory({ storyId, userId }) {
    try {
        await db.exec(`delete from stories_liked_by where story_id = $story_id and user_id = $user_id`, {
            $story_id: storyId,
            $user_id: userId
        });
    } catch (err) {
        logger.error('cannot delete like', err)
        throw err
    }
}

module.exports = {
    getLikesForStory,
    addLikeToStory,
    deleteLikeToStory
}
