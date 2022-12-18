const express = require('express')
const router = express.Router()

const { getPosts, getPost, updatePost, addPost, deletePost } = require('./post.controller')

router.get('/', getPosts)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.post('/', addPost)
router.delete('/:id', deletePost)

module.exports = router