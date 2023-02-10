const logger = require("../../services/logger.service");
const db = require("../../database");

async function follow(tagId, userId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `insert into followedTags (userId, tagId) values ($userId, $tagId)`,
        {
          $userId: userId,
          $tagId: tagId,
        }
      );

      await db.exec(
        `update users set followingSum = followingSum + 1 where id = $userId`,
        {
          $userId: userId,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot follow tag ${tagId}`, err);
    throw err;
  }
}

async function unFollow(tagId, userId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `delete FROM followedTags WHERE userId = $userId AND tagId = $tagId`,
        {
          $userId: userId,
          $tagId: tagId,
        }
      );

      await db.exec(
        `update users set followingSum = followingSum - 1 where id = $userId`,
        {
          $userId: userId,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot unfollow tag ${tagId}`, err);
    throw err;
  }
}

module.exports = {
  //   getFollowedTags,
  follow,
  unFollow,
};
