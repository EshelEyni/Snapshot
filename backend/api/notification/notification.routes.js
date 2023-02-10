const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { getNotifications } = require("./notification.controller");

router.get("/", requireAuth, getNotifications);

module.exports = router;
