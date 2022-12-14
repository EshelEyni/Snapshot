const express = require('express')
const router = express.Router()

const { getLocations, getLocation, updateLocation, addLocation, deleteLocation } = require('./location.controller')

router.get('/', getLocations)
router.get('/:id', getLocation)
router.put('/:id', updateLocation)
router.post('/', addLocation)
router.delete('/:id', deleteLocation)


module.exports = router