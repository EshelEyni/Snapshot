const express = require("express");
const router = express.Router();

const {
  getStories,
  getStory,
  updateStory,
  addStory,
  deleteStory,
  addStoryView,
} = require("./story.controller");

router.get("/", getStories);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.post("/", addStory);
router.delete("/:id", deleteStory);

router.put("/views/:id", addStoryView);

module.exports = router;
