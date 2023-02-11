const logger = require("../../services/logger.service");
const db = require("../../database");
const noitificationService = require("../notification/notification.service");

async function getLikesForPost(postId,loggedinUserId) {
  try {
    const likes = await db.query(
      `SELECT 
      u.id, 
      u.username, 
      u.fullname, 
      u.imgUrl,
      (
        SELECT 
          COUNT(*) 
        FROM follow 
        WHERE fromUserId = $loggedinUserId 
        AND toUserId = u.id
      ) > 0 AS isFollowing  
      FROM postsLikedBy l
      LEFT JOIN users u ON u.id = l.userId
      WHERE postId = $postId`,
      {
        $postId: postId,
        $loggedinUserId: loggedinUserId,
      }
    );

    return likes;
  } catch (err) {
    logger.error("cannot find likes", err);
    throw err;
  }
}

async function addLikeToPost(post, loggedinUserId) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
        `INSERT INTO postsLikedBy (postId, userId) 
            VALUES ($postId, $userId)`,
        {
          $postId: post.id,
          $userId: loggedinUserId,
        }
      );

      await db.exec(`UPDATE posts SET likeSum = likeSum + 1 WHERE id = $postId`, {
        $postId: post.id,
      });

      if (post.by.id !== loggedinUserId) {
        const noitification = {
          type: "like-post",
          byUserId: loggedinUserId,
          userId: post.by.id,
          entityId: id,
          postId: post.id,
        };
        await noitificationService.add(noitification);
      }
    });
  } catch (err) {
    logger.error("cannot add like", err);
    throw err;
  }
}

async function deleteLikeToPost(postId, userId) {
  try {
    await db.txn(async () => {
      const likes = await db.query(
        `SELECT id FROM postsLikedBy WHERE postId = $postId AND userId = $userId`,
        {
          $postId: postId,
          $userId: userId,
        }
      );
      const entityId = likes[0].id;

      await db.exec(
        `delete FROM postsLikedBy WHERE postId = $postId AND userId = $userId`,
        {
          $postId: postId,
          $userId: userId,
        }
      );

      await db.exec(`UPDATE posts SET likeSum = likeSum - 1 WHERE id = $postId`, {
        $postId: postId,
      });

      await db.exec(
        `delete FROM notifications WHERE entityId = $entityId AND type = 'like-post'`,
        {
          $entityId: entityId,
        }
      );
    });
  } catch (err) {
    logger.error("cannot delete like", err);
    throw err;
  }
}

module.exports = {
  getLikesForPost,
  addLikeToPost,
  deleteLikeToPost,
};
