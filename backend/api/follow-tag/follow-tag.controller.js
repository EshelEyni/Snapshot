const followTagService = require("./follow-tag.service.js");
const logger = require("../../services/logger.service");

async function followTag(req, res) {
  try {
    const { tagId } = req.body;
    const userId = req.loggedinUser.id;
    await followTagService.follow(tagId, userId);
    res.send({ msg: "Tag followed" });
  } catch (err) {
    logger.error("Failed to follow tag", err);
    res.status(500).send({ err: "Failed to follow tag" });
  }
}

async function unFollowTag(req, res) {
  try {
    const { tagId } = req.params;
    const userId = req.loggedinUser.id;
    await followTagService.unFollow(tagId, userId);
    res.send({ msg: "Tag unfollowed" });
  } catch (err) {
    logger.error("Failed to unfollow tag", err);
    res.status(500).send({ err: "Failed to unfollow tag" });
  }
}

module.exports = {
  //   getFollowedTags,
  followTag,
  unFollowTag,
};
