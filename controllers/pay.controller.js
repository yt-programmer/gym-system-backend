const asyncWrapper = require("../middlewares/asyncWrapper");
const planModel = require("../models/plan.model");
const userModel = require("../models/user.model");
const {
  getAuthToken,
  createOrder,
  getPaymentKey,
} = require("../services/paymob");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const Pay = require("../models/pay.model");

const paymentCreate = asyncWrapper(async (req, res, next) => {
  const { planId } = req.body;

  const plan = await planModel.findById(planId);
  const user = await userModel.findById(req.user.id);
  if (!plan) {
    return next(appError.create("Plan not found", 404, httpStatus.FAIL));
  }
  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }
  const existingPayment = await Pay.findOne({
    user: user._id,
    status: "pending",
  });

  if (existingPayment) {
    return next(
      appError.create(
        "You already have a pending payment",
        400,
        httpStatus.FAIL,
      ),
    );
  }
  const amount = plan.price;

  const payment = new Pay({
    user: user._id,
    plan: planId,
    amount,
    status: "pending",
  });

  const token = await getAuthToken();
  const orderId = await createOrder(token, amount);
  const paymentKey = await getPaymentKey(token, orderId, amount, user);

  payment.paymentId = orderId;
  await payment.save();

  const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

  res.status(200).json({
    status: "success",
    data: {
      paymentUrl,
    },
  });
});

module.exports = { paymentCreate };
