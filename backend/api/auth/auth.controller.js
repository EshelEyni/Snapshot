const authService = require('./auth.service')
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
        res.status(401).send({ err })
    }
}

async function signup(req, res) {
    try {
        const { username, password, fullname, email } = req.body
        await authService.signup(username, password, fullname, email)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(username, email))
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        logger.info('User login: ', user)
        res.cookie('loginToken', loginToken)
        res.json(user)
    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err })
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

module.exports = {
    login,
    signup,
    logout,
}