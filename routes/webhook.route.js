const express = require("express");
const { webhook } = require("../controllers/webhook.controller");
const router = express.Router();

router.post("/", webhook);

module.exports = router;
