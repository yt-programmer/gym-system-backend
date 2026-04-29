const express = require("express");
const { paymentCreate } = require("../controllers/pay.controller");
const verifyToken = require("../middlewares/verifyToken");
const isNotSubscription = require("../middlewares/isNotSubscription");
const router = express.Router();

const { body } = require("express-validator");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/",
  [body("planId").isMongoId().withMessage("Invalid plan ID")],
  validateRequest,
  verifyToken,
  isNotSubscription,
  paymentCreate,
);

module.exports = router;
