const express = require('express')
const router = express.Router()

const { getSavedPost, savePost, unsavePost } = require('./saved-post.controller.js')

router.get('/', getSavedPost)
router.post('/', savePost)
router.delete('/', unsavePost)

module.exports = router