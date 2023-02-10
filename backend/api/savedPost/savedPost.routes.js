const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { savePost, unsavePost } = require("./saved-post.controller.js");

router.post('/', requireAuth, savePost);
router.delete('/:postId/:userId', requireAuth, unsavePost);

module.exports = router;
