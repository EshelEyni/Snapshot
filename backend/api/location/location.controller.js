const locationService = require('./location.service')
const logger = require('../../services/logger.service')

async function getLocations(req, res) {
    try {
        const locations = await locationService.query(req.query.searchTerm)
        res.send(locations)
    } catch (err) {
        logger.error('Failed to get locations', err)
        res.status(500).send({ err: 'Failed to get locations' })
    }
}

async function getLocation(req, res) {
    try {
        const location = await locationService.getById(req.params.id)
        res.send(location)
    } catch (err) {
        logger.error('Failed to get location', err)
        res.status(500).send({ err: 'Failed to get location' })
    }
}

async function deleteLocation(req, res) {
    try {
        await locationService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete location', err)
        res.status(500).send({ err: 'Failed to delete location' })
    }
}

async function updateLocation(req, res) {
    try {
        const location = req.body
        const savedLocation = await locationService.update(location)
        res.send(savedLocation)
    } catch (err) {
        logger.error('Failed to update location', err)
        res.status(500).send({ err: 'Failed to update location' })
    }

}

async function addLocation(req, res) {
    try {
        const location = req.body
        const savedLocation = await locationService.add(location)
        res.send({ savedLocation: savedLocation })
    } catch (err) {
        logger.error('Failed to add location', err)
        res.status(500).send({ err: 'Failed to add location' })
    }
}

module.exports = {
    getLocations,
    getLocation,
    deleteLocation,
    updateLocation,
    addLocation
}
