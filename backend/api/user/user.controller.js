const userService = require('./user.service')
const logger = require('../../services/logger.service')
// const socketService = require('../../services/socket.service')



async function getUsers(req, res) {
    console.log('req.query', req.params.q)
    try {
        const users = await userService.query(req.params.q)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function addUser(req, res) {
    try {
        const currUser = req.body
        const user = await userService.add(currUser)
        res.send({ user: user })
    } catch (err) {
        logger.error('Failed to add user', err)
        res.status(500).send({ err: 'Failed to add user' })
    }
}

async function updateUser(req, res) {
    try {
        const userToUpdate = req.body
        console.log('userToUpdate', userToUpdate)
        const updatedUser = await userService.update(userToUpdate)
        // socketService.broadcast({ type: 'user-updated', data: updatedUser, userId: updatedUser._id })
        res.send(updatedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

module.exports = {
    getUser,
    getUsers,
    addUser,
    deleteUser,
    updateUser
}