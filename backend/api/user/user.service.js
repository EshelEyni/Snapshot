const logger = require("../../services/logger.service");
const db = require("../../database");
const bcrypt = require("bcrypt");

async function query(filterBy, loggedinUserId) {
  try {
    let users;
    const { type, limit, searchTerm } = filterBy;

    return await db.txn(async () => {
      if (searchTerm) {
        users = await db.query(
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
      WHERE users.username LIKE $searchTerm OR users.email LIKE $searchTerm OR users.bio LIKE $searchTerm 
      ORDER BY username 
      LIMIT 100`,
          {
            $searchTerm: "%" + filterBy.searchTerm + "%",
            $loggedinUserId: loggedinUserId,
          }
        );
      } else if (type === "suggested") {
        users = await db.query(
          `WITH CTE AS (
                        SELECT id, username, fullname, imgUrl,
                        (
                          SELECT 
                            COUNT(*) 
                          FROM follow 
                          WHERE fromUserId = $loggedinUserId 
                          AND toUserId = users.id
                        ) > 0 AS isFollowing
                        FROM users
                        WHERE id IN (
                          SELECT dst.toUserId
                          FROM follow AS src
                            JOIN follow AS dst ON src.toUserId = dst.fromUserId
                          WHERE src.fromUserId = $loggedinUserId
                        )
                        AND id NOT IN (
                          SELECT toUserId
                          FROM follow WHERE fromUserId = $loggedinUserId
                        )
                        AND id != $loggedinUserId
                      )
                      SELECT *
                      FROM (
                        SELECT * FROM CTE
                        UNION ALL
                        SELECT id, username, fullname, imgUrl,
                        (
                          SELECT 
                            COUNT(*) 
                          FROM follow 
                          WHERE fromUserId = $loggedinUserId 
                          AND toUserId = users.id
                        ) > 0 AS isFollowing
                        FROM users
                        WHERE (SELECT COUNT(*) FROM CTE) = 0
                        AND id != $loggedinUserId
                        ) sub
                      ORDER BY RANDOM() 
                      LIMIT $limit
                    `,
          {
            $loggedinUserId: loggedinUserId,
            $limit: limit,
          }
        );
      } else {
        users = await db.query(
          `SELECT id,
          username, 
          fullname, 
          imgUrl,
          stories.id AS currStoryId, 
          storyViews.userId AS isStoryViewed,
          (
            SELECT 
              COUNT(*) 
            FROM follow 
            WHERE fromUserId = $loggedinUserId 
            AND toUserId = users.id
          ) > 0 AS isFollowing 
           FROM users
           LEFT JOIN stories ON stories.userId = users.id AND stories.isArchived = 0 
           LEFT JOIN storyViews ON storyViews.storyId = stories.id AND storyViews.userId = $loggedinUserId 
                    ORDER BY username 
                    LIMIT $limit`,
          {
            $loggedinUserId: loggedinUserId,
            $limit: limit,
          }
        );
      }

      return users;
    });
  } catch (err) {
    logger.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    return await db.txn(async () => {
      const users = await db.query(`SELECT * FROM users WHERE id = $id`, {
        $id: userId,
      });
      if (users.length === 0) {
        throw "user with id #" + userId + " was not found";
      }
      const user = users[0];
      user.isDarkMode = !!user.isDarkMode;

      const stories = await db.query(
        `SELECT * FROM stories 
                    WHERE userId = $id 
                    AND isArchived = 0
                    ORDER BY createdAt ASC
                    LIMIT 1 `,
        { $id: userId }
      );

      if (!stories.length) {
        user.currStoryId = null;
        user.isStoryViewed = false;
        return user;
      }

      const currStoryId = stories[0];

      const storyViews = await db.query(
        `SELECT * FROM storyViews WHERE storyId = $id AND userId = $userId`,
        { $id: currStoryId.id, $userId: userId }
      );

      user.currStoryId = currStoryId.id;
      user.isStoryViewed = storyViews.length > 0;

      return user;
    });
  } catch (err) {
    logger.error(`while finding user ${userId}`, err);
    throw err;
  }
}

// For login
async function getByUsername(username) {
  try {
    const users = await db.query(
      `SELECT * FROM users WHERE username = $username`,
      { $username: username }
    );
    if (users.length === 0) {
      throw "user with name " + username + " was not found";
    }
    const user = users[0];
    user.isDarkMode = !!user.isDarkMode;

    const stories = await db.query(
      `SELECT * FROM stories 
                WHERE userId = $id 
                AND isArchived = 0
                ORDER BY createdAt ASC
                LIMIT 1 `,
      { $id: user.id }
    );

    if (!stories.length) {
      user.currStoryId = null;
      return user;
    }

    const currStoryId = stories[0];
    user.currStoryId = currStoryId.id;

    return user;
  } catch (err) {
    logger.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    await db.txn(async () => {
      /***** CHAT *****/
      let chatIds = await db.query(
        `SELECT id FROM chats 
                WHERE id IN (
                SELECT chatId
                FROM chatMembers
                WHERE userId = $id
                )`,
        { $id: userId }
      );

      chatIds = chatIds.map((chat) => chat.id);

      await db.exec(`DELETE FROM chatMessages WHERE userId = $id`, {
        $id: userId,
      });
      await db.exec(`DELETE FROM chatMembers WHERE userId = $id`, {
        $id: userId,
      });

      for (const chatId of chatIds) {
        const members = await db.query(
          `SELECT * FROM chatMembers WHERE chatId = $id`,
          { $id: chatId }
        );
        if (members.length === 1) {
          await db.exec(`DELETE FROM chatMessages WHERE chatId = $id`, {
            $id: chatId,
          });
          await db.exec(`DELETE FROM chatMembers WHERE chatId = $id`, {
            $id: chatId,
          });
          await db.exec(`DELETE FROM chats WHERE id = $id`, { $id: chatId });
        }
      }

      /***** COMMENTS *****/
      await db.exec(
        `
            DELETE FROM commentslikedby
            WHERE commentId IN (
                SELECT id
                FROM comments
                WHERE userId = $id
                        )`,
        { $id: userId }
      );

      await db.exec(`DELETE FROM commentslikedby WHERE userId = $id`, {
        $id: userId,
      });
      await db.exec(`DELETE FROM comments WHERE userId = $id`, { $id: userId });

      /***** FOLLOW *****/
      await db.exec(`DELETE FROM follow WHERE fromUserId = $id`, {
        $id: userId,
      });
      await db.exec(`DELETE FROM follow WHERE toUserId = $id`, { $id: userId });

      /***** NOTIFICATIONS *****/
      await db.exec(`DELETE FROM notifications WHERE userId = $id`, {
        $id: userId,
      });
      await db.exec(`DELETE FROM notifications WHERE byUserId = $id`, {
        $id: userId,
      });

      /***** POSTS *****/
      await db.exec(
        `DELETE FROM postImg
             WHERE postId IN (
             SELECT id
             FROM posts
             WHERE userId = $id
             )`,
        { $id: userId }
      );

      await db.exec(
        `DELETE FROM postsLikedBy
             WHERE postId IN (
             SELECT id
             FROM posts
             WHERE userId = $id
            )`,
        { $id: userId }
      );

      await db.exec(`DELETE FROM postsLikedBy WHERE userId = $id`, {
        $id: userId,
      });

      let tagIds = await db.query(
        `SELECT tagId FROM postTags 
            WHERE postId IN (
            SELECT id
            FROM posts
            WHERE userId = $id
            )`,
        { $id: userId }
      );

      tagIds = tagIds.map((tag) => tag.tagId);

      await db.exec(
        `DELETE FROM postTags 
            WHERE postId IN (
            SELECT id
            FROM posts
            WHERE userId = $id
            )`,
        { $id: userId }
      );

      await db.exec(`DELETE FROM followedTags WHERE userId = $id`, {
        $id: userId,
      });

      for (const tagId of tagIds) {
        const postsWithTag = await db.query(
          `SELECT * FROM postTags WHERE tagId = $id`,
          { $id: tagId }
        );
        if (!postsWithTag.length) {
          await db.exec(`DELETE FROM followedTags WHERE tagId = $id`, {
            $id: tagId,
          });
          await db.exec(`DELETE FROM tags WHERE id = $id`, { $id: tagId });
        }
      }

      await db.exec(
        `
            DELETE FROM savedPosts 
            WHERE postId IN (
            SELECT id
            FROM posts
            WHERE userId = $id
            )`,
        { $id: userId }
      );

      await db.exec(`DELETE FROM savedPosts WHERE userId = $id`, {
        $id: userId,
      });

      await db.exec(`DELETE FROM posts WHERE userId = $id`, { $id: userId });

      /***** RECENT SEARCHES *****/
      await db.exec(`DELETE FROM recentSearches WHERE searcherId = $id`, {
        $id: userId,
      });

      /***** STORIES *****/
      await db.exec(
        `DELETE FROM storyViews 
                 WHERE storyId IN (
                 SELECT id
                 FROM stories
                 WHERE userId = $id
                 )`,
        { $id: userId }
      );

      await db.exec(`DELETE FROM storyViews WHERE userId = $id`, {
        $id: userId,
      });
      await db.exec(
        `DELETE FROM storyImg WHERE storyId IN (SELECT id FROM stories WHERE userId = $id)`,
        { $id: userId }
      );
      await db.exec(`DELETE FROM stories WHERE userId = $id`, { $id: userId });

      /***** USER *****/
      await db.exec(`DELETE FROM users WHERE id = $id`, { $id: userId });
    });
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user) {
  try {
    return await db.txn(async () => {
      await db.exec(
        `UPDATE users SET 
                 username = $username,
                 fullname = $fullname,
                 email = $email,
                 imgUrl = $imgUrl,
                 gender = $gender,
                 phone = $phone,
                 bio = $bio,
                 website = $website,
                 isDarkMode = $isDarkMode
                 WHERE id = $id`,
        {
          $username: user.username,
          $fullname: user.fullname,
          $email: user.email,
          $imgUrl: user.imgUrl,
          $gender: user.gender,
          $phone: user.phone,
          $bio: user.bio,
          $website: user.website,
          $isDarkMode: user.isDarkMode ? 1 : 0,
          $id: user.id,
        }
      );

      if (user.password) {
        await db.exec(
          `UPDATE users SET 
                     password = $password
                     WHERE id = $id`,
          {
            $password: user.password,
            $id: user.id,
          }
        );
      }

      return user;
    });
  } catch (err) {
    logger.error(`cannot update user ${user.id}`, err);
    throw err;
  }
}

async function add(user) {
  try {
    const id = await db.exec(
      `INSERT INTO users (username, fullname, email, password, imgUrl, gender, phone, bio, website, followersSum, followingSum, postSum, isDarkMode, storySum) 
             VALUES ($username, $fullname, $email, $password, $imgUrl, $gender, $phone, $bio, $website, $followersSum, $followingSum, $postSum, $isDarkMode, $storySum)`,
      {
        $username: user.username,
        $fullname: user.fullname,
        $email: user.email,
        $password: user.password,
        $imgUrl:
          "https://res.cloudinary.com/dng9sfzqt/image/upload/v1669376872/user_instagram_sd7aep.jpg",
        $gender: "",
        $phone: "",
        $bio: "",
        $website: "",
        $followersSum: 0,
        $followingSum: 0,
        $postSum: 0,
        $isDarkMode: 0,
        $storySum: 0,
      }
    );
    return id;
  } catch (err) {
    logger.error("cannot insert user", err);
    throw err;
  }
}

async function chekIfUsernameTaken(username) {
  try {
    const users = await db.query(
      `SELECT * FROM users WHERE username = $username`,
      { $username: username }
    );
    return users.length > 0;
  } catch (err) {
    logger.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function checkPassword(userId, password, newPassword) {
  try {
    const users = await db.query(`SELECT * FROM users WHERE id = $userId`, {
      $userId: userId,
    });
    if (!users.length) {
      throw "user with id " + userId + " was not found";
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw "Wrong Password";
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    return hashedPassword;
  } catch (err) {
    logger.error(`while checking user with ${userId} password`, err);
    throw err;
  }
}

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
  chekIfUsernameTaken,
  checkPassword,
};
