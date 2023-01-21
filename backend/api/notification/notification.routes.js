const express = require('express')
const router = express.Router()

const { getNotifications,  addNotification, deleteNotification } = require('./notification.controller')

router.get('/', getNotifications)
router.post('/', addNotification)
router.delete('/:id', deleteNotification)

module.exports = router