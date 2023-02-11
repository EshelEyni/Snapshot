const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middlewares/requireAuth.middleware");

const {
  getFollowings,
  getFollowers,
  addFollow,
  deleteFollow,
} = require("./follow.controller.js");

router.get("/followings/:id", requireAuth, getFollowings);
router.get("/followers/:id", requireAuth, getFollowers);
router.post("/:id", requireAuth, addFollow);
router.delete("/:id", requireAuth, deleteFollow);

module.exports = router;
