const userModel = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const isSubscription = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (
    user &&
    user.subscription &&
    user.subscription.status === "active" &&
    user.subscription.endDate > new Date()
  ) {
    return next();
  }

  return next(
    appError.create(
      "You don't have an active subscription",
      403,
      httpStatus.FAIL,
    ),
  );
};

module.exports = isSubscription;
