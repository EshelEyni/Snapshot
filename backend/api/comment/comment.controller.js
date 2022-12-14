const commentService = require('./comment.service')
const logger = require('../../services/logger.service')

async function getComments(req, res) {
    try {
        const comments = await commentService.query()
        res.send(comments)
    } catch (err) {
        logger.error('Failed to get comments', err)
        res.status(500).send({ err: 'Failed to get comments' })
    }
}

async function getComment(req, res) {
    try {
        const comment = await commentService.getById(req.params.id)
        res.send(comment)
    } catch (err) {
        logger.error('Failed to get comment', err)
        res.status(500).send({ err: 'Failed to get comment' })
    }
}

async function deleteComment(req, res) {
    try {
        await commentService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete comment', err)
        res.status(500).send({ err: 'Failed to delete comment' })
    }
}

async function updateComment(req, res) {
    try {
        const comment = req.body
        const savedComment = await commentService.update(comment)
        res.send(savedComment)
    } catch (err) {
        logger.error('Failed to update comment', err)
        res.status(500).send({ err: 'Failed to update comment' })
    }
}

async function addComment(req, res) {
    try {
        const comment = req.body
        const savedComment = await commentService.add(comment)
        res.send({ savedComment: savedComment })
    } catch (err) {
        logger.error('Failed to add comment', err)
        res.status(500).send({ err: 'Failed to add comment' })
    }
}

module.exports = {
    getComments,
    getComment,
    deleteComment,
    updateComment,
    addComment
}