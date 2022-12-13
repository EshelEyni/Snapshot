const express = require('express')
const router = express.Router()
// const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getUsers, getUser, updateUser,addUser, deleteUser } = require('./user.controller')

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id',  updateUser)
router.post('/',  addUser)
router.delete('/:id', deleteUser)


module.exports = router