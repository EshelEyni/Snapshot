const logger = require('../../services/logger.service')
const likeService = require('./post.like.service')

async function getLikesForPost(req, res) {
    try {
        const likes = await likeService.getLikesForPost(req.params.id)
        res.send(likes)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get likes' })
    }
}

async function addLikeToPost(req, res) {
    try {
        const { postId, userId } = req.body
        const like = await likeService.addLikeToPost({ postId, userId })
        res.send({ like: like })
    } catch (err) {
        res.status(500).send({ err: 'Failed to add like' })
    }
}

async function deleteLikeToPost(req, res) {
    try {
        const { postId, userId } = req.body
        await likeService.deleteLikeToPost({ postId, userId })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to delete like' })
    }
}

module.exports = {
    getLikesForPost,
    addLikeToPost,
    deleteLikeToPost
}