const logger = require("../../services/logger.service");
const db = require("../../database");
const commentService = require("../comment/comment.service");

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
        await _getPostData(post, loggedinUser.id);

        if (filter.type === "homepagePosts") {
          await _getDataForHomePage(post, loggedinUser.id);
        }
      }

      return posts;
    });
  } catch (err) {
    logger.error("cannot find posts", err);
    throw err;
  }
}

async function getById(postId) {
  try {
    const posts = await db.query(`select * from posts where id = $id`, {
      $id: postId,
    });
    if (posts.length === 0) {
      return "post not found";
    }
    const post = posts[0];
    const images = await db.query(
      `select * from postImg where postId = $postId`,
      { $postId: postId }
    );
    post.imgUrls = images.map((img) => img.imgUrl);
    const comments = await db.query(
      `select * from comments where postId = $postId`,
      { $postId: postId }
    );
    post.comments = comments.map((comment) => {
      return {
        id: comment.id,
        userId: comment.userId,
        postId: comment.postId,
        commentText: comment.comment_text,
        commentDate: comment.comment_date,
      };
    });
    const user = await db.query(
      `select id, username, fullname, imgUrl from users where id = $id`,
      { $id: post.userId }
    );
    post.by = user[0];
    delete post.userId;
    if (post.locationId) {
      post.location = await db.query(`select * from locations where id = $id`, {
        $id: post.locationId,
      });
    } else {
      post.location = null;
    }
    delete post.locationId;

    const tags = await db.query(
      `select name from tags
                join postTags on tags.id = postTags.tagId
            where postTags.postId = $postId`,
      {
        $postId: postId,
      }
    );

    post.tags = tags.map((tag) => tag.name);

    return post;
  } catch (err) {
    logger.error(`while finding post ${postId}`, err);
    throw err;
  }
}

async function remove(postId) {
  try {
    await db.txn(async () => {
      await db.exec(`delete from postsLikedBy where postId = $id`, {
        $id: postId,
      });
      await db.exec(`delete from savedPosts where postId = $id`, {
        $id: postId,
      });
      await db.exec(`delete from postTags where postId = $id`, { $id: postId });
      await db.exec(`delete from postImg where postId = $id`, { $id: postId });
      /*
            delete from commentsLikedBy where commentId in (
                select id from comments where postId = $id
            )
            */
      const comments = await db.query(
        `select id from comments where postId = $id`,
        { $id: postId }
      );
      for (const comment of comments) {
        await db.exec(`delete from commentsLikedBy where commentId = $id`, {
          $id: comment.id,
        });
      }
      await db.exec(`delete from comments where postId = $id`, { $id: postId });
      await db.exec(
        `update users set postSum = postSum - 1 where id = (select userId from posts where id = $id)`,
        { $id: postId }
      );
      await db.exec(`delete from posts where id = $id`, { $id: postId });
    });
  } catch (err) {
    logger.error(`cannot remove post ${postId}`, err);
    throw err;
  }
}

async function update(post) {
  try {
    await db.txn(async () => {
      await db.exec(
        `update posts set locationId = $locationId, isLikeShown = $isLikeShown,
                 isCommentShown = $isCommentShown, likeSum = $likeSum, commentSum = $commentSum where id = $id`,
        {
          $id: post.id,
          $locationId: post.location?.id,
          $isLikeShown: post.isLikeShown,
          $isCommentShown: post.isCommentShown,
          $likeSum: post.likeSum,
          $commentSum: post.commentSum,
        }
      );
      await db.exec(`delete from postImg where postId = $id`, { $id: post.id });
      for (const i in post.imgUrls) {
        await db.exec(
          `insert into postImg (postId, imgUrl, imgOrder) values ($postId, $imgUrl, $imgOrder)`,
          {
            $postId: post.id,
            $imgUrl: post.imgUrls[i],
            $imgOrder: i,
          }
        );
      }
      await db.exec(`delete from postTags where postId = $id`, {
        $id: post.id,
      });
      for (const tag of post.tags) {
        const matches = await db.query(
          "select id from tags where name = $tag",
          { $tag: tag }
        );
        let tagId = null;
        if (matches.length == 0) {
          tagId = await db.exec("insert into tags (name) values ($tag)", {
            $tag: tag,
          });
        } else {
          tagId = matches[0].id;
        }
        await db.exec(
          `insert into postTags (postId, tagId) values ($postId, $tagId)`,
          {
            $postId: post.id,
            $tagId: tagId,
          }
        );
      }
    });
  } catch (err) {
    logger.error(`cannot update post ${post.id}`, err);
    throw err;
  }
}

