const logger = require("../../services/logger.service");
const likeService = require("./post.like.service");

async function getLikesForPost(req, res) {
  try {
    const loggedinUser = req.loggedinUser;
    const likes = await likeService.getLikesForPost({
      postId: req.query.postId,
      userId: loggedinUser.id,
    });
    res.send(likes);
  } catch (err) {
    res.status(500).send({ err: "Failed to get likes" });
  }
}

async function addLikeToPost(req, res) {
  try {
    const { post } = req.body;
    const loggedinUser = req.loggedinUser;
    const id = await likeService.addLikeToPost(post, loggedinUser);
    res.send({ id });
  } catch (err) {
    res.status(500).send({ err: "Failed to add like" });
  }
}

async function deleteLikeToPost(req, res) {
  try {
    const { postId, userId } = req.body;
    await likeService.deleteLikeToPost({ postId, userId });
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to delete like" });
  }
}

module.exports = {
  getLikesForPost,
  addLikeToPost,
  deleteLikeToPost,
};
