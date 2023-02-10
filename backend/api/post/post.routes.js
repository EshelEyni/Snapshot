const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const {
  getPosts,
  getPost,
  updatePost,
  addPost,
  deletePost,
} = require("./post.controller");

router.get("/", requireAuth, getPosts);
router.get("/:id", requireAuth, getPost);
router.put("/:id", requireAuth, updatePost);
router.post("/", requireAuth, addPost);
router.delete("/:id", requireAuth, deletePost);

module.exports = router;
