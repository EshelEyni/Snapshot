const tagService = require('./tag.service')
const logger = require('../../services/logger.service')

async function getTags(req, res) {
    try {
        const tags = await tagService.query({ name: req.query.name })
        res.send(tags)
    } catch (err) {
        logger.error('Failed to get tags', err)
        res.status(500).send({ err: 'Failed to get tags' })
    }
}

async function getTag(req, res) {
    try {
        const tag = await tagService.getByName(req.params.name)
        res.send(tag)
    } catch (err) {
        logger.error('Failed to get tag', err)
        res.status(500).send({ err: 'Failed to get tag' })
    }
}

async function deleteTag(req, res) {
    try {
        await tagService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete tag', err)
        res.status(500).send({ err: 'Failed to delete tag' })
    }
}

async function updateTag(req, res) {
    try {
        const tag = req.body
        const savedTag = await tagService.update(tag)
        res.send(savedTag)
    } catch (err) {
        logger.error('Failed to update tag', err)
        res.status(500).send({ err: 'Failed to update tag' })
    }
}

async function addTag(req, res) {
    try {
        const tag = req.body
        const id = await tagService.add(tag)
        res.send({ msg: 'Tag added', id })
    } catch (err) {
        logger.error('Failed to add tag', err)
        res.status(500).send({ err: 'Failed to add tag' })
    }
}

module.exports = {
    getTags,
    getTag,
    deleteTag,
    updateTag,
    addTag
}