async function add(post) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
        `insert into posts (userId, createdAt, isLikeShown, isCommentShown, likeSum, commentSum, locationId) 
                 values ($userId, $createdAt, true, true, 0, $commentSum, $locationId)`,
        {
          $userId: post.by.id,
          $createdAt: Date.now(),
          $locationId: post.location.id === 0 ? null : post.location.id,
          $commentSum: post.commentSum,
        }
      );
      for (const i in post.imgUrls) {
        await db.exec(
          `insert into postImg (postId, imgUrl, imgOrder) values ($postId, $imgUrl, $imgOrder)`,
          {
            $postId: id,
            $imgUrl: post.imgUrls[i],
            $imgOrder: i,
          }
        );
      }
      for (const tag of post.tags) {
        const matches = await db.query(
          "select id from tags where name = $tag",
          { $tag: tag }
        );
        let tagId = null;
        if (matches.length == 0) {
          tagId = await db.exec("insert into tags (name) values ($tag)", {
            $tag: tag,
          });
        } else {
          tagId = matches[0].id;
        }
        await db.exec(
          `insert into postTags (postId, tagId) values ($postId, $tagId)`,
          {
            $postId: id,
            $tagId: tagId,
          }
        );
      }

      await db.exec(
        `update users set postSum = postSum + 1 where id = $userId`,
        { $userId: post.by.id }
      );

      return id;
    });
  } catch (err) {
    logger.error("cannot insert post", err);
    throw err;
  }
}

async function addPostToTag(tagId, postId) {
  try {
    await db.exec(
      `insert into postTags (tagId, postId) values ($tagId, $postId)`,
      {
        $tagId: tagId,
        $postId: postId,
      }
    );
  } catch (err) {
    logger.error(`cannot add post ${postId} to tag ${tagId}`, err);
    throw err;
  }
}

async function _getCreatedPosts(filter) {
  try {
    if (filter.currPostId) {
      return await db.query(
        `select * from posts 
                where id != $currPostId 
                and userId = $userId 
                order by createdAt desc 
                limit $limit `,
        {
          $limit: filter.limit,
          $currPostId: filter.currPostId,
          $userId: filter.userId,
        }
      );
    } else {
      return await db.query(
        `select * from posts 
                where userId = $userId 
                order by createdAt desc 
                limit $limit `,
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
      `select * from posts where id in (select postId from savedPosts where userId = $userId) order by createdAt desc limit $limit `,
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
      console.log("no posts for explore page");
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

async function _getPostData(post, userId) {
  if (post.locationId) {
    post.location = await db.query(`select * from locations where id = $id`, {
      $id: post.locationId,
    });
  } else {
    post.location = null;
  }
  delete post.locationId;

  const images = await db.query(
    `select * from postImg where postId = $postId order by imgOrder`,
    { $postId: post.id }
  );
  post.imgUrls = images.map((img) => img.imgUrl);
  const tags = await db.query(
    `SELECT name FROM tags 
    JOIN postTags ON tags.id = postTags.tagId 
    WHERE postTags.postId = $postId`,
    { $postId: post.id }
  );
  post.tags = tags.map((tag) => tag.name);
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
    { $userId: post.userId, $loggedinUserId: userId }
  );
  if (users.length === 0) throw new Error("user not found: " + post.userId);
  const user = users[0];
  post.by = user;
  post.by.isStoryViewed = !!user.isStoryViewed;
  delete post.userId;
}

async function _getDataForHomePage(post, userId) {
  const isLiked = await db.query(
    `SELECT * FROM postsLikedBy WHERE postId = $postId AND userId = $userId`,
    {
      $postId: post.id,
      $userId: userId,
    }
  );
  post.isLiked = isLiked.length > 0;

  const isSaved = await db.query(
    `SELECT * FROM savedPosts WHERE postId = $postId AND userId = $userId`,
    {
      $postId: post.id,
      $userId: userId,
    }
  );
  post.isSaved = isSaved.length > 0;

  let comments = await db.query(
    `SELECT * FROM comments 
                    WHERE postId = $postId 
                    AND userId = $loggedinUserId 
                    OR userId IN (
                        SELECT toUserId FROM follow 
                        WHERE fromUserId = $loggedinUserId
                    )`,
    {
      $postId: post.id,
      $loggedinUserId: userId,
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

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  addPostToTag,
};