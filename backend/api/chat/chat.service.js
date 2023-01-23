const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service')

async function getChats(userId) {
    try {
        return await db.txn(async (txn) => {
            const chatMembers = await db.query(
                `select * from chatMembers where chatId in (select chatId from chatMembers where userId = $userId)`,
                { $userId: userId }
            );
            const chats = chatMembers
                .sort((a, b) => a.username.localeCompare(b.username))
                .reduce((acc, chatMember) => {

                    const formmatedChatMember = {
                        id: chatMember.userId,
                        username: chatMember.username,
                        fullname: chatMember.fullname,
                        imgUrl: chatMember.imgUrl,
                    };

                    const chat = acc.find(chat => chat.id === chatMember.chatId);

                    if (chat) {
                        chat.members.push(formmatedChatMember);
                    } else {
                        acc.push({
                            id: chatMember.chatId,
                            admin: chatMember.isAdmin ? formmatedChatMember : null,
                            members: [formmatedChatMember],
                            messages: [],
                            isBlocked: chatMember.isChatBlocked,
                            isMuted: chatMember.isChatMuted,
                        });
                    }
                    return acc;
                }, []);

            for (const chat of chats) {
                const lastAction = await db.query(`select lastAction, lastActionTime from chats where id = $id`, { $id: chat.id });
                chat.lastAction = { desc: lastAction[0].lastAction, createdAt: lastAction[0].lastActionTime };
                chat.isGroup = chat.members.length > 2;
                const messages = await db.query(`select * from chatMessages where chatId = $chatId`, { $chatId: chat.id });
                chat.messages = messages;
            }

            return chats;
        });
    } catch (err) {
        logger.error('cannot find chats', err)
        throw err
    }
}

async function getById(chatId) {
    try {
        const chats = await db.query(`select * from chats where id = $id`, { $id: chatId });
        return chats[0];
    } catch (err) {
        logger.error('cannot find chat', err)
        throw err
    }
}

async function deleteChat(chatId) {
    try {
        await db.query(`delete from chats where id = $id`, { $id: chatId });
    } catch (err) {
        logger.error('cannot delete chat', err)
        throw err
    }
}

async function updateChat(chat) {
    try {
        const { id, userId, name, imgUrl } = chat
        await db.query(`update chats set userId = $userId, name = $name, imgUrl = $imgUrl where id = $id`, { $id: id, $userId: userId, $name: name, $imgUrl: imgUrl });
        return chat;
    } catch (err) {
        logger.error('cannot update chat', err)
        throw err
    }
}


async function addChat(members) {
    try {
        return await db.txn(async (txn) => {
            let isChatAlreadyExist;
            let savedChatIds = await db.query(
                `SELECT chatId FROM chatMembers WHERE userId IN (${members.map(member => member.id).join(',')})`
            );

            savedChatIds = new Set(savedChatIds.map(chatId => chatId.chatId));
            savedChatIds = Array.from(savedChatIds);

            let savedChats = [];

            if (savedChatIds.length) {

                for (const savedChatId of savedChatIds) {
                    const chatMembers = await db.query(`select * from chatMembers where chatId = $chatId`, { $chatId: savedChatId });
                    savedChats.push({
                        chatId: savedChatId,
                        members: chatMembers,
                    });
                }
                for (const savedChat of savedChats) {
                    const chatMemberIds = new Set(savedChat.members.map(member => member.userId));
                    isChatAlreadyExist = members.every(m => chatMemberIds.has(m.id));
                    if (isChatAlreadyExist) {
                        return savedChat.chatId;
                    }
                }
            }

            const id = await db.exec(`INSERT INTO "chats" DEFAULT VALUES`);

            for (const member of members) {
                await db.exec(
                    `INSERT INTO "chatMembers" (chatId, userId, username, fullname, imgUrl, isAdmin, isChatBlocked, isChatMuted)
                     VALUES ($chatId, $userId, $username, $fullname, $imgUrl, $isAdmin, 0, 0)`,
                    {
                        $chatId: id,
                        $userId: member.id,
                        $username: member.username,
                        $fullname: member.fullname,
                        $imgUrl: member.imgUrl,
                        $isAdmin: member.isAdmin ? 1 : 0,
                    });
            }
            return id;
        })
    } catch (err) {
        logger.error('cannot add chat', err)
        throw err
    }
}

async function addMessage(message) {
    try {
        const { chatId, userId, txt, createdAt } = message
        const { lastID } = await db.query(`insert into messages (chatId, userId, txt, createdAt) values ($chatId, $userId, $txt, $createdAt)`, { $chatId: chatId, $userId: userId, $txt: txt, $createdAt: createdAt });
        return lastID;
    } catch (err) {
        logger.error('cannot add message', err)
        throw err
    }
}

async function getMessages(chatId) {
    try {
        const messages = await db.query(`select * from messages where chatId = $chatId`, { $chatId: chatId });
        return messages;
    } catch (err) {
        logger.error('cannot find messages', err)
        throw err
    }
}

async function getUnreadMessages(chatId, userId) {
    try {
        const messages = await db.query(`select * from messages where chatId = $chatId and userId != $userId and isRead = 0`, { $chatId: chatId, $userId: userId });
        return messages;
    } catch (err) {
        logger.error('cannot find messages', err)
        throw err
    }
}

async function updateMessage(message) {
    try {
        const { id, chatId, userId, txt, createdAt, isRead } = message
        await db.query(`update messages set chatId = $chatId, userId = $userId, txt = $txt, createdAt = $createdAt, isRead = $isRead where id = $id`, { $id: id, $chatId: chatId, $userId: userId, $txt: txt, $createdAt: createdAt, $isRead: isRead });
        return message;
    } catch (err) {
        logger.error('cannot update message', err)
        throw err
    }
}

async function deleteMessage(messageId) {
    try {
        await db.query(`delete from messages where id = $id`, { $id: messageId });
    } catch (err) {
        logger.error('cannot delete message', err)
        throw err
    }
}

module.exports = {
    getChats,
    getById,
    deleteChat,
    updateChat,
    addChat,
    addMessage,
    getMessages,
    getUnreadMessages,
    updateMessage,
    deleteMessage
}