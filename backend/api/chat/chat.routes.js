
const express = require('express')
const router = express.Router()

const { getChats, getPersonalChat, updateChat, addChat, deleteChat } = require('./chat.controller.js')


router.get('/user-chats/:userId', getChats)
router.get('/personal-chat/:loggedinUserId/:otherUserId', getPersonalChat)
router.put('/:id', updateChat)
router.post('/', addChat)
router.delete('/:id', deleteChat)

module.exports = router