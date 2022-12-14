const express = require('express')
const router = express.Router()

const { getNotifications, getNotification, updateNotification, addNotification, deleteNotification } = require('./notification.controller')

router.get('/', getNotifications)
router.get('/:id', getNotification)
router.put('/:id', updateNotification)
router.post('/', addNotification)
router.delete('/:id', deleteNotification)


module.exports = router