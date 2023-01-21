const logger = require('../../services/logger.service')
const likeService = require('./comment.like.service')

async function getLikesForComment(req, res) {
    try {
        const likes = await likeService.getLikesForComment(req.query.commentId, req.query.userId)
        res.send(likes)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get likes' })
    }
}

async function addLikeToComment(req, res) {
    try {
        const { comment, user } = req.body
        const id = await likeService.addLikeToComment({ comment, user })
        res.send({ id })
    } catch (err) {
        res.status(500).send({ err: 'Failed to add like' })
    }
}

async function deleteLikeToComment(req, res) {
    try {
        const { commentId, userId } = req.body
        await likeService.deleteLikeToComment({ commentId, userId })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to delete like' })
    }
}

module.exports = {
    getLikesForComment,
    addLikeToComment,
    deleteLikeToComment
}