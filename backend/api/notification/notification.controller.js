const notificationService = require("./notification.service");
const logger = require("../../services/logger.service");

async function getNotifications(req, res) {
  try {
    const userId = req.loggedinUser.id;
    const notifications = await notificationService.query(userId);
    res.send(notifications);
  } catch (err) {
    logger.error("Failed to get notifications", err);
    res.status(500).send({ err: "Failed to get notifications" });
  }
}

module.exports = {
  getNotifications,
};
