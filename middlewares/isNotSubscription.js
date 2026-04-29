const userModel = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const isNotSubscription = async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }

  const isActive =
    user.subscription &&
    user.subscription.status === "active" &&
    user.subscription.endDate > new Date();

  if (isActive) {
    return next(
      appError.create(
        "You already have an active subscription",
        400,
        httpStatus.FAIL,
      ),
    );
  }

  next();
};

module.exports = isNotSubscription;
