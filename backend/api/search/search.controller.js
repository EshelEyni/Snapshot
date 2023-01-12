const searchService = require('./search.service.js')
const logger = require('../../services/logger.service')

async function getSearches(req, res) {
    try {
        const userId = req.params.id
        const searches = await searchService.query(userId)
        res.send(searches)
    } catch (err) {
        logger.error('Failed to get searches', err)
        res.status(500).send({ err: 'Failed to get searches' })
    }
}


async function addSearch(req, res) {
    try {
        const search = req.body
        const savedSearch = await searchService.add(search)
        res.send({ id: savedSearch })
    } catch (err) {
        logger.error('Failed to add search', err)
        res.status(500).send({ err: 'Failed to add search' })
    }
}

async function deleteSearch(req, res) {
    try {
        await searchService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Failed to delete search', err)
        res.status(500).send({ err: 'Failed to delete search' })
    }
}

async function deleteAllUserSearches(req, res) {
    try {
        await searchService.removeAll(req.params.userId)
        res.end()
    } catch (err) {
        logger.error('Failed to delete all user searches', err)
        res.status(500).send({ err: 'Failed to delete all user searches' })
    }
}

module.exports = {
    getSearches,
    addSearch,
    deleteSearch,
    deleteAllUserSearches
}