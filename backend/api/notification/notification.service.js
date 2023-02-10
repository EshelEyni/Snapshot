const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(userId) {
  try {
    return await db.txn(async () => {
      const notifications = await db.query(
        `SELECT * FROM notifications WHERE userId = $userId ORDER BY createdAt DESC LIMIT 30`,
        { $userId: userId }
      );
      if (notifications.length === 0) return [];

      for (const notification of notifications) {
        const user = await db.query(`SELECT * FROM users WHERE id = $id`, {
          $id: notification.byUserId,
        });
        notification.by = user[0];
        delete notification.byUserId;

        if (notification.postId) {
          const postImg = await db.query(
            `SELECT imgUrl FROM postImg WHERE postId = $id`,
            { $id: notification.postId }
          );
          notification.postImgUrl = postImg[0].imgUrl;
        }
      }

      return notifications;
    });
  } catch (err) {
    logger.error("cannot find notifications", err);
    throw err;
  }
}

async function remove(notificationId) {
  try {
    await db.exec(`DELETE FROM notifications WHERE id = $id`, {
      $id: notificationId,
    });
  } catch (err) {
    logger.error(`cannot remove notification ${notificationId}`, err);
    throw err;
  }
}

async function add(notification) {
  try {
    const result = await db.exec(
      `INSERT INTO notifications (userId, byUserId, type, postId, createdAt, entityId)
             VALUES ($userId, $byUserId, $type, $postId, $createdAt, $entityId)`,
      {
        $type: notification.type,
        $byUserId: notification.byUserId,
        $userId: notification.userId,
        $entityId: notification.entityId,
        $createdAt: Date.now(),
        $postId: notification.postId ? notification.postId : null,
      }
    );
    return result;
  } catch (err) {
    logger.error(`cannot insert notification ${notification._id}`, err);
    throw err;
  }
}

module.exports = {
  query,
  remove,
  add,
};
