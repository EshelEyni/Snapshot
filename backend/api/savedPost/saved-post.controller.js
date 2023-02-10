const savedPostService = require("./saved-post.service.js");
const logger = require("../../services/logger.service");

async function savePost(req, res) {
  try {
    const { postId, userId } = req.body;
    const id = await savedPostService.save(postId, userId);
    res.send({ id });
  } catch (err) {
    logger.error("Failed to save post", err);
    res.status(500).send({ err: "Failed to save post" });
  }
}

async function unsavePost(req, res) {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    await savedPostService.unsave(postId, userId);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete save post", err);
    res.status(500).send({ err: "Failed to delete save post" });
  }
}

module.exports = {
  savePost,
  unsavePost,
};
