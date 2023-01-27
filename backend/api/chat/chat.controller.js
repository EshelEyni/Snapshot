const chatService = require('./chat.service')
const logger = require('../../services/logger.service')

async function getChats(req, res) {
    try {
        const { userId } = req.params
        const chats = await chatService.getChats(+userId)
        console.log('chats', chats)
        res.send(chats)
    } catch (err) {
        logger.error('Failed to get chats', err)
        res.status(500).send({ err: 'Failed to get chats' })
    }
}

async function getPersonalChat(req, res) {
    try {
        const { loggedinUserId, otherUserId } = req.params
        const chat = await chatService.getByUsersId(loggedinUserId, otherUserId)
        res.send(chat)
    } catch (err) {
        logger.error('Failed to get chat', err)
        res.status(500).send({ err: 'Failed to get chat' })
    }
}

async function deleteChat(req, res) {
    try {
        const chatId = req.params.id
        await chatService.deleteChat(chatId)
        res.send({ msg: 'Chat deleted' })
    } catch (err) {
        logger.error('Failed to delete chat', err)
        res.status(500).send({ err: 'Failed to delete chat' })
    }
}


async function updateChat(req, res) {
    try {
        const { chat, userId } = req.body
        const id = await chatService.updateChat(chat, userId)
        res.send({ msg: 'Chat updated', id })
    } catch (err) {
        logger.error('Failed to update chat', err)
        res.status(500).send({ err: 'Failed to update chat' })
    }
}

async function addChat(req, res) {
    try {
        const members = req.body
        const id = await chatService.addChat(members)
        res.send({ msg: 'Chat added', id })
    } catch (err) {
        logger.error('Failed to add chat', err)
        res.status(500).send({ err: 'Failed to add chat' })
    }
}

module.exports = {
    getChats,
    getPersonalChat,
    deleteChat,
    updateChat,
    addChat
}

