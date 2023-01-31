const userService = require('./user.service')
const logger = require('../../services/logger.service')

async function queryUsers(req, res) {

    try {
        const users = await userService.query(req.query)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUserById(req, res) {
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
        const updatedUser = await userService.update(userToUpdate)
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

async function checkPassword(req, res) {
    try {
        const { newPassword, password, userId } = req.query;
        const hashedPassword = await userService.checkPassword(userId, password, newPassword)
        res.send({ hashedPassword })
    } catch (err) {
        res.status(500).send({ err: 'Failed to check password' })
    }
}

async function chekIfUsernameTaken(req, res) {
    try {
        const { username } = req.params;
        const chekIfUsernameTaken = await userService.chekIfUsernameTaken(username)
        res.send({ chekIfUsernameTaken })
    } catch (err) {
        res.status(500).send({ err: 'Failed to check if user exists' })
    }
}

module.exports = {
    queryUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser,
    checkPassword,
    chekIfUsernameTaken
}