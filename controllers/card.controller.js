const asyncWrapper = require("../utils/asyncWrapper");
const userModel = require("../models/user.model");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

const makeCard = asyncWrapper(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel.findById(userId);

  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }

  const cardDetails = {
    cardHolderName: user.name,
    expiryDate: user.subscription.endDate,
    status: user.subscription.status,
  };

  const token = jwt.sign({ userId: user._id }, process.env.QR_SECRET, {
    expiresIn: "1d",
  });
  const url = await QRCode.toDataURL(
    `${process.env.ORIGIN}/${process.env.ROUTE_CHECK_CARD}/${token}`,
  );

  res.status(200).json({
    status: "success",
    data: {
      cardDetails,
      url,
    },
  });
});

const checkCard = asyncWrapper(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.QR_SECRET);

  const user = await userModel.findById(decoded.userId);
  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }

  const isActive =
    user.subscription?.endDate &&
    new Date(user.subscription.endDate) > new Date();

  res.status(200).json({
    status: "success",
    data: {
      cardHolderName: user.name,
      status: isActive ? "active" : "inactive",
      expiryDate: user.subscription.endDate,
    },
  });
});

module.exports = {
  makeCard,
  checkCard,
};
