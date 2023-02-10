const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const {
  addComment,
  deleteComment,
} = require("./comment.controller");

router.post("/", requireAuth, addComment);
router.delete("/:id", requireAuth, deleteComment);

module.exports = router;
