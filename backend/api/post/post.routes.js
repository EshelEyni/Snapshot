const express = require('express')
const router = express.Router()

const { getPosts, getPost, updatePost, addPost, deletePost,addPostToTag } = require('./post.controller')

router.get('/', getPosts)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.post('/', addPost)
router.post('/tag', addPostToTag)
router.delete('/:id', deletePost)

module.exports = router