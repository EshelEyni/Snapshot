const userService = require("./user.service");
const logger = require("../../services/logger.service");

async function queryUsers(req, res) {
  try {
    const filterBy = req.query;
    const loggedinUserId = req.loggedinUser.id;
    const users = await userService.query(filterBy, loggedinUserId);
    res.send(users);
  } catch (err) {
    logger.error("Failed to get users", err);
    res.status(500).send({ err: "Failed to get users" });
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;
  try {
    const user = await userService.getById(userId);
    res.send(user);
  } catch (err) {
    logger.error("Failed to get user", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

async function updateUser(req, res) {
  try {
    const loggedinUser = req.loggedinUser;
    const userToUpdate = req.body;
    if (loggedinUser.id !== userToUpdate.id)
      return res.status(401).send({ err: "Unauthorized" });
    const updatedUser = await userService.update(userToUpdate, loggedinUser);
    res.send(updatedUser);
  } catch (err) {
    logger.error("Failed to update user", err);
    res.status(500).send({ err: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = +req.params.id;
    const { loggedinUser } = req;

    if (loggedinUser.id !== userId) {
      console.log("loggedinUser.id !== userId", loggedinUser.id !== userId);
      return res.status(401).send({ err: "Unauthorized" });
    }
    await userService.remove(userId);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    logger.error("Failed to delete user", err);
    res.status(500).send({ err: "Failed to delete user" });
  }
}

async function checkPassword(req, res) {
  try {
    const { newPassword, password } = req.query;
    const userId = req.loggedinUser.id;
    const hashedPassword = await userService.checkPassword(
      userId,
      password,
      newPassword
    );
    res.send({ hashedPassword });
  } catch (err) {
    res.status(500).send({ err: "Failed to check password" });
  }
}

async function chekIfUsernameTaken(req, res) {
  try {
    const { username } = req.params;
    const chekIfUsernameTaken = await userService.chekIfUsernameTaken(username);
    res.send({ chekIfUsernameTaken });
  } catch (err) {
    res.status(500).send({ err: "Failed to check if user exists" });
  }
}

module.exports = {
  queryUsers,
  getUserById,
  deleteUser,
  updateUser,
  checkPassword,
  chekIfUsernameTaken,
};
