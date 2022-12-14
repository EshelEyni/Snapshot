const notificationService = require('./notification.service');
const logger = require('../../services/logger.service')


async function getNotifications(req, res) {
    try {
        const notifications = await notificationService.query(req.query)
        res.send(notifications)
    } catch (err) {
        logger.error('Failed to get notifications', err)
        res.status(500).send({ err: 'Failed to get notifications' })
    }
}

async function getNotification(req, res) {
    try {
        const notification = await notificationService.getById(req.params.id)
        res.send(notification)
    } catch (err) {
        logger.error('Failed to get notification', err)
        res.status(500).send({ err: 'Failed to get notification' })
    }
}


async function deleteNotification(req, res) {
    try {
        await notificationService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete notification', err)
        res.status(500).send({ err: 'Failed to delete notification' })
    }
}

async function updateNotification(req, res) {
    try {
        const notification = req.body
        const savedNotification = await notificationService.update(notification)
        res.send(savedNotification)
    } catch (err) {
        logger.error('Failed to update notification', err)
        res.status(500).send({ err: 'Failed to update notification' })
    }
}

async function addNotification(req, res) {
    try {
        const notification = req.body
        const savedNotification = await notificationService.add(notification)
        res.send({ savedNotification: savedNotification })
    } catch (err) {
        logger.error('Failed to add notification', err)
        res.status(500).send({ err: 'Failed to add notification' })
    }
}

module.exports = {
    getNotifications,
    getNotification,
    deleteNotification,
    updateNotification,
    addNotification
}