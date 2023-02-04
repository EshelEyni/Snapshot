const commentService = require('./comment.service')
const logger = require('../../services/logger.service')

async function getComments(req, res) {
    try {
        const comments = await commentService.query(
            {
                postId: req.query.postId,
                userId: req.query.userId,
                type: req.query.type
            }
        )
        res.send(comments)
    } catch (err) {
        logger.error('Failed to get comments', err)
        res.status(500).send({ err: 'Failed to get comments' })
    }
}

async function getComment(req, res) {
    const commentId = req.params.id
    try {
        const comment = await commentService.getById(commentId)
        res.send(comment)
    } catch (err) {
        logger.error('Failed to get comment', err)
        res.status(500).send({ err: 'Failed to get comment' })
    }
}

async function deleteComment(req, res) {
    const commentId = req.params.id
    try {
        await commentService.remove(req.loggedinUser, commentId)
        res.send({ msg: 'Comment deleted' })
    } catch (err) {
        logger.error('Failed to delete comment', err)
        res.status(500).send({ err: 'Failed to delete comment' })
    }
}

async function updateComment(req, res) {
    try {
        const comment = req.body
        const id = await commentService.update(comment)
        res.send({ msg: 'Comment updated', id })
    } catch (err) {
        logger.error('Failed to update comment', err)
        res.status(500).send({ err: 'Failed to update comment' })
    }
}

async function addComment(req, res) {
    try {
        const comment = req.body
        const id = await commentService.add(comment)
        res.send({ msg: 'Comment added', id })
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