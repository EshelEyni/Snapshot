const express = require('express')
const router = express.Router()

const { getFollowings, getFollowing, updateFollowing, addFollowing, deleteFollowing } = require('./following.controller.js')
 
router.get('/', getFollowings)
router.get('/:id', getFollowing)
router.put('/:id', updateFollowing)
router.post('/', addFollowing)
router.delete('/', deleteFollowing)
 
module.exports = router