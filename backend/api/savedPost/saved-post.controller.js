const savedPostService = require('./saved-post.service.js')
const logger = require('../../services/logger.service')

async function getSavedPost(req, res) {
    try {
        const savedPost = await savedPostService.query({ userId: req.query.userId, postId: req.query.postId })
        res.send(savedPost)
    } catch (err) {
        logger.error('Failed to get saved post', err)
        res.status(500).send({ err: 'Failed to get saved post' })
    }
}

async function savePost(req, res) {
    try {
        const id = await savedPostService.save({ postId: req.body.postId, userId: req.body.userId })
        res.send({ id })
    } catch (err) {
        logger.error('Failed to save post', err)
        res.status(500).send({ err: 'Failed to save post' })
    }
}

async function unsavePost(req, res) {
    try {
        await savedPostService.unsave({ postId: req.body.postId, userId: req.body.userId })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete save post', err)
        res.status(500).send({ err: 'Failed to delete save post' })
    }
}

module.exports = {
    getSavedPost,
    savePost,
    unsavePost
}