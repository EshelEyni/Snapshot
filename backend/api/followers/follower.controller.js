const followerService = require('./follower.service.js')
const logger = require('../../services/logger.service')


async function getFollowers(req, res) {
    try {
        const followers = await followerService.query(userId = req.query.userId)
        res.send(followers)
    } catch (err) {
        logger.error('Failed to get followers', err)
        res.status(500).send({ err: 'Failed to get followers' })
    }
}

async function getFollower(req, res) {
    try {
        const follower = await followerService.getById(req.params.id)
        res.send(follower)
    } catch (err) {
        logger.error('Failed to get follower', err)
        res.status(500).send({ err: 'Failed to get follower' })
    }
}

async function deleteFollower(req, res) {
    try {
        await followerService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete follower', err)
        res.status(500).send({ err: 'Failed to delete follower' })
    }
}

async function updateFollower(req, res) {
    try {
        const follower = req.body
        const savedFollower = await followerService.update(follower)
        res.send(savedFollower)
    } catch (err) {
        logger.error('Failed to update follower', err)
        res.status(500).send({ err: 'Failed to update follower' })
    }
}

async function addFollower(req, res) {
    try {
        const follower = req.body
        const savedFollower = await followerService.add(follower)
        res.send({ savedFollower: savedFollower })
    } catch (err) {
        logger.error('Failed to add follower', err)
        res.status(500).send({ err: 'Failed to add follower' })
    }
}

module.exports = {
    getFollowers,
    getFollower,
    deleteFollower,
    updateFollower,
    addFollower
}