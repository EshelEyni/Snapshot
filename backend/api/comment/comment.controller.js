const commentService = require("./comment.service");
const logger = require("../../services/logger.service");

async function addComment(req, res) {
  try {
    const comment = req.body;
    const savedComment = await commentService.add(comment);
    res.send(savedComment);
  } catch (err) {
    logger.error("Failed to add comment", err);
    res.status(500).send({ err: "Failed to add comment" });
  }
}

async function deleteComment(req, res) {
  const commentId = req.params.id;
  try {
    await commentService.remove(req.loggedinUser, commentId);
    res.send({ msg: "Comment deleted" });
  } catch (err) {
    logger.error("Failed to delete comment", err);
    res.status(500).send({ err: "Failed to delete comment" });
  }
}

module.exports = {
  deleteComment,
  addComment,
};
