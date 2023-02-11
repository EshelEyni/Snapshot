const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { getMessages, addMessage } = require("./message.controller.js");

router.get("/chat/:chatId", requireAuth, getMessages);
router.post("/", requireAuth, addMessage);

module.exports = router;
