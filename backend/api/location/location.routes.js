const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const { getLocations } = require("./location.controller");

router.get("/", requireAuth, getLocations);

module.exports = router;
