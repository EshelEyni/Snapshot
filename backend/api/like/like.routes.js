const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");

const {
  getLikesForPost,
  addLikeToPost,
  deleteLikeToPost,
} = require("./post.like.controller");

const {
  getLikesForComment,
  addLikeToComment,
  deleteLikeToComment,
} = require("./comment.like.controller");

const {
  getLikesForStory,
  addLikeToStory,
  deleteLikeToStory,
} = require("./story.like.controller.js");

router.get("/post", requireAuth, getLikesForPost);
router.post("/post", requireAuth, addLikeToPost);
router.delete("/post", requireAuth, deleteLikeToPost);

router.get("/comment", requireAuth, getLikesForComment);
router.post("/comment", requireAuth, addLikeToComment);
router.delete("/comment", requireAuth, deleteLikeToComment);

router.get("/story/:id", requireAuth, getLikesForStory);
router.post("/story", requireAuth, addLikeToStory);
router.delete("/story", requireAuth, deleteLikeToStory);

module.exports = router;
