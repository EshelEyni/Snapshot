const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(loggedinUserId, type) {
  try {
    return await db.txn(async () => {
      let stories = [];
      switch (type) {
        case "home-page":
          stories = await db.query(
            `SELECT s.* FROM stories s
                        LEFT JOIN follow f ON f.toUserId = s.userId
                        WHERE f.fromUserId = $id AND s.isArchived = 0
                        OR s.userId = $id AND s.isArchived = 0
                        ORDER BY s.createdAt DESC`,
            { $id: loggedinUserId }
          );
          break;

        case "story-details":
          stories = await db.query(
            `SELECT s.* 
            FROM stories s
            LEFT JOIN follow f ON f.toUserId = s.userId
            WHERE f.fromUserId = $id OR s.userId = $id
            GROUP BY s.userId
            ORDER BY MAX(s.createdAt) DESC`,
            { $id: loggedinUserId }
          );
          break;

        case "profile-details":
          stories = await db.query(
            `SELECT * FROM stories WHERE userId = $id AND isSaved = 1 ORDER BY createdAt ASC`,
            { $id: loggedinUserId }
          );
          break;

        case "highlight-story-picker":
          stories = await db.query(
            `SELECT * FROM stories WHERE userId = $id AND isSaved = 0 ORDER BY createdAt ASC`,
            { $id: loggedinUserId }
          );
          break;
      }

      for (const story of stories) {
        await getStoryData(story, loggedinUserId);
      }
      return stories;
    });
  } catch (err) {
    logger.error("cannot find stories", err);
    throw err;
  }
}

async function getById(storyId, loggedinUserId) {
  try {
    return await db.txn(async () => {
      const stories = await db.query(`SELECT * FROM stories WHERE id = $id`, {
        $id: storyId,
      });

      if (stories.length === 0) {
        return "story not found";
      }
      const story = stories[0];

      return await getStoryData(story, loggedinUserId);
    });
  } catch (err) {
    logger.error(`while finding story ${storyId}`, err);
    throw err;
  }
}

async function add(story) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
        `INSERT INTO stories (userId, createdAt, isLiked, isArchived, isSaved, savedAt, highlightTitle, highlightCover) 
                  VALUES ($userId, $createdAt, $isLiked, $isArchived, $isSaved, $savedAt, $highlightTitle, $highlightCover)`,
        {
          $userId: story.by.id,
          $createdAt: Date.now(),
          $isLiked: false,
          $isArchived: false,
          $isSaved: false,
          $savedAt: null,
          $highlightTitle: null,
          $highlightCover: null,
        }
      );

      for (const i of story.imgUrls) {
        await db.exec(
          `INSERT INTO storyImg (storyId, imgUrl) VALUES ($storyId, $imgUrl)`,
          {
            $storyId: id,
            $imgUrl: i,
          }
        );
      }

      await db.exec(`UPDATE users SET storySum = storySum + 1 WHERE id = $id`, {
        $id: story.by.id,
      });

      return id;
    });
  } catch (err) {
    logger.error(`cannot add story`, err);
    throw err;
  }
}

async function update(story) {
  try {
    await db.exec(
      `UPDATE stories SET userId = $userId,
               isLiked = $isLiked,
               isArchived = $isArchived,
               isSaved = $isSaved,
               savedAt = $savedAt,
               highlightTitle = $highlightTitle,
               highlightCover = $highlightCover
               WHERE id = $id`,
      {
        $userId: story.userId,
        $id: story.id,
        $isLiked: story.isLiked,
        $isArchived: story.isArchived,
        $isSaved: story.isSaved,
        $savedAt: story.isSaved ? Date.now() : null,
        $highlightTitle: story.highlightTitle,
        $highlightCover: story.highlightCover,
      }
    );
    return story;
  } catch (err) {
    logger.error(`cannot update story ${story._id}`, err);
    throw err;
  }
}

async function remove(storyId, loggedinUserId) {
  try {
    return await db.txn(async () => {
      const stories = await db.query(`SELECT * FROM stories WHERE id = $id`, {
        $id: storyId,
      });

      if (stories.length === 0) {
        return "story not found";
      }
      const story = stories[0];
      if (story.userId !== loggedinUserId) {
        return "Unauthorized";
      }

      await db.exec(`DELETE FROM storyImg WHERE storyId = $id`, {
        $id: storyId,
      });
      await db.exec(`DELETE FROM storyViews WHERE storyId = $id`, {
        $id: storyId,
      });
    
      await db.exec(
        `UPDATE users SET storySum = storySum - 1 WHERE id = (SELECT userId FROM stories WHERE id = $id)`,
        { $id: storyId }
      );
      await db.exec(`DELETE FROM stories WHERE id = $id`, { $id: storyId });
    });
  } catch (err) {
    logger.error(`cannot remove story ${storyId}`, err);
    throw err;
  }
}

async function addView(storyId, loggedinUserId) {
  try {
    return await db.txn(async () => {
      const views = await db.query(
        `SELECT * FROM storyViews WHERE storyId = $storyId AND userId = $userId`,
        {
          $storyId: storyId,
          $userId: loggedinUserId,
        }
      );
      if (views.length > 0) return;
      await db.exec(
        `INSERT INTO storyViews (storyId, userId) 
                VALUES ($storyId, $userId)`,
        {
          $storyId: storyId,
          $userId: loggedinUserId,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot add view to story`, err);
    throw err;
  }
}

async function getStoryData(story, loggedinUserId) {
  try {
    const images = await db.query(
      `SELECT * FROM storyImg WHERE storyId = $storyId`,
      { $storyId: story.id }
    );
    story.imgUrls = images.map((img) => img.imgUrl);

    const users = await db.query(`SELECT * FROM users WHERE id = $id`, {
      $id: story.userId,
    });
    if (users.length === 0) throw new Error("user not found: " + story.userId);
    const user = users[0];
    story.by = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      currStoryId: story.id,
    };
    const storyViews = await db.query(
      `SELECT * FROM storyViews 
                WHERE storyId = $storyId 
                AND userId = $loggedinUserId`,
      { $storyId: story.id, $loggedinUserId: loggedinUserId }
    );

    story.by.isStoryViewed = storyViews.length > 0;
    return story;
  } catch (err) {
    logger.error(`cannot get story data`, err);
    throw err;
  }
}

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  addView,
  getStoryData,
};
