const tagService = require("./tag.service");
const logger = require("../../services/logger.service");

async function getTags(req, res) {
  try {
    const filterBy = req.query;
    const loggedinUser = req.loggedinUser;
    const tags = await tagService.query(filterBy, loggedinUser);
    res.send(tags);
  } catch (err) {
    logger.error("Failed to get tags", err);
    res.status(500).send({ err: "Failed to get tags" });
  }
}

async function getTag(req, res) {
  try {
    const tagName = req.params.name;
    const loggedinUser = req.loggedinUser;
    const tag = await tagService.getByName(tagName, loggedinUser);
    res.send(tag);
  } catch (err) {
    logger.error("Failed to get tag", err);
    res.status(500).send({ err: "Failed to get tag" });
  }
}

module.exports = {
  getTags,
  getTag,
};
