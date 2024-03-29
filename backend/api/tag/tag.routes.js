const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { getTags, getTag } = require("./tag.controller");

router.get("/", requireAuth, getTags);
router.get("/:name", requireAuth, getTag);

module.exports = router;
