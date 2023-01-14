const express = require('express')
const router = express.Router()
// const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { queryUsers, getUser, getUserByName, updateUser, addUser, deleteUser } = require('./user.controller')

router.get('/', queryUsers)
router.get('/search', queryUsers)
router.get('/id/:id', getUser)
router.get('/name/:name', getUserByName)
router.put('/', updateUser) 
router.delete('/:id', deleteUser)


module.exports = router 