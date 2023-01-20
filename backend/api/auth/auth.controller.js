const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user, loginToken)
        res.cookie('loginToken', loginToken)

        res.json(user)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname, email } = req.body
        const id = await authService.signup(username, password, fullname, email)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(username, email))
        await authService.login(username, password)
        const user = await userService.getById(id)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

async function checkPassword(req, res) {
    try {
        const { newPassword, password, username } = req.query;
        const hashedPassword = await authService.checkPassword(username, password, newPassword)
        res.send({ hashedPassword })
    } catch (err) {
        res.status(500).send({ err: 'Failed to check password' })
    }
}


module.exports = {
    login,
    signup,
    logout,
    checkPassword
}