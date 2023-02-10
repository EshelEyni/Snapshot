const logger = require("../../services/logger.service");
const db = require("../../database");
const noitificationService = require("../notification/notification.service");
const tagsService = require("../tag/tag.service");

async function query({ postId, userId, type }) {
  try {
    if (type === "post-preview") {
      let userIds = [userId];
      const followingIds = await db.query(
        `select toUserId from follow where fromUserId = $userId`,
        { $userId: userId }
      );
      userIds = userIds.concat(
        followingIds.map((following) => following.toUserId)
      );
      let commentIds = [];
      for (let i = 0; i < userIds.length; i++) {
        const currCommentIds = await db.query(
          `select id from comments where postId = $postId 
                        and userId = $userId`,
          {
            $postId: postId,
            $userId: userIds[i],
          }
        );
        commentIds = commentIds.concat(currCommentIds);
      }
      let comments = commentIds.map((commentId) => {
        return getById(commentId.id);
      });
      comments = await Promise.all(comments);
      return comments;
    } else if (type === "post-details") {
      const commentIds = await db.query(
        `select id from comments where postId = $postId`,
        { $postId: postId }
      );
      let comments = commentIds.map((commentId) => {
        return getById(commentId.id);
      });
      comments = await Promise.all(comments);
      return comments;
    } else if (type === "chat-post-preview") {
      const commentId = await db.query(
        `select id from comments where postId = $postId and userId = $userId and isOriginalText = 1 limit 1`,
        {
          $postId: postId,
          $userId: userId,
        }
      );

      if (!commentId.length) {
        return [];
      } else {
        const comment = await getById(commentId[0].id);
        return [comment];
      }
    }
  } catch (err) {
    logger.error("cannot find comments", err);
    throw err;
  }
}

async function getById(commentId) {
  try {
    return await db.txn(async () => {
      const comments = await db.query(`select * from comments where id = $id`, {
        $id: commentId,
      });
      if (comments.length === 0) {
        return "comment not found";
      }
      const comment = comments[0];
      const user = await db.query(
        `select id, username, fullname, imgUrl from users where id = $id limit 1`,
        { $id: comment.userId }
      );
      comment.by = user[0];
      delete comment.userId;

      comment.mentions = await getCommentMentions(comment);
      return comment;
    });
  } catch (err) {
    logger.error(`while finding comment ${commentId}`, err);
    throw err;
  }
}

async function remove(loggedinUser, commentId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `delete from commentsLikedBy where commentId = $id and userId = $loggedinUserId`,
        {
          $id: commentId,
          $loggedinUserId: loggedinUser.id,
        }
      );

      const post = await db.query(
        `select postId from comments where id = $id`,
        { $id: commentId }
      );

      await tagsService.remove(post.postId);

      await db.exec(
        `delete from notifications where entityId = $entityId and byUserId = $loggedinUserId and type = 'comment'`,
        {
          $entityId: commentId,
          $loggedinUserId: loggedinUser.id,
        }
      );
      await db.exec(
        `delete from comments where id = $id and userId = $loggedinUserId`,
        {
          $id: commentId,
          $loggedinUserId: loggedinUser.id,
        }
      );
    });
  } catch (err) {
    logger.error(`cannot remove comment ${commentId}`, err);
    throw err;
  }
}

async function update(comment) {
  try {
    await db.exec(
      `update comments set userId = $userId,
             postId = $postId,
             text = $text,
             createdAt = $createdAt,
             isOriginalText = $isOriginalText,
             likeSum = $likeSum where id = $id`,
      {
        $userId: comment.by.id,
        $postId: comment.postId,
        $text: comment.text,
        $createdAt: comment.createdAt,
        $isOriginalText: comment.isOriginalText,
        $likeSum: comment.likeSum,
        $id: comment.id,
      }
    );
    return comment;
  } catch (err) {
    logger.error(`cannot update comment ${comment._id}`, err);
    throw err;
  }
}

async function add(comment) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
        `insert into comments (userId, postId, text, createdAt, isOriginalText, likeSum) 
             values ($userId, $postId, $text, $createdAt, $isOriginalText, $likeSum)`,
        {
          $userId: comment.by.id,
          $postId: comment.postId,
          $text: comment.text,
          $createdAt: Date.now(),
          $isOriginalText: comment.isOriginalText,
          $likeSum: 0,
        }
      );

      const users = await db.query(`select userId from posts where id = $id`, {
        $id: comment.postId,
      });
      const userId = users[0].userId;

      if (userId !== comment.by.id) {
        const noitification = {
          type: "comment",
          byUserId: comment.by.id,
          entityId: id,
          userId,
          postId: comment.postId,
        };
        await noitificationService.add(noitification);
      }

      comment.tags = tagsService.detectTags(comment.text);
      if (comment.tags.length) {
        for (const tag of comment.tags) {
          await tagsService.add(tag, comment.postId);
        }
      }

      comment.mentions = await getCommentMentions(comment);
      await sendMentionNotifications(comment, id);
      return comment;
    });
  } catch (err) {
    logger.error("cannot insert comment", err);
    throw err;
  }
}

async function getCommentMentions(comment) {
  try {
    const mentionRegex = /@(\w+)/g;
    let mentions = comment.text.match(mentionRegex);
    if (mentions) {
      mentions = mentions.map((mention) => {
        return mention.slice(1);
      });
      const users = [];
      for (let i = 0; i < mentions.length; i++) {
        const u = await db.query(
          `select id, username from users where username = $username`,
          { $username: mentions[i] }
        );
        if (u.length) users.push(u[0]);
      }

      return users.map((user) => {
        return { userId: user.id, username: user.username };
      });
    }
    return [];
  } catch (err) {
    logger.error(`cannot get comment mentions`, err);
    throw err;
  }
}

async function sendMentionNotifications(comment, commentId) {
  try {
    if (!comment.mentions.length) return;
    const mentionedUserIds = comment.mentions.map((u) => u.userId);
    mentionedUserIds.forEach(async (mentionedUserId) => {
      if (mentionedUserId === comment.by.id) return;
      const noitification = {
        type: "mention",
        byUserId: comment.by.id,
        entityId: commentId,
        userId: mentionedUserId,
        postId: comment.postId,
      };
      await noitificationService.add(noitification);
    });
  } catch (err) {
    logger.error("cannot send mention notifications", err);
    throw err;
  }
}

module.exports = {
  query,
  getById,
  getCommentMentions,
  remove,
  update,
  add,
  sendMentionNotifications,
};
