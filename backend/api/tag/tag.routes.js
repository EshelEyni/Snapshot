const express = require("express");
const router = express.Router();

const {
  getTags,
  getTag,
  updateTag,
  addTag,
  followTag,
  unFollowTag,
  getFollowedTags,
  getFollowedStatus,
} = require("./tag.controller");

router.get("/", getTags);
router.get("/:name", getTag);
router.put("/:id", updateTag);
router.post("/", addTag);

router.get("/follow/:userId", getFollowedTags);
router.get("/follow/:userId/:tagId", getFollowedStatus);
router.post("/follow", followTag);
router.delete("/follow/:userId/:tagId", unFollowTag);

module.exports = router;
