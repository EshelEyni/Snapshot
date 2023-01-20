const express = require('express')
const { login, signup, logout,checkPassword } = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/check-password', checkPassword)

module.exports = router