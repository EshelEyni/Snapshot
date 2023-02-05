const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { queryUsers, getUserById, updateUser, deleteUser, checkPassword, chekIfUsernameTaken } = require('./user.controller')

router.get('/', requireAuth, queryUsers)
router.get('/search', requireAuth, queryUsers)
router.get('/id/:id', requireAuth, getUserById)
router.put('/', requireAuth, updateUser)
router.delete('/:id', requireAuth, deleteUser)
router.get('/check-password', requireAuth, checkPassword)
router.get('/check-username/:username', requireAuth, chekIfUsernameTaken)

module.exports = router  