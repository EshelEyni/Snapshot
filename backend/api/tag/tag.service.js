const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(filterBy) {
  try {
    return await db.txn(async () => {
      const tags = await db.query(`select * from tags where name like $name`, {
        $name: filterBy.name + "%",
      });

      for (const tag of tags) {
        const postIds = await db.query(
          `select postId from postTags where tagId = $tagId`,
          { $tagId: tag.id }
        );
        tag.postIds = postIds.map((postId) => postId.postId);
      }

      return tags;
    });
  } catch (err) {
    logger.error("cannot find tags", err);
    throw err;
  }
}

async function getByName(tagName) {
  try {
    const tags = await db.query(`select * from tags where name = $name`, {
      $name: tagName,
    });
    if (tags.length === 0) {
      return "tag not found";
    }
    const tag = tags[0];
    const postIds = await db.query(
      `select postId from postTags where tagId = $tagId`,
      { $tagId: tags[0].id }
    );
    tag.postIds = postIds.map((postId) => postId.postId);
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

async function update(tag) {
  try {
    await db.exec(`update tags set name = $name where id = $id`, {
      $name: tag.name,
      $id: tag.id,
    });
    return tag;
  } catch (err) {
    logger.error(`cannot update tag ${tag._id}`, err);
    throw err;
  }
}

async function add(tag, postId) {
  try {
    let tagId = null;

    const matches = await db.query(`select * from tags where name = $name`, {
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

async function getFollowedTags(userId) {
  try {
    return await db.txn(async () => {
      const followedTags = await db.query(
        `select * from followedTags where userId = $userId`,
        { $userId: userId }
      );

      const tags = await db.query(
        `select * from tags where id in (${followedTags
          .map((tag) => tag.tagId)
          .join(",")})`
      );

      for (const tag of tags) {
        const postIds = await db.query(
          `select postId from postTags where tagId = $tagId`,
          { $tagId: tag.id }
        );
        tag.postIds = postIds.map((postId) => postId.postId);
      }

      return tags;
    });
  } catch (err) {
    logger.error(`cannot get followed tags for userId: ${userId}`, err);
    throw err;
  }
}

async function getFollowedStatus(userId, tagId) {
  try {
    const followedTags = await db.query(
      `select * from followedTags where userId = $userId and tagId = $tagId`,
      { $userId: userId, $tagId: tagId }
    );
    return followedTags.length > 0;
  } catch (err) {
    logger.error(`cannot get followed tags for userId: ${userId}`, err);
    throw err;
  }
}

async function follow(userId, tagId) {
  try {
    const isFollowed = await db.query(
      `select * from followedTags where userId = $userId and tagId = $tagId`,
      { $userId: userId, $tagId: tagId }
    );
    if (isFollowed.length > 0) {
      return isFollowed[0].id;
    }

    const id = await db.exec(
      `insert into followedTags (userId, tagId) values ($userId, $tagId)`,
      {
        $userId: userId,
        $tagId: tagId,
      }
    );

    return id;
  } catch (err) {
    logger.error(`cannot follow tag ${tagId}`, err);
    throw err;
  }
}

async function unFollow(userId, tagId) {
  try {
    await db.exec(
      `delete from followedTags where userId = $userId and tagId = $tagId`,
      {
        $userId: userId,
        $tagId: tagId,
      }
    );
  } catch (err) {
    logger.error(`cannot unfollow tag ${tagId}`, err);
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
    `select * from postTags where tagId = $tagId and postId = $postId`,
    {
      $tagId: tagId,
      $postId: postId,
    }
  );
  return postTags.length > 0;
}

module.exports = {
  query,
  getByName,
  remove,
  update,
  add,
  getFollowedTags,
  getFollowedStatus,
  follow,
  unFollow,
  detectTags,
};
