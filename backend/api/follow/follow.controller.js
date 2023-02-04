const followService = require('./follow.service.js')
const logger = require('../../services/logger.service')

async function getFollowings(req, res) {
    const { loggedinUser } = req
    try {
        const followings = await followService.getFollowings(loggedinUser.id)
        res.send(followings)
    } catch (err) {
        logger.error('Failed to get following', err)
        throw err
    }
}

async function getFollowers(req, res) {
    const { loggedinUser } = req
    try {
        const isFollowing = await followService.getFollowers(loggedinUser.id)
        res.send({isFollowing})
    } catch (err) {
        logger.error('Failed to get followers', err)
        throw err
    }
}


async function getFollowing(req, res) {
    const { loggedinUser } = req
    const toUserId = req.params.id
    try {
        const following = await followService.getFollowing(loggedinUser.id, toUserId)
        res.send(following)
    } catch (err) {
        logger.error('Failed to get following', err)
        throw err
    }
}

async function addFollow(req, res) {
    const { loggedinUser } = req
    const followingId = req.params.id
    try {
        const following = await followService.add(loggedinUser.id, followingId)
        res.send(following)
    } catch (err) {
        logger.error('Failed to add follow', err)
        throw err
    }
}


async function deleteFollow(req, res) {
    const { loggedinUser } = req
    const followingId = req.params.id
    try {
        const following = await followService.delete(loggedinUser.id, followingId)
        if(!following) return res.status(404).send({ msg: 'Follow not found' })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete follow', err)
        throw err
    }
}

module.exports = {
    getFollowings,
    getFollowers,
    getFollowing,
    addFollow,
    deleteFollow
}