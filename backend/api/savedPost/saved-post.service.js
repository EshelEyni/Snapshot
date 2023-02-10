const logger = require("../../services/logger.service");
const db = require("../../database");

async function save(postId, userId) {
  try {
    await db.exec(
      `INSERT INTO savedPosts (postId, userId) VALUES ($postId, $userId)`,
      {
        $postId: postId,
        $userId: userId,
      }
    );
  } catch (err) {
    logger.error("cannot save post", err);
    throw err;
  }
}

async function unsave(postId, userId) {
  try {
    await db.exec(
      `DELETE FROM savedPosts
             WHERE postId = $postId 
             AND userId = $userId`,
      {
        $postId: postId,
        $userId: userId,
      }
    );
  } catch (err) {
    logger.error("cannot unsave post", err);
    throw err;
  }
}

module.exports = {
  save,
  unsave,
};
