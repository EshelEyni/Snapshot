const logger = require("../../services/logger.service");
const db = require("../../database");

async function getChats(loggedinUserId) {
  try {
    return await db.txn(async (txn) => {
      const chatMembers = await db.query(
        `WITH CTE AS (
              SELECT 
                users.username, 
                users.fullname, 
                users.imgUrl, 
                chatMembers.*
              FROM users 
              JOIN chatMembers ON users.id = chatMembers.userId
            )
            SELECT * 
            FROM CTE 
            WHERE chatId IN (
              SELECT chatId 
              FROM chatMembers 
              WHERE userId = $userId
            )`,
        { $userId: loggedinUserId }
      );

      let chats = chatMembers.reduce((acc, chatMember) => {
        const formmatedChatMember = {
          id: chatMember.userId,
          username: chatMember.username,
          fullname: chatMember.fullname,
          imgUrl: chatMember.imgUrl,
        };
        const chat = acc.find((chat) => chat.id === chatMember.chatId);

        if (chat) {
          chat.members.push(formmatedChatMember);
          if (chatMember.isAdmin) chat.admins.push(formmatedChatMember);
          if (chatMember.userId === loggedinUserId) {
            chat.isBlocked = chatMember.isChatBlocked ? 1 : 0;
            chat.isMuted = chatMember.isChatMuted ? 1 : 0;
          }
        } else {
          acc.push({
            id: chatMember.chatId,
            admins: chatMember.isAdmin ? [formmatedChatMember] : [],
            members: [formmatedChatMember],
            isBlocked: null,
            isMuted: null,
          });

          if (chatMember.userId === loggedinUserId) {
            acc[acc.length - 1].isBlocked = chatMember.isChatBlocked ? 1 : 0;
            acc[acc.length - 1].isMuted = chatMember.isChatMuted ? 1 : 0;
          }
        }
        return acc;
      }, []);

      for (const chat of chats) {
        const chatName = await db.query(
          `SELECT name FROM chats WHERE id = $id`,
          { $id: chat.id }
        );
        chat.name = chatName[0].name;
        chat.isGroup = chat.members.length > 2;
        const messages = await db.query(
          `SELECT * FROM chatMessages WHERE chatId = $chatId`,
          { $chatId: chat.id }
        );
        chat.messages = messages;
      }

      chats = chats.sort((a, b) => {
        const aLastMessage = a.messages[a.messages.length - 1];
        const bLastMessage = b.messages[b.messages.length - 1];
        if (!aLastMessage && !bLastMessage) return 0;
        if (!aLastMessage) return 1;
        if (!bLastMessage) return -1;
        return bLastMessage.createdAt - aLastMessage.createdAt;
      });

      return chats;
    });
  } catch (err) {
    logger.error("cannot find chats", err);
    throw err;
  }
}

async function getPersonalChatId(loggedinUserId, otherUserId) {
  try {
    return await db.txn(async (txn) => {
      const chatIds = await db.query(
        `SELECT chatId FROM chatMembers  
            WHERE chatId in (SELECT chatId FROM chatMembers WHERE userId = $loggedinUserId) 
            AND chatId in (SELECT chatId FROM chatMembers WHERE userId = $otherUserId)
            GROUP BY chatId
            HAVING COUNT(DISTINCT userId) = 2`,
        { $loggedinUserId: loggedinUserId, $otherUserId: otherUserId }
      );

      if (!chatIds.length) return null;
      const chatId = chatIds[0].chatId;
      return chatId;
    });
  } catch (err) {
    logger.error("cannot find chat", err);
    throw err;
  }
}

