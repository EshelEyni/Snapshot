const likeService = require("./comment.like.service");

async function addLikeToComment(req, res) {
  try {
    const comment = req.body;
    const loggedinUserId = req.loggedinUser.id;
    const id = await likeService.addLikeToComment(comment, loggedinUserId);
    res.send({ id });
  } catch (err) {
    res.status(500).send({ err: "Failed to add like" });
  }
}

async function deleteLikeToComment(req, res) {
  try {
    const commentId = req.params.id;
    const loggedinUserId = req.loggedinUser.id;
    await likeService.deleteLikeToComment(commentId, loggedinUserId);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to delete like" });
  }
}

module.exports = {
  addLikeToComment,
  deleteLikeToComment,
};
