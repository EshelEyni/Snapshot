const locationService = require("./location.service");
const logger = require("../../services/logger.service");

async function getLocations(req, res) {
  try {
    const searchTerm = req.query.searchTerm;
    const locations = await locationService.query(searchTerm);
    res.send(locations);
  } catch (err) {
    logger.error("Failed to get locations", err);
    res.status(500).send({ err: "Failed to get locations" });
  }
}


module.exports = {
  getLocations
};