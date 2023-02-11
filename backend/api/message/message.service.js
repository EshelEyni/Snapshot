const logger = require("../../services/logger.service");
const db = require("../../database");
const noitificationService = require("../notification/notification.service");
const postService = require("../post/post.service");
const storyService = require("../story/story.service");

async function getMessages(chatId, loggedinUserId) {
  try {
    return await db.txn(async (txn) => {
      const messages = await db.query(
        `SELECT * FROM chatMessages WHERE chatId = $chatId ORDER BY createdAt ASC`,
        { $chatId: chatId }
      );

      for (const message of messages) {
        message.sender = await _getMessageSender(message.userId);

        if (message.type === "post") {
          message.post = await _getMessagePost(message.postId, loggedinUserId);
        }

        if (message.type === "story") {
          message.story = await _getMessageStory(
            message.storyId,
            loggedinUserId
          );
        }
      }

      return messages;
    });
  } catch (err) {
    logger.error("Failed to get messages", err);
    throw err;
  }
}

async function addMessage(message) {
  try {
    return await db.txn(async (txn) => {
      console.log("message", message);
      const { chatId, sender, type, text, imgUrl, post, story } = message;
      const id = await db.exec(
        `INSERT INTO chatMessages (chatId, userId, type, createdAt, text, imgUrl, postId, storyId) 
            VALUES ($chatId, $userId, $type, $createdAt, $text, $imgUrl, $postId, $storyId )`,
        {
          $chatId: chatId,
          $userId: sender.id,
          $type: type,
          $createdAt: Date.now(),
          $text: text || null,
          $imgUrl: imgUrl || null,
          $postId: post?.id || null,
          $storyId: story?.id || null,
        }
      );

      if (type === "story-like") {
        await db.exec(`UPDATE stories SET isLiked = 1 WHERE id = $storyId`, {
          $storyId: story.id,
        });
      }

      const members = await db.query(
        `SELECT * FROM chatMembers WHERE chatId = $chatId AND userId != $senderId`,
        {
          $chatId: chatId,
          $senderId: sender.id,
        }
      );

      for (const member of members) {
        const notification = {
          type: "message",
          byUserId: sender.id,
          entityId: chatId,
          userId: member.userId,
        };
        await noitificationService.add(notification);
      }

      return id;
    });
  } catch (err) {
    logger.error("Failed to add message", err);
    throw err;
  }
}

async function _getMessageSender(userId) {
  const users = await db.query(
    `SELECT id, username, fullname, imgUrl FROM users WHERE id = $id`,
    {
      $id: userId,
    }
  );
  const user = users[0];
  return user;
}

async function _getMessagePost(postId, loggedinUserId) {
  const posts = await db.query(`SELECT * FROM posts WHERE id = $id`, {
    $id: postId,
  });

  if (posts.length === 0) {
    return "post not found";
  }

  const post = posts[0];
  return await postService.getPostData(post, loggedinUserId);
}

async function _getMessageStory(storyId, loggedinUserId) {
  const stories = await db.query(`SELECT * FROM stories WHERE id = $id`, {
    $id: storyId,
  });

  if (stories.length === 0) {
    return "story not found";
  }
  const story = stories[0];

  return await storyService.getStoryData(story, loggedinUserId);
}

module.exports = {
  getMessages,
  addMessage,
};
