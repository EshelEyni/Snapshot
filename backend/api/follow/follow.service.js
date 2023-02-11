const logger = require("../../services/logger.service");
const db = require("../../database");

async function getFollowings(userId, loggedinUserId) {
  try {
    const followings = await db.query(
      `SELECT 
        users.id, 
        users.username, 
        users.fullname, 
        users.imgUrl,
        (
            SELECT 
              COUNT(*) 
            FROM follow 
            WHERE fromUserId = $loggedinUserId 
            AND toUserId = users.id
          ) > 0 AS isFollowing  
      FROM follow
        JOIN users ON follow.toUserId = users.id
        WHERE follow.fromUserId = $userId`,
      { $userId: userId, $loggedinUserId: loggedinUserId }
    );

    return followings;
  } catch (err) {
    logger.error("cannot find followings", err);
    throw err;
  }
}

async function getFollowers(userId, loggedinUserId) {
  try {
    const followers = await db.query(
      `SELECT
      users.id, 
      users.username, 
      users.fullname, 
      users.imgUrl,
      (
        SELECT 
          COUNT(*) 
        FROM follow 
        WHERE fromUserId = $loggedinUserId 
        AND toUserId = users.id
      ) > 0 AS isFollowing  
      FROM follow 
             JOIN users ON follow.fromUserId = users.id
             WHERE toUserId = $userId`,
      { $userId: userId, $loggedinUserId: loggedinUserId }
    );

    return followers;
  } catch (err) {
    logger.error("cannot find followers", err);
    throw err;
  }
}

async function add(fromUserId, toUserId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `INSERT INTO follow (fromUserId, toUserId) VALUES ($fromUserId, $toUserId)`,
        {
          $fromUserId: fromUserId,
          $toUserId: toUserId,
        }
      );

      await db.exec(
        `UPDATE users SET followersSum = followersSum + 1 WHERE id = $toUserId`,
        {
          $toUserId: toUserId,
        }
      );

      await db.exec(
        `UPDATE users SET followingSum = followingSum + 1 WHERE id = $fromUserId`,
        {
          $fromUserId: fromUserId,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot add follow`, err);
    throw err;
  }
}

async function remove(fromUserId, toUserId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `DELETE FROM follow WHERE fromUserId = $fromUserId and toUserId = $toUserId`,
        {
          $fromUserId: fromUserId,
          $toUserId: toUserId,
        }
      );

      await db.exec(
        `UPDATE users SET followersSum = followersSum - 1 WHERE id = $toUserId`,
        {
          $toUserId: toUserId,
        }
      );

      await db.exec(
        `UPDATE users SET followingSum = followingSum - 1 WHERE id = $fromUserId`,
        {
          $fromUserId: fromUserId,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot remove follow`, err);
    throw err;
  }
}

module.exports = {
  getFollowings,
  getFollowers,
  add,
  remove,
};
