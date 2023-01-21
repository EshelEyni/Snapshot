const logger = require('../../services/logger.service')
const db = require('../../database');
const postService = require('../post/post.service');

async function query(userId) {
    try {
        return await db.txn(async () => {
            const notifications = await db.query(
                `select * from notifications where userId = $userId order by createdAt desc limit 30`,
                { $userId: userId }
            );
            if (notifications.length === 0) return [];

            for (const notification of notifications) {
                const user = await db.query(
                    `select * from users where id = $id`,
                    { $id: notification.byUserId }
                );
                notification.by = user[0];
                delete notification.byUserId;

                if (notification.postId) {
                    const post = await postService.getById(notification.postId);
                    notification.post = post;
                    delete notification.postId;
                }
            }

            return notifications
        })
    } catch (err) {
        logger.error('cannot find notifications', err)
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

async function add(notification) {
    try {
        const result = await db.exec(
            `insert into notifications (userId, byUserId, type, postId, createdAt, entityId)
             values ($userId, $byUserId, $type, $postId, $createdAt, $entityId)`, {
            $type: notification.type,
            $byUserId: notification.byUserId,
            $userId: notification.userId,
            $entityId: notification.entityId,
            $createdAt: Date.now(),
            $postId: notification.postId ? notification.postId : null
        })
        return result
    } catch (err) {
        logger.error(`cannot insert notification ${notification._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    remove,
    add
}