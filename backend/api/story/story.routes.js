const express = require('express')
const router = express.Router()

const { getStories, getStory, updateStory, addStory, deleteStory } = require('./story.controller')

router.get('/', getStories)
router.get('/:id', getStory)
router.put('/:id', updateStory)
router.post('/', addStory)
router.delete('/:id', deleteStory)


module.exports = router