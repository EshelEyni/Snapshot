const logger = require('../../services/logger.service')
const likeService = require('./story.like.service')

async function getLikesForStory(req, res) {
    try {
        const likes = await likeService.getLikesForStory(req.params.id)
        res.send(likes)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get likes' })
    }
}

async function addLikeToStory(req, res) {
    try {
        const { storyId, userId } = req.body
        const like = await likeService.addLikeToStory({ storyId, userId })
        res.send({ like: like })
    } catch (err) {
        res.status(500).send({ err: 'Failed to add like' })
    }
}

async function deleteLikeToStory(req, res) {
    try {
        const { storyId, userId } = req.body
        await likeService.deleteLikeToStory({ storyId, userId })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to delete like' })
    }
}

module.exports = {
    getLikesForStory,
    addLikeToStory,
    deleteLikeToStory
}