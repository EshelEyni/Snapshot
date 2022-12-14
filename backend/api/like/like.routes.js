const express = require('express')
const router = express.Router()

const { getLikesForPost,  addLikeToPost, deleteLikeToPost } = require('./post.like.controller')
const { getLikesForComment,  addLikeToComment, deleteLikeToComment } = require('./comment.like.controller')
const { getLikesForStory,  addLikeToStory, deleteLikeToStory } = require('./story.like.controller.js')


router.get('/post/:id', getLikesForPost)
router.post('/post', addLikeToPost)
router.delete('/post', deleteLikeToPost)

router.get('/comment/:id', getLikesForComment)
router.post('/comment', addLikeToComment)
router.delete('/comment', deleteLikeToComment)

router.get('/story/:id', getLikesForStory)
router.post('/story', addLikeToStory)
router.delete('/story', deleteLikeToStory)


module.exports = router