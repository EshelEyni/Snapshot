const logger = require("../../services/logger.service");
const db = require("../../database");
const noitificationService = require("../notification/notification.service");
const tagsService = require("../tag/tag.service");

async function add(comment) {
  try {
    return await db.txn(async () => {
      const id = await db.exec(
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
      comment.id = id;
      
      const users = await db.query(`SELECT userId FROM posts WHERE id = $id`, {
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

async function remove(loggedinUser, commentId) {
  try {
    await db.txn(async () => {
      await db.exec(
        `DELETE FROM commentsLikedBy WHERE commentId = $id AND userId = $loggedinUserId`,
        {
          $id: commentId,
          $loggedinUserId: loggedinUser.id,
        }
      );

      const post = await db.query(
        `SELECT postId FROM comments WHERE id = $id`,
        { $id: commentId }
      );

      await tagsService.remove(post.postId);

      await db.exec(
        `DELETE FROM notifications WHERE entityId = $entityId AND byUserId = $loggedinUserId AND type = 'comment'`,
        {
          $entityId: commentId,
          $loggedinUserId: loggedinUser.id,
        }
      );
      await db.exec(
        `DELETE FROM comments WHERE id = $id AND userId = $loggedinUserId`,
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
          `SELECT id, username FROM users WHERE username = $username`,
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
  add,
  remove,
  getCommentMentions,
  sendMentionNotifications,
};
