const logger = require('../../services/logger.service')
const likeService = require('./post.like.service')

async function getLikesForPost(req, res) {
    try {
        const likes = await likeService.getLikesForPost({ postId: req.query.postId, userId: req.query.userId, })
        res.send(likes)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get likes' })
    }
}

async function addLikeToPost(req, res) {
    try {
        const { post, user } = req.body
        const id = await likeService.addLikeToPost({ post, user })
        res.send({ id })
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