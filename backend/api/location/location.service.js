const logger = require("../../services/logger.service");
const db = require("../../database");

async function query(searchTerm) {
  try {
    const locations = await db.query(
      `select * from locations where name like $searchTerm`,
      { $searchTerm: "%" + searchTerm + "%" }
    );
    return locations;
  } catch (err) {
    logger.error("cannot find locations", err);
    throw err;
  }
}

module.exports = {
  query,
};
