
const express = require('express')
const router = express.Router()

const { getMessages, addMessage } = require('./message.controller.js')


router.get('/chat/:chatId', getMessages)
router.post('/', addMessage)

module.exports = router