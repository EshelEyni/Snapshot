const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { queryUsers, getUserById, updateUser, deleteUser, checkPassword, chekIfUsernameTaken } = require('./user.controller')

router.get('/', queryUsers)
router.get('/search', queryUsers)
router.get('/id/:id', getUserById)
router.put('/', updateUser)
router.delete('/:id', deleteUser)
router.get('/check-password', checkPassword)
router.get('/check-username/:username', requireAuth, chekIfUsernameTaken)

module.exports = router 