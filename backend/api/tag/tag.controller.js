const tagService = require("./tag.service");
const logger = require("../../services/logger.service");

async function getTags(req, res) {
  try {
    const tags = await tagService.query({ name: req.query.name });
    res.send(tags);
  } catch (err) {
    logger.error("Failed to get tags", err);
    res.status(500).send({ err: "Failed to get tags" });
  }
}

async function getTag(req, res) {
  try {
    const tag = await tagService.getByName(req.params.name);
    res.send(tag);
  } catch (err) {
    logger.error("Failed to get tag", err);
    res.status(500).send({ err: "Failed to get tag" });
  }
}

async function updateTag(req, res) {
  try {
    const tag = req.body;
    const savedTag = await tagService.update(tag);
    res.send(savedTag);
  } catch (err) {
    logger.error("Failed to update tag", err);
    res.status(500).send({ err: "Failed to update tag" });
  }
}

async function addTag(req, res) {
  try {
    const tag = req.body;
    const id = await tagService.add(tag);
    res.send({ msg: "Tag added", id });
  } catch (err) {
    logger.error("Failed to add tag", err);
    res.status(500).send({ err: "Failed to add tag" });
  }
}

async function getFollowedTags(req, res) {
  try {
    const { userId } = req.params;
    const tags = await tagService.getFollowedTags(userId);
    res.send(tags);
  } catch (err) {
    logger.error("Failed to get followed status", err);
    res.status(500).send({ err: "Failed to get followed status" });
  }
}

async function getFollowedStatus(req, res) {
  try {
    const { userId, tagId } = req.params;
    const tags = await tagService.getFollowedStatus(userId, tagId);
    res.send(tags);
  } catch (err) {
    logger.error("Failed to get followed status", err);
    res.status(500).send({ err: "Failed to get followed status" });
  }
}

async function followTag(req, res) {
  try {
    const { userId, tagId } = req.body;
    const id = await tagService.follow(userId, tagId);
    res.send({ msg: "Tag followed", id });
  } catch (err) {
    logger.error("Failed to follow tag", err);
    res.status(500).send({ err: "Failed to follow tag" });
  }
}

async function unFollowTag(req, res) {
  try {
    const { userId, tagId } = req.params;
    const id = await tagService.unFollow(userId, tagId);
    res.send({ msg: "Tag unfollowed", id });
  } catch (err) {
    logger.error("Failed to unfollow tag", err);
    res.status(500).send({ err: "Failed to unfollow tag" });
  }
}

module.exports = {
  getTags,
  getTag,
  updateTag,
  addTag,
  getFollowedTags,
  getFollowedStatus,
  followTag,
  unFollowTag,
};
