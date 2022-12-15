const express = require('express')
const router = express.Router()
// const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getUsers, getUser, updateUser,addUser, deleteUser } = require('./user.controller')

router.get('/:q', getUsers)
router.get('/:id', getUser)
router.put('/',  updateUser)
router.delete('/:id', deleteUser)


module.exports = router