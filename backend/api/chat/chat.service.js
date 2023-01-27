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
                        if (chatMember.isAdmin) chat.admins.push(formmatedChatMember);
                        if (chatMember.userId === userId) {
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

                        if (chatMember.userId === userId) {
                            acc[acc.length - 1].isBlocked = chatMember.isChatBlocked ? 1 : 0;
                            acc[acc.length - 1].isMuted = chatMember.isChatMuted ? 1 : 0;
                        }
                    }
                    return acc;
                }, []);

            for (const chat of chats) {
                const chatName = await db.query(`select name from chats where id = $id`, { $id: chat.id });
                chat.name = chatName[0].name;
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

async function getByUsersId(loggedinUserId, otherUserId) {
    try {

        return await db.txn(async (txn) => {
            let chatIds = await db.query(
                `SELECT chatId from chatMembers  
            WHERE chatId in (SELECT chatId FROM chatMembers WHERE userId = $loggedinUserId) 
            AND chatId in (SELECT chatId FROM chatMembers WHERE userId = $otherUserId)
            GROUP BY chatId
            HAVING COUNT(DISTINCT userId) = 2`,
                { $loggedinUserId: loggedinUserId, $otherUserId: otherUserId }
            );

            if (!chatIds.length) return null;
            const currChatId = chatIds[0].chatId;
            const chats = await db.query(
                `SELECT * from chats WHERE id = $currChatId`,
                { $currChatId: currChatId }
            );

            const chat = chats[0];

            const chatMembers = await db.query(
                `SELECT * from chatMembers WHERE chatId = $currChatId`,
                { $currChatId: currChatId }
            );

            chat.members = [];
            chat.admins = [];

            chatMembers.forEach(member => {

                const formmatedChatMember = {
                    id: member.userId,
                    username: member.username,
                    fullname: member.fullname,
                    imgUrl: member.imgUrl,
                };

                chat.members.push(formmatedChatMember);
                if (member.isAdmin) chat.admins.push(formmatedChatMember);
                if (member.userId === loggedinUserId) {
                    chat.isBlocked = member.isChatBlocked ? 1 : 0;
                    chat.isMuted = member.isChatMuted ? 1 : 0;
                }
            });

            chat.isGroup = false;

            const messages = await db.query(
                `SELECT * from chatMessages WHERE chatId = $currChatId`,
                { $currChatId: currChatId }
            );

            chat.messages = messages;

            return chat;
        });
    } catch (err) {
        logger.error('cannot find chat', err)
        throw err
    }
}

async function deleteChat(chatId) {
    try {
        await db.txn(async (txn) => {
            await db.exec(`delete from chatMembers where chatId = $chatId`, { $chatId: chatId });
            await db.exec(`delete from chatMessages where chatId = $chatId`, { $chatId: chatId });
            await db.exec(`delete from chats where id = $id`, { $id: chatId });
        });
    } catch (err) {
        logger.error('cannot delete chat', err)
        throw err
    }
}

async function updateChat(chat, userId) {
    try {
        return await db.txn(async (txn) => {
            const { id, name, admins, members, messages, isBlocked, isMuted } = chat;
            await db.exec(`update chats set name = $name where id = $id`, { $id: id, $name: name });
            const savedMembersIds = await db.query(`select userId from chatMembers where chatId = $chatId`, { $chatId: id });
            const membersIdsSet = new Set(members.map(m => m.id));
            const membersIdsToDelete = savedMembersIds.map(m => m.userId).filter(id => !membersIdsSet.has(id));
            if (membersIdsToDelete.length) {
                console.log('membersIdsToDelete', membersIdsToDelete);
                await db.exec(`delete from chatMembers where chatId = $chatId and userId in (${membersIdsToDelete.join(',')})`,
                    { $chatId: id }
                );
            }

            const savedMembersIdsSet = new Set(savedMembersIds.map(m => m.userId));
            const membersToAdd = members.filter(m => !savedMembersIdsSet.has(m.id));

            if (membersToAdd.length) {
                for (const member of membersToAdd) {
                    await db.exec(
                        `insert into chatMembers (chatId, userId, username, fullname, imgUrl, isAdmin, isChatBlocked, isChatMuted)
                         values ($chatId, $userId, $username, $fullname, $imgUrl, 0, 0, 0)`,
                        {
                            $chatId: id,
                            $userId: member.id,
                            $username: member.username,
                            $fullname: member.fullname,
                            $imgUrl: member.imgUrl,
                        }
                    );
                }
            }

            for (const member of members) {
                if (member.id === userId) {
                    await db.exec(
                        `update chatMembers set 
                         isChatBlocked = $isChatBlocked,
                         isChatMuted = $isChatMuted,
                         isAdmin = $isAdmin
                         where chatId = $chatId and userId = $userId`,
                        {
                            $chatId: id,
                            $userId: member.id,
                            $isAdmin: admins.some(a => a.id === member.id) ? 1 : 0,
                            $isChatBlocked: isBlocked ? 1 : 0,
                            $isChatMuted: isMuted ? 1 : 0,
                        }
                    );
                }
                else {
                    await db.exec(
                        `update chatMembers set
                         isAdmin = $isAdmin
                         where chatId = $chatId and userId = $userId`,
                        {
                            $chatId: id,
                            $userId: member.id,
                            $isAdmin: admins.some(a => a.id === member.id) ? 1 : 0,
                        }
                    );
                }
            }

            // for (const message of messages) {
            //     await db.exec(
            //         `update chatMessages set username = $username, fullname = $fullname, imgUrl = $imgUrl, text = $text, createdAt = $createdAt where chatId = $chatId and id = $id`,
            //         {
            //             $chatId: id,
            //             $id: message.id,
            //             $username: message.username,
            //             $fullname: message.fullname,
            //             $imgUrl: message.imgUrl,
            //             $text: message.text,
            //             $createdAt: message.createdAt,
            //         }
            //     );
            // }
            return chat;
        });
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
                    isChatAlreadyExist = members.every(m => chatMemberIds.has(m.id)) && members.length === savedChat.members.length;
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


module.exports = {
    getChats,
    getByUsersId,
    deleteChat,
    updateChat,
    addChat,
}