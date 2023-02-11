const likeService = require("./post.like.service");

async function getLikesForPost(req, res) {
  try {
    const postId = req.params.id;
    const loggedinUserId = req.loggedinUser.id;
    const likes = await likeService.getLikesForPost(postId, loggedinUserId);
    res.send(likes);
  } catch (err) {
    res.status(500).send({ err: "Failed to get likes" });
  }
}

async function addLikeToPost(req, res) {
  try {
    const post = req.body;
    const loggedinUserId = req.loggedinUser.id;
    await likeService.addLikeToPost(post, loggedinUserId);
    res.send({ msg: "Added successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to add like" });
  }
}

async function deleteLikeToPost(req, res) {
  try {
    const postId = req.params.id;
    const loggedinUserId = req.loggedinUser.id;
    await likeService.deleteLikeToPost(postId, loggedinUserId);
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
