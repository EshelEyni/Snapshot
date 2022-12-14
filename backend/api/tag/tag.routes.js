const express = require('express')
const router = express.Router()

const { getTags, getTag, updateTag,addTag, deleteTag } = require('./tag.controller')


router.get('/', getTags)
router.get('/:id', getTag)
router.put('/:id',  updateTag)
router.post('/',  addTag)
router.delete('/:id', deleteTag)


module.exports = router