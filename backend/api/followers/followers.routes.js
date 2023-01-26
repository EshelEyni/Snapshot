const express = require('express')
const router = express.Router()

const { getFollowers, getFollower, updateFollower, addFollower, deleteFollower } = require('./follower.controller')

router.get('/', getFollowers)
router.get('/:id', getFollower)
router.put('/:id', updateFollower)
router.post('/', addFollower)
router.delete('/', deleteFollower)

module.exports = router
// Compare this snippet from api\Follower\Follower.service.js: