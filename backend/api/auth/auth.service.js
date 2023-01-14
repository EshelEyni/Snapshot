const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const config = require('../../config')
const db = require('../../database');

const cryptr = new Cryptr(config.sessionKey)

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname, email) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname || !email) return Promise.reject('fullname, username and password are required!')

    const isUserExists = await _checkIfUserExists(username)
    if (!isUserExists) return Promise.reject(`Username ${username} already exists!`)

    const hash = await bcrypt.hash(password, saltRounds)
    const user = { username, password: hash, fullname, email }
    return userService.add(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user.id))
}

async function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUserId = JSON.parse(json)
        const loggedinUser = await userService.getById(loggedinUserId)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token: ' + err)
    }
    return null
}

async function _checkIfUserExists(username) {
    try {
        const users = await db.query(`select * from users where username = $username`, { $username: username });
        return users.length === 0
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}