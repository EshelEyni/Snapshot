
const express = require('express')
const router = express.Router()

const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getComments, getComment, updateComment, addComment, deleteComment } = require('./comment.controller')


router.get('/', getComments)
router.get('/:id', getComment)
router.put('/:id', updateComment)
router.post('/', addComment)
router.delete('/:id', requireAuth, deleteComment)

module.exports = router