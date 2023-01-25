const logger = require('../../services/logger.service')
const db = require('../../database');
const noitificationService = require('../notification/notification.service')


async function getMessages(chatId) {
    try {
        return await db.txn(async (txn) => {
            const messages = await db.query(`SELECT * FROM chatMessages WHERE chatId = $chatId order by createdAt asc`,
                { $chatId: chatId });

            for (const message of messages) {
                const users = await db.query(`SELECT * FROM users WHERE id = $id`, { $id: message.userId });
                const user = users[0];
                message.sender = {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    imgUrl: user.imgUrl
                }
            }

            return messages;
        });
    } catch (err) {
        logger.error('Failed to get messages', err)
        throw err;
    }
}

async function addMessage(message) {
    try {
        const { chatId, sender, type, createdAt, text, imgUrl, postId } = message;
        const id = await db.exec(
            `INSERT INTO chatMessages (chatId, userId, type, createdAt, text, imgUrl, postId) 
            VALUES ($chatId, $userId, $type, $createdAt, $text, $imgUrl, $postId )`, {
            $chatId: chatId,
            $userId: sender.id,
            $type: type,
            $createdAt: createdAt,
            $text: text || null,
            $imgUrl: imgUrl || null,
            $postId: postId || null
        });

        return id;

    } catch (err) {
        logger.error('Failed to add message', err)
        throw err;
    }
}

module.exports = {
    getMessages,
    addMessage
}