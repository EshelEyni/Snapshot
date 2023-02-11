const logger = require("../../services/logger.service");
const db = require("../../database");
const commentService = require("../comment/comment.service");
const tagsService = require("../tag/tag.service");

async function query(filter, loggedinUser) {
  try {
    return await db.txn(async () => {
      let posts;

      switch (filter.type) {
        case "homepagePosts":
          posts = await _getPostsForHomepage(filter);
          break;
        case "explorePagePosts":
          posts = await _getPostsForExplorePage(filter);
          break;
        case "tagDetailsPagePosts":
          posts = await _getPostsForTagDetailsPage(filter);
          break;
        case "createdPosts":
          posts = await _getCreatedPosts(filter);
          break;
        case "savedPosts":
          posts = await _getSavedPosts(filter);
          break;
        case "taggedPosts":
          posts = await _getTaggedPosts(filter);
          break;
        default:
          break;
      }

      for (const post of posts) {
        await getPostData(post, loggedinUser.id);

        if (filter.type === "homepagePosts") {
          await _getPostLikeAndBookmark(post, loggedinUser.id);
          await _getCommentsForHomepagePost(post, loggedinUser.id);
        } else {
          await _getCommentForMiniPreview(post);
        }
      }

      return posts;
    });
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function getById(postId, loggedinUserId) {
  try {
    return db.txn(async () => {
      const posts = await db.query(`SELECT * FROM posts WHERE id = $id`, {
        $id: postId,
      });

      if (posts.length === 0) {
        return "post not found";
      }

      const post = posts[0];

      await getPostData(post, loggedinUserId);
      await _getPostLikeAndBookmark(post, loggedinUserId);
      await _getCommentsForPostDetailsPage(post, loggedinUserId);

      return post;
    });
  } catch (err) {
    logger.error(`while finding post ${postId}`, err);
    throw err;
  }
}

async function add(post) {
  try {
    return await db.txn(async () => {
      const postId = await db.exec(
        `INSERT INTO posts (userId, createdAt, isLikeShown, isCommentShown, likeSum, locationId) 
                 VALUES ($userId, $createdAt, true, true, 0, $locationId)`,
        {
          $userId: post.by.id,
          $createdAt: Date.now(),
          $locationId: post.location.id === 0 ? null : post.location.id,
        }
      );

      for (const i in post.imgUrls) {
        await db.exec(
          `INSERT INTO postImg (postId, imgUrl, imgOrder) VALUES ($postId, $imgUrl, $imgOrder)`,
          {
            $postId: postId,
            $imgUrl: post.imgUrls[i],
            $imgOrder: i,
          }
        );
      }

      if (post.comments.length) {
        const comment = post.comments[0];
        comment.postId = postId;

        const commentId = await db.exec(
          `INSERT INTO comments (userId, postId, text, createdAt, isOriginalText, likeSum) 
          VALUES ($userId, $postId, $text, $createdAt, $isOriginalText, $likeSum)`,
          {
            $userId: comment.by.id,
            $postId: comment.postId,
            $text: comment.text,
            $createdAt: Date.now(),
            $isOriginalText: comment.isOriginalText,
            $likeSum: 0,
          }
        );

        post.tags = tagsService.detectTags(comment.text);
        if (post.tags.length) {
          for (const tag of post.tags) {
            await tagsService.add(tag, postId);
          }
        }

        comment.mentions = await commentService.getCommentMentions(comment);
        await commentService.sendMentionNotifications(comment, commentId);
      }

      await db.exec(
        `UPDATE users SET postSum = postSum + 1 WHERE id = $userId`,
        { $userId: post.by.id }
      );

      post.id = postId;
      return post;
    });
  } catch (err) {
    logger.error("cannot insert post", err);
    throw err;
  }
}

async function update(post) {
  try {
    await db.txn(async () => {
      await db.exec(
        `UPDATE posts SET isLikeShown = $isLikeShown,
                 isCommentShown = $isCommentShown WHERE id = $id`,
        {
          $id: post.id,
          $isLikeShown: post.isLikeShown,
          $isCommentShown: post.isCommentShown,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot update post ${post.id}`, err);
    throw err;
  }
}

async function remove(postId, loggedinUserId) {
  try {
    await db.txn(async () => {
      const posts = await db.query(`SELECT * FROM posts WHERE id = $id`, {
        $id: postId,
      });
      if (posts.length === 0) {
        return "post not found";
      }
      const post = posts[0];
      if (post.userId !== loggedinUserId) {
        return "Unauthorized";
      }

      await db.exec(`DELETE FROM postsLikedBy WHERE postId = $id`, {
        $id: postId,
      });
      await db.exec(`DELETE FROM savedPosts WHERE postId = $id`, {
        $id: postId,
      });

      await tagsService.remove(postId);

      await db.exec(`DELETE FROM postImg WHERE postId = $id`, { $id: postId });

      await db.exec(
        `DELETE FROM commentsLikedBy WHERE commentId IN (SELECT id FROM comments WHERE postId = $id)`,
        {
          $id: postId,
        }
      );

      await db.exec(`DELETE FROM comments WHERE postId = $id`, { $id: postId });

      await db.exec(
        `update users set postSum = postSum - 1 WHERE id = (SELECT userId FROM posts WHERE id = $id)`,
        { $id: postId }
      );

      await db.exec(`DELETE FROM posts WHERE id = $id`, { $id: postId });
    });
  } catch (err) {
    logger.error(`cannot remove post ${postId}`, err);
    throw err;
  }
}

async function _getCreatedPosts(filter) {
  try {
    if (filter.currPostId) {
      return await db.query(
        `SELECT * FROM posts 
                WHERE id != $currPostId 
                AND userId = $userId 
                ORDER BY createdAt DESC 
                LIMIT $limit `,
        {
          $limit: filter.limit,
          $currPostId: filter.currPostId,
          $userId: filter.userId,
        }
      );
    } else {
      return await db.query(
        `SELECT * FROM posts 
                WHERE userId = $userId 
                ORDER BY createdAt DESC 
                LIMIT $limit `,
        {
          $limit: filter.limit,
          $userId: filter.userId,
        }
      );
    }
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function _getSavedPosts(filter) {
  try {
    return await db.query(
      `SELECT * FROM posts WHERE id in (SELECT postId FROM savedPosts WHERE userId = $userId) ORDER BY createdAt DESC LIMIT $limit `,
      {
        $limit: filter.limit,
        $userId: filter.userId,
      }
    );
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function _getTaggedPosts(filter) {
  try {
    return await db.query(
      `
        SELECT DISTINCT p.*
        FROM posts p
        JOIN postTags pt ON p.id = pt.postId
        JOIN tags t ON pt.tagId = t.id
        WHERE t.name = $username
        ORDER BY p.createdAt DESC
        LIMIT $limit`,
      {
        $username: filter.username,
        $limit: filter.limit,
      }
    );
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function _getPostsForHomepage(filter) {
  try {
    let posts;
    posts = await db.query(
      `
        SELECT p.*
        FROM posts p
        LEFT JOIN follow f ON p.userId = f.toUserId
        WHERE f.fromUserId = $userId OR p.userId = $userId
        ORDER BY p.createdAt DESC
        LIMIT $limit`,
      {
        $userId: filter.userId,
        $limit: filter.limit,
      }
    );
    if (posts.length === 0) {
      posts = await db.query(
        `
            SELECT * FROM posts
            ORDER BY likeSum DESC
            LIMIT $limit`,
        {
          $limit: filter.limit,
        }
      );
    }
    return posts;
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function _getPostsForExplorePage(filter) {
  try {
    let posts;

    posts = await db.query(
      `
        SELECT p.*
        FROM posts p
        WHERE p.userId != $userId AND p.userId NOT IN (
            SELECT toUserId FROM follow WHERE fromUserId = $userId
        )
        ORDER BY p.createdAt DESC
        LIMIT $limit`,
      {
        $userId: filter.userId,
        $limit: filter.limit,
      }
    );

    if (posts.length === 0) {
      posts = await db.query(
        `
            SELECT * FROM posts
            ORDER BY likeSum DESC
            LIMIT $limit`,
        {
          $limit: filter.limit,
        }
      );
    }

    return posts;
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function _getPostsForTagDetailsPage(filter) {
  try {
    const posts = await db.query(
      ` 
        SELECT p.*
        FROM posts p
        JOIN postTags pt ON p.id = pt.postId
        JOIN tags t ON pt.tagId = t.id
        WHERE t.name = $tag
        ORDER BY p.createdAt DESC
        LIMIT $limit`,
      {
        $tag: filter.tagName,
        $limit: filter.limit,
      }
    );
    return posts;
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function getPostData(post, loggedinUserId) {
  const images = await db.query(
    `SELECT * FROM postImg WHERE postId = $postId ORDER BY imgOrder`,
    { $postId: post.id }
  );
  post.imgUrls = images.map((img) => img.imgUrl);

  const users = await db.query(
    `SELECT     
                  users.id, 
                  users.username, 
                  users.fullname, 
                  users.imgUrl, 
                  stories.id AS currStoryId, 
                  storyViews.userId AS isStoryViewed
                  FROM 
                  users 
                  LEFT JOIN stories ON users.id = stories.userId 
                  AND stories.isArchived = 0
                  LEFT JOIN storyViews ON stories.id = storyViews.storyId 
                  AND storyViews.userId = $loggedinUserId
                  WHERE 
                  users.id = $userId`,
    { $userId: post.userId, $loggedinUserId: loggedinUserId }
  );
  if (users.length === 0) throw new Error("user not found: " + post.userId);
  const user = users[0];
  post.by = user;
  post.by.isStoryViewed = !!user.isStoryViewed;

  delete post.userId;

  if (post.locationId) {
    post.location = await db.query(`SELECT * FROM locations WHERE id = $id`, {
      $id: post.locationId,
    });
  } else {
    post.location = null;
  }
  delete post.locationId;

  const tags = await db.query(
    `SELECT name FROM tags 
    JOIN postTags ON tags.id = postTags.tagId 
    WHERE postTags.postId = $postId`,
    { $postId: post.id }
  );
  post.tags = tags.map((tag) => tag.name);
}

async function _getPostLikeAndBookmark(post, loggedinUserId) {
  const isLiked = await db.query(
    `SELECT * FROM postsLikedBy WHERE postId = $postId AND userId = $userId`,
    {
      $postId: post.id,
      $userId: loggedinUserId,
    }
  );
  post.isLiked = isLiked.length > 0;

  const isSaved = await db.query(
    `SELECT * FROM savedPosts WHERE postId = $postId AND userId = $userId`,
    {
      $postId: post.id,
      $userId: loggedinUserId,
    }
  );
  post.isSaved = isSaved.length > 0;
}

async function _getCommentForMiniPreview(post) {
  post.comments = await db.query(
    `SELECT id FROM comments WHERE postId = $postId`,
    {
      $postId: post.id,
    }
  );
}

async function _getCommentsForHomepagePost(post, loggedinUserId) {
  let comments = await db.query(
    `SELECT * FROM comments 
                    WHERE postId = $postId 
                    AND userId = $loggedinUserId 
                    OR postId = $postId
                    AND userId IN (
                        SELECT toUserId FROM follow 
                        WHERE fromUserId = $loggedinUserId
                    )`,
    {
      $postId: post.id,
      $loggedinUserId: loggedinUserId,
    }
  );

  for (const comment of comments) {
    const user = await db.query(
      `SELECT id, username, fullname, imgUrl FROM users WHERE id = $id LIMIT 1`,
      { $id: comment.userId }
    );
    comment.by = user[0];
    delete comment.userId;
    comment.mentions = await commentService.getCommentMentions(comment);
  }
  post.comments = comments;
}

async function _getCommentsForPostDetailsPage(post, loggedinUserId) {
  const comments = await db.query(
    `SELECT * FROM comments WHERE postId = $postId`,
    { $postId: post.id }
  );

  for (const comment of comments) {
    const users = await db.query(
      `SELECT id, username, fullname, imgUrl FROM users WHERE id = $id`,
      { $id: comment.userId }
    );
    comment.by = users[0];
    delete comment.userId;

    const likes = await db.query(
      `SELECT userId FROM commentsLikedBy 
      WHERE commentId = $commentId
      AND userId = $userId`,
      { $commentId: comment.id, $userId: loggedinUserId }
    );
    comment.isLiked = likes.length > 0;
  }

  post.comments = comments;
}

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  getPostData,
};
