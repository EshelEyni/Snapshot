const logger = require('../../services/logger.service')
const messageService = require('./message.service.js')


async function getMessages(req, res) {
    try {
        const { chatId } = req.params
        const messages = await messageService.getMessages(+chatId)
        res.send(messages)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to get messages' })
    }
}

async function addMessage(req, res) {
    try {
        const message = req.body
        const id = await messageService.addMessage(message)
        res.send({ msg: 'Message added', id })
    } catch (err) {
        logger.error('Failed to add message', err)
        res.status(500).send({ err: 'Failed to add message' })
    }
}

module.exports = {
    getMessages,
    addMessage
}