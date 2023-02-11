const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(loggedinUserId) {
  try {
    return await db.txn(async () => {
      const searches = await db.query(
        `SELECT * FROM recentSearches 
                WHERE searcherId = $searcherId
                ORDER BY id ASC
                LIMIT 50
                `,
        {
          $searcherId: loggedinUserId,
        }
      );

      for (const search of searches) {
        if (search.type === "user") {
          const users = await db.query(
            `SELECT 
              users.id, 
              users.username, 
              users.fullname, 
              users.imgUrl, 
              stories.id AS currStoryId, 
              storyViews.userId AS isStoryViewed 
            FROM users 
            LEFT JOIN stories ON stories.userId = users.id AND stories.isArchived = 0 
            LEFT JOIN storyViews ON storyViews.storyId = stories.id AND storyViews.userId = $loggedinUserId 
            WHERE users.id = $id`,
            {
              $id: search.searchItemId,
              $loggedinUserId: loggedinUserId,
            }
          );

          const user = users[0];
          search.item = user;
        } else if (search.type === "tag") {
          const tags = await db.query(`SELECT * FROM tags WHERE id = $id`, {
            $id: search.searchItemId,
          });
          const tag = tags[0];
          const postIds = await db.query(
            `SELECT * FROM postTags WHERE tagId = $id`,
            { $id: search.searchItemId }
          );
          tag.postSum = postIds.length;
          search.item = tag;
        }
      }

      delete searches.searcherId;
      delete searches.searchItemId;

      return searches;
    });
  } catch (err) {
    logger.error("cannot get searches", err);
    throw err;
  }
}

async function add(search, loggedinUserId) {
  try {
    const { type, itemId } = search;

    const searches = await db.query(
      `SELECT * FROM recentSearches
        WHERE searcherId = $searcherId
        AND type = $type
        AND searchItemId = $searchItemId`,
      {
        $searcherId: loggedinUserId,
        $type: type,
        $searchItemId: itemId,
      }
    );

    if (searches.length) {
      return;
    }

    await db.exec(
      `INSERT INTO recentSearches (searcherId, type, searchItemId)
            VALUES ($searcherId, $type, $searchItemId)`,
      {
        $searcherId: loggedinUserId,
        $type: type,
        $searchItemId: itemId,
      }
    );
  } catch (err) {
    logger.error("cannot add search", err);
    throw err;
  }
}

async function remove(searchId, loggedinUserId) {
  try {
    await db.exec(
      `DELETE FROM recentSearches 
    WHERE searchItemId = $id
    AND searcherId = $loggedinUserId`,
      {
        $loggedinUserId: loggedinUserId,
        $id: searchId,
      }
    );
  } catch (err) {
    logger.error(`cannot remove search ${searchId}`, err);
    throw err;
  }
}

async function removeAll(loggedinUserId) {
  try {
    await db.exec(
      `DELETE FROM recentSearches WHERE searcherId = $loggedinUserId`,
      {
        $loggedinUserId: loggedinUserId,
      }
    );
  } catch (err) {
    logger.error(`cannot remove searches ${userId}`, err);
    throw err;
  }
}

module.exports = {
  query,
  add,
  remove,
  removeAll,
};
