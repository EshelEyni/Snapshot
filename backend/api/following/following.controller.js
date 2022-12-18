const followingService = require('./following.service.js')
const logger = require('../../services/logger.service')


async function getFollowings(req, res) {
    try {
        const following = await followingService.query(followerId = req.query.followerId)
        res.send(following)
    } catch (err) {
        logger.error('Failed to get following', err)
        res.status(500).send({ err: 'Failed to get following' })
    }
}

async function getFollowing(req, res) {
    try {
        const following = await followingService.getById(req.params.id)
        res.send(following)
    } catch (err) {
        logger.error('Failed to get following', err)
        res.status(500).send({ err: 'Failed to get following' })
    }
}

async function deleteFollowing(req, res) {
    try {
        await followingService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete following', err)
        res.status(500).send({ err: 'Failed to delete following' })
    }
}

async function updateFollowing(req, res) {
    try {
        const following = req.body
        const savedFollowing = await followingService.update(following)
        res.send(savedFollowing)
    } catch (err) {
        logger.error('Failed to update following', err)
        res.status(500).send({ err: 'Failed to update following' })
    }
}

async function addFollowing(req, res) {
    try {
        const following = req.body
        const savedFollowing = await followingService.add(following)
        res.send({ savedFollowing: savedFollowing })
    } catch (err) {
        logger.error('Failed to add following', err)
        res.status(500).send({ err: 'Failed to add following' })
    }
}

module.exports = {
    getFollowings,
    getFollowing,
    deleteFollowing,
    updateFollowing,
    addFollowing
}   