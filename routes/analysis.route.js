const express = require("express");
const router = express.Router();

const { getAnalysis } = require("../controllers/analysis.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", verifyToken, isAdmin, getAnalysis);

module.exports = router;
