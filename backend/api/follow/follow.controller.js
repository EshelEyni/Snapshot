const followService = require("./follow.service.js");
const logger = require("../../services/logger.service");

async function getFollowings(req, res) {
  const userId = req.params.id;
  const loggedinUserId = req.loggedinUser.id;
  try {
    const followings = await followService.getFollowings(
      userId,
      loggedinUserId
    );
    res.send(followings);
  } catch (err) {
    logger.error("Failed to get following", err);
    throw err;
  }
}

async function getFollowers(req, res) {
  const userId = req.params.id;
  const loggedinUserId = req.loggedinUser.id;
  try {
    const followers = await followService.getFollowers(userId, loggedinUserId);
    res.send(followers);
  } catch (err) {
    logger.error("Failed to get followers", err);
    throw err;
  }
}

async function addFollow(req, res) {
  const loggedinUserId = req.loggedinUser.id;
  const followingId = req.params.id;
  try {
    const following = await followService.add(loggedinUserId, followingId);
    res.send(following);
  } catch (err) {
    logger.error("Failed to add follow", err);
    throw err;
  }
}

async function deleteFollow(req, res) {
  const loggedinUserId = req.loggedinUser.id;
  const followingId = req.params.id;
  try {
    const following = await followService.remove(loggedinUserId, followingId);
    if (!following) return res.status(404).send({ msg: "Follow not found" });
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete follow", err);
    throw err;
  }
}

module.exports = {
  getFollowings,
  getFollowers,
  addFollow,
  deleteFollow,
};
