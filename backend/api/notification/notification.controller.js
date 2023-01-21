const notificationService = require('./notification.service');
const logger = require('../../services/logger.service')


async function getNotifications(req, res) {

    try {
        const userId = req.query.userId
        const notifications = await notificationService.query(userId)
        res.send(notifications)
    } catch (err) {
        logger.error('Failed to get notifications', err)
        res.status(500).send({ err: 'Failed to get notifications' })
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
    deleteNotification,
    addNotification
}