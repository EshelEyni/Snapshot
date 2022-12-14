const logger = require('../../services/logger.service')
const db = require('../../database');

async function query() {
    try {
        const notifications = await db.query(`select * from notifications`);
        return notifications
    } catch (err) {
        logger.error('cannot find notifications', err)
        throw err
    }
}

async function getById(notificationId) {
    try {
        const notifications = await db.query(`select * from notifications where id = $id`, { $id: notificationId });
        if (notifications.length === 0) {
            return 'notification not found';
        }
        return notifications[0]
    } catch (err) {
        logger.error(`while finding notification ${notificationId}`, err)
        throw err
    }
}

async function remove(notificationId) {
    try {
        await db.exec(`delete from notifications where id = $id`, { $id: notificationId });
    } catch (err) {
        logger.error(`cannot remove notification ${notificationId}`, err)
        throw err
    }
}

async function update(notification) {
    try {
        await db.exec(`update notifications set userId = $userId, byUserId = $byUserId, type = $type, postImg = $postImg, createdAt = $createdAt where id = $id`, {
            $userId: notification.userId,
            $byUserId: notification.byUserId,
            $type: notification.type,
            $postImg: notification.postImg,
            $createdAt: notification.createdAt,
            $id: notification.id

        })
        return notification
    } catch (err) {
        logger.error(`cannot update notification ${notification._id}`, err)
        throw err
    }
}

async function add(notification) {
    try {
        const result = await db.exec(`insert into notifications (userId, byUserId, type, postImg, createdAt) values ($userId, $byUserId, $type, $postImg, $createdAt)`, {
            $userId: notification.userId,
            $byUserId: notification.byUserId,
            $type: notification.type,
            $postImg: notification.postImg,
            $createdAt: notification.createdAt
        })
        return result
    } catch (err) {
        logger.error(`cannot insert notification ${notification._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}