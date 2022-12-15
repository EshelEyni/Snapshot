const logger = require('../../services/logger.service')
const db = require('../../database');


async function getLikesForStory(storyId) {
    try {
        const likes = await db.query(`select * from storiesLikedBy where storyId = $storyId`, {
            $storyId: storyId
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
        const like = await db.exec(`insert into storiesLikedBy (storyId, userId) values ($storyId, $userId)`, {
            $storyId: storyId,
            $userId: userId
        });
        return like
    } catch (err) {
        logger.error('cannot add like', err)
        throw err
    }
}

async function deleteLikeToStory({ storyId, userId }) {
    try {
        await db.exec(`delete from storiesLikedBy where storyId = $storyId and userId = $userId`, {
            $storyId: storyId,
            $userId: userId
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
