const express = require('express')
const router = express.Router()

const { getSearches, addSearch, deleteSearch,deleteAllUserSearches } = require('./search.controller.js')

router.get('/:id', getSearches)
router.post('/', addSearch)
router.delete('/:id', deleteSearch)
router.delete('/clear/:userId', deleteAllUserSearches)


module.exports = router