async function addChat(members) {
  try {
    return await db.txn(async (txn) => {
      let savedChatIds = [];

      // Get all chatIds that the members are already in
      for (const member of members) {
        const chatId = await db.query(
          `SELECT chatId FROM chatMembers WHERE userId = $userId`,
          {
            $userId: member.id,
          }
        );
        if (chatId.length) savedChatIds.push(...chatId);
      }

      savedChatIds = new Set(savedChatIds.map((chatId) => chatId.chatId));
      savedChatIds = Array.from(savedChatIds);

      let savedChats = [];

      if (savedChatIds.length) {
        // Get all chatMembers of the saved chats
        for (const savedChatId of savedChatIds) {
          const chatMembers = await db.query(
            `SELECT * FROM chatMembers WHERE chatId = $chatId`,
            { $chatId: savedChatId }
          );
          savedChats.push({
            chatId: savedChatId,
            members: chatMembers,
          });
        }

        // Check if the members are already in the same chat
        for (const savedChat of savedChats) {
          const chatMemberIds = new Set(
            savedChat.members.map((member) => member.userId)
          );
          const isChatAlreadyExist =
            members.every((m) => chatMemberIds.has(m.id)) &&
            members.length === savedChat.members.length;
          if (isChatAlreadyExist) {
            return savedChat.chatId;
          }
        }
      }

      const id = await db.exec(`INSERT INTO "chats" DEFAULT VALUES`);

      for (const member of members) {
        await db.exec(
          `INSERT INTO "chatMembers" (chatId, userId, isAdmin, isChatBlocked, isChatMuted)
                       VALUES ($chatId, $userId, $isAdmin, 0, 0)`,
          {
            $chatId: id,
            $userId: member.id,
            $isAdmin: member.isAdmin ? 1 : 0,
          }
        );
      }
      return id;
    });
  } catch (err) {
    logger.error("cannot add chat", err);
    throw err;
  }
}

async function updateChat(chat, userId) {
  try {
    return await db.txn(async (txn) => {
      const { id, name, admins, members, isBlocked, isMuted } = chat;
      await db.exec(`UPDATE chats SET name = $name WHERE id = $id`, {
        $id: id,
        $name: name,
      });

      /* Update chatMembers */

      // Get all chatMembers of the saved chat
      const savedMembersIds = await db.query(
        `SELECT userId FROM chatMembers WHERE chatId = $chatId`,
        { $chatId: id }
      );
      const updatedChatMembersIdsSet = new Set(members.map((m) => m.id));

      // Delete chatMembers that are not in the updated chat
      const membersIdsToDelete = savedMembersIds
        .map((m) => m.userId)
        .filter((id) => !updatedChatMembersIdsSet.has(id));

      if (membersIdsToDelete.length) {
        for (let i = 0; i < membersIdsToDelete.length; i++) {
          await db.exec(
            "DELETE FROM chatMembers WHERE chatId = $chatId AND userId = $userId",
            {
              $chadId: id,
              $userId: membersIdsToDelete[i],
            }
          );
        }
      }

      // Add chatMembers that are not in the saved chat
      const savedMembersIdsSet = new Set(savedMembersIds.map((m) => m.userId));
      const membersToAdd = members.filter((m) => !savedMembersIdsSet.has(m.id));

      if (membersToAdd.length) {
        for (const member of membersToAdd) {
          await db.exec(
            `INSERT INTO chatMembers (chatId, userId, isAdmin, isChatBlocked, isChatMuted)
                           VALUES ($chatId, $userId, 0, 0, 0)`,
            {
              $chatId: id,
              $userId: member.id,
            }
          );
        }
      }

      for (const member of members) {
        if (member.id === userId) {
          await db.exec(
            `UPDATE chatMembers SET 
                           isChatBlocked = $isChatBlocked,
                           isChatMuted = $isChatMuted,
                           isAdmin = $isAdmin
                           WHERE chatId = $chatId AND userId = $userId`,
            {
              $chatId: id,
              $userId: member.id,
              $isAdmin: admins.some((a) => a.id === member.id) ? 1 : 0,
              $isChatBlocked: isBlocked ? 1 : 0,
              $isChatMuted: isMuted ? 1 : 0,
            }
          );
        } else {
          await db.exec(
            `UPDATE chatMembers SET
                           isAdmin = $isAdmin
                           WHERE chatId = $chatId AND userId = $userId`,
            {
              $chatId: id,
              $userId: member.id,
              $isAdmin: admins.some((a) => a.id === member.id) ? 1 : 0,
            }
          );
        }
      }

      return chat;
    });
  } catch (err) {
    logger.error("cannot update chat", err);
    throw err;
  }
}

async function deleteChat(chatId) {
  try {
    await db.txn(async (txn) => {
      await db.exec(`DELETE FROM chatMembers WHERE chatId = $chatId`, {
        $chatId: chatId,
      });
      await db.exec(`DELETE FROM chatMessages WHERE chatId = $chatId`, {
        $chatId: chatId,
      });
      await db.exec(`DELETE FROM chats WHERE id = $id`, { $id: chatId });
    });
  } catch (err) {
    logger.error("cannot delete chat", err);
    throw err;
  }
}

module.exports = {
  getChats,
  getPersonalChatId,
  deleteChat,
  updateChat,
  addChat,
};
