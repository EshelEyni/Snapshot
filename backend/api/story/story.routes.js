const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const {
  getStories,
  getStory,
  updateStory,
  addStory,
  deleteStory,
  addStoryView,
} = require("./story.controller");

router.get("/", requireAuth, getStories);
router.get("/:id", requireAuth, getStory);
router.put("/:id", requireAuth, updateStory);
router.post("/", requireAuth, addStory);
router.delete("/:id", requireAuth, deleteStory);

router.put("/views/:id", requireAuth, addStoryView);

module.exports = router;
