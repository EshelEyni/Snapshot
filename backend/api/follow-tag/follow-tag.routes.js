const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { followTag, unFollowTag } = require("./follow-tag.controller.js");

router.post("/", requireAuth, followTag);
router.delete("/:tagId", requireAuth, unFollowTag);

module.exports = router;
