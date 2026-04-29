const asyncWrapper = require("../middlewares/asyncWrapper");
const Pay = require("../models/pay.model");
const User = require("../models/user.model");
const Plan = require("../models/plan.model");

const webhook = asyncWrapper(async (req, res, next) => {
  const obj = req.body.obj;
  const orderId = obj.order.id;
  const success = obj.success;
  const amount = obj.amount_cents;
  const pay = await Pay.findOne({ paymentId: orderId });
  const plan = await Plan.findById(pay.plan);
  if (success) {
    pay.status = "success";
    await pay.save();
    const user = await User.findByIdAndUpdate(pay.user, {
      subscription: {
        plan: pay.plan,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
      },
    });
  } else {
    pay.status = "failed";
    await pay.save();
    const user = await User.findByIdAndUpdate(pay.user, {
      subscription: {
        plan: null,
        status: "failed",
        startDate: null,
        endDate: null,
      },
    });
  }
});

module.exports = { webhook };
