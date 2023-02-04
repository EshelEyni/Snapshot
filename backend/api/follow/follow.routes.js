const express = require('express')
const router = express.Router()
const { requireAuth } = require('../../middlewares/requireAuth.middleware')

const { getFollowings, getFollowers, getFollowing, addFollow, deleteFollow } = require('./follow.controller.js')

router.get('/followings', requireAuth, getFollowings)
router.get('/followers', requireAuth, getFollowers)
router.get('/is-following/:id', requireAuth, getFollowing)
router.post('/:id', requireAuth, addFollow)
router.delete('/:id', requireAuth, deleteFollow)

module.exports = router