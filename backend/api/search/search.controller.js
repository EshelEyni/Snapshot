const searchService = require("./search.service.js");
const logger = require("../../services/logger.service");

async function getSearches(req, res) {
  try {
    const loggedinUserId = req.loggedinUser.id;
    const searches = await searchService.query(loggedinUserId);
    res.send(searches);
  } catch (err) {
    logger.error("Failed to get searches", err);
    res.status(500).send({ err: "Failed to get searches" });
  }
}

async function addSearch(req, res) {
  try {
    const search = req.body;
    const loggedinUserId = req.loggedinUser.id;
    await searchService.add(search, loggedinUserId);
    res.end();
  } catch (err) {
    logger.error("Failed to add search", err);
    res.status(500).send({ err: "Failed to add search" });
  }
}

async function deleteSearch(req, res) {
  try {
    const searchItemId = req.params.id;
    const loggedinUserId = req.loggedinUser.id;
    await searchService.remove(searchItemId, loggedinUserId);
    res.end();
  } catch (err) {
    logger.error("Failed to delete search", err);
    res.status(500).send({ err: "Failed to delete search" });
  }
}

async function deleteAllUserSearches(req, res) {
  try {
    const loggedinUserId = req.loggedinUser.id;
    await searchService.removeAll(loggedinUserId);
    res.end();
  } catch (err) {
    logger.error("Failed to delete all user searches", err);
    res.status(500).send({ err: "Failed to delete all user searches" });
  }
}

module.exports = {
  getSearches,
  addSearch,
  deleteSearch,
  deleteAllUserSearches,
};
