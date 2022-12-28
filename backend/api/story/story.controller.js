const storyService = require('./story.service');
const logger = require('../../services/logger.service')

async function getStories(req, res) {
    try {
        const stories = await storyService.query(req.query)
        res.send(stories)
    } catch (err) {
        logger.error('Failed to get stories', err)
        res.status(500).send({ err: 'Failed to get stories' })
    }
}

async function getStory(req, res) {
    try {
        const story = await storyService.getById(req.params.id)
        res.send(story)
    } catch (err) {
        logger.error('Failed to get story', err)
        res.status(500).send({ err: 'Failed to get story' })
    }
}

async function deleteStory(req, res) {
    try {
        await storyService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete story', err)
        res.status(500).send({ err: 'Failed to delete story' })
    }
}

async function updateStory(req, res) {
    try {
        const story = req.body
        const savedStory = await storyService.update(story)
        res.send(savedStory)
    } catch (err) {
        logger.error('Failed to update story', err)
        res.status(500).send({ err: 'Failed to update story' })
    }
}

async function addStory(req, res) {
    try {
        const story = req.body
        const id = await storyService.add(story)
        res.send({ msg: 'Story added', id })
    } catch (err) {
        logger.error('Failed to add story', err)
        res.status(500).send({ err: 'Failed to add story' })
    }
}

module.exports = {
    getStories,
    getStory,
    deleteStory,
    updateStory,
    addStory
}
