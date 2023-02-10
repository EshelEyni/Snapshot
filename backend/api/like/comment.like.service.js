const logger = require("../../services/logger.service");
const db = require("../../database");
const noitificationService = require("../notification/notification.service");

async function addLikeToComment(comment, loggedinUserId) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
        `INSERT INTO commentsLikedBy (commentId, userId ) 
            VALUES ($commentId, $userId)`,
        {
          $commentId: comment.id,
          $userId: loggedinUserId,
        }
      );

      await db.exec(
        `UPDATE comments SET likeSum = likeSum + 1 WHERE id = $id`,
        {
          $id: comment.id,
        }
      );

      const posts = await db.query(
        `SELECT id, userId FROM posts WHERE id = (SELECT postId FROM comments WHERE id = $commentId)`,
        {
          $commentId: comment.id,
        }
      );
      const post = posts[0];

      if (comment.by.id !== loggedinUserId) {
        const noitification = {
          type: "like-comment",
          byUserId: loggedinUserId,
          userId: comment.by.id,
          entityId: id,
          postId: post.id,
        };
        await noitificationService.add(noitification);
      }

      return id;
    });
  } catch (err) {
    logger.error("cannot add like", err);
    throw err;
  }
}

async function deleteLikeToComment(commentId, loggedinUserId) {
  try {
    await db.txn(async () => {
      const likes = await db.query(
        `SELECT id FROM commentsLikedBy WHERE commentId = $commentId AND userId = $userId`,
        {
          $commentId: commentId,
          $userId: loggedinUserId,
        }
      );
      const entityId = likes[0].id;

      await db.exec(
        `delete FROM commentsLikedBy WHERE commentId = $commentId AND userId = $userId`,
        {
          $commentId: commentId,
          $userId: loggedinUserId,
        }
      );

      await db.exec(
        `UPDATE comments SET likeSum = likeSum - 1 WHERE id = $id`,
        {
          $id: commentId,
        }
      );

      await db.exec(
        `delete FROM notifications WHERE entityId = $entityId AND type = 'like-comment'`,
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
  addLikeToComment,
  deleteLikeToComment,
};
