const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(filterBy, loggedinUser) {
  try {
    return await db.txn(async () => {
      const { type, name, userId } = filterBy;
      if (type === "search") {
        const tags = await db.query(
          `SELECT * FROM tags WHERE name LIKE $name`,
          {
            $name: "%" + name + "%",
          }
        );

        for (const tag of tags) {
          const postIds = await db.query(
            `SELECT postId FROM postTags WHERE tagId = $tagId`,
            { $tagId: tag.id }
          );
          tag.postSum = postIds.length;
          tag.isFollowing = await _checkIsFollowed(tag.id, loggedinUser.id);
        }

        return tags;
      }

      if (type === "followed") {

        const tags = await db.query(
          `SELECT * FROM tags WHERE id IN (
            SELECT tagId FROM followedTags 
            WHERE userId = $userId
            )`,
          { $userId: userId }
        );

        for (const tag of tags) {
          const postIds = await db.query(
            `SELECT postId FROM postTags WHERE tagId = $tagId`,
            { $tagId: tag.id }
          );
          tag.postSum = postIds.length;
          tag.isFollowing = true;
        }

        return tags;
      }
    });
  } catch (err) {
    logger.error("cannot find tags", err);
    throw err;
  }
}

async function getByName(tagName, loggedinUser) {
  try {
    const tags = await db.query(`SELECT * FROM tags WHERE name = $name`, {
      $name: tagName,
    });
    if (tags.length === 0) {
      return "tag not found";
    }
    const tag = tags[0];
    const postIds = await db.query(
      `SELECT postId FROM postTags WHERE tagId = $tagId`,
      { $tagId: tags[0].id }
    );
    tag.postSum = postIds.length;
    tag.isFollowing = await _checkIsFollowed(tag.id, loggedinUser.id);
    return tag;
  } catch (err) {
    logger.error(`while finding tag ${tagName}`, err);
    throw err;
  }
}

async function remove(postId) {
  try {
    const tags = await db.query(
      `SELECT tagId FROM postTags WHERE postId = $id`,
      { $id: postId }
    );

    if (tags.length) {
      await db.exec(`DELETE FROM postTags WHERE postId = $id`, {
        $id: postId,
      });

      for (const tag of tags) {
        const postTags = await db.query(
          `SELECT postId FROM postTags WHERE tagId = $id`,
          { $id: tag.tagId }
        );

        if (postTags.length === 0) {
          await db.exec(`DELETE FROM tags WHERE id = $id`, {
            $id: tag.tagId,
          });
        }
      }
    }
  } catch (err) {
    logger.error(`cannot remove tag ${tagId}`, err);
    throw err;
  }
}

async function add(tag, postId) {
  try {
    let tagId = null;

    const matches = await db.query(`SELECT * FROM tags WHERE name = $name`, {
      $name: tag.name,
    });

    if (!matches.length) {
      tagId = await db.exec(`insert into tags (name) values ($name)`, {
        $name: tag.name,
      });
    } else {
      tagId = matches[0].id;
      const isPostTagExists = await _checkIfPostTagExists(tagId, postId);
      if (isPostTagExists) return;
    }

    await db.exec(
      `insert into postTags (tagId, postId) values ($tagId, $postId)`,
      {
        $tagId: tagId,
        $postId: postId,
      }
    );
  } catch (err) {
    logger.error(`cannot insert tag ${tag._id}`, err);
    throw err;
  }
}

function detectTags(text) {
  const regex = /#(\w+)/g;
  const tags = text.match(regex);
  if (!tags) return [];
  return tags.map((tag) => {
    return { name: tag.replace("#", "") };
  });
}

async function _checkIfPostTagExists(tagId, postId) {
  const postTags = await db.query(
    `SELECT * FROM postTags WHERE tagId = $tagId AND postId = $postId`,
    {
      $tagId: tagId,
      $postId: postId,
    }
  );
  return postTags.length > 0;
}

async function _checkIsFollowed(tagId, userId) {
  const follows = await db.query(
    `SELECT * FROM followedTags WHERE tagId = $tagId AND userId = $userId`,
    {
      $tagId: tagId,
      $userId: userId,
    }
  );
  return follows.length > 0;
}

module.exports = {
  query,
  getByName,
  remove,
  add,
  detectTags,
};
