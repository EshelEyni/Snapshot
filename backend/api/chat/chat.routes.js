const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const {
  getChats,
  getPersonalChatId,
  updateChat,
  addChat,
  deleteChat,
} = require("./chat.controller.js");

router.get("/user-chats/", requireAuth, getChats);
router.get("/personal-chat/:userId", requireAuth, getPersonalChatId);
router.put("/:id", requireAuth, updateChat);
router.post("/", requireAuth, addChat);
router.delete("/:id", requireAuth, deleteChat);

module.exports = router;
