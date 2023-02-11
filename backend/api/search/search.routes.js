const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../middlewares/requireAuth.middleware");
const {
  getSearches,
  addSearch,
  deleteSearch,
  deleteAllUserSearches,
} = require("./search.controller.js");

router.get("/", requireAuth, getSearches);
router.post("/", requireAuth, addSearch);
router.delete("/single/:id", requireAuth, deleteSearch);
router.delete("/clear", requireAuth, deleteAllUserSearches);

module.exports = router;
