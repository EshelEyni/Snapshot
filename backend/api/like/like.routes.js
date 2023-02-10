const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");

const {
  getLikesForPost,
  addLikeToPost,
  deleteLikeToPost,
} = require("./post.like.controller");

const {
  addLikeToComment,
  deleteLikeToComment,
} = require("./comment.like.controller");


router.get("/post/:id", requireAuth, getLikesForPost);
router.post("/post", requireAuth, addLikeToPost);
router.delete("/post/:id", requireAuth, deleteLikeToPost);

router.post("/comment", requireAuth, addLikeToComment);
router.delete("/comment/:id", requireAuth, deleteLikeToComment);


module.exports = router;
