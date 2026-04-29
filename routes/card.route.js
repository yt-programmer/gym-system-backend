const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const isSubscription = require("../middlewares/isSubscription");
const userModel = require("../models/user.model");
const { Query } = require("mongoose");
const router = express.Router();
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const { makeCard, checkCard } = require("../controllers/card.controller");

router.get("/", verifyToken, isSubscription, makeCard);

router.get("/check/:token", checkCard);
module.exports = router;
