const User = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncWrapper = require("../middlewares/asyncWrapper");
const { param } = require("../routes/user.route");

const register = asyncWrapper(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(appError.create("Email already exists", 400, httpStatus.FAIL));
  }
  ``;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,

    password: hashedPassword,
    role,
  });

  await user.save();
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod" ? true : false,
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  user.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

const editRole = asyncWrapper(async (req, res, next) => {
  const { role, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }
  user.role = role;
  await user.save();

  const users = await User.find({}, { password: 0, __v: 0 });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return next(
      appError.create("You don't have an account", 401, httpStatus.FAIL),
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(appError.create("Invalid credentials", 401, httpStatus.FAIL));
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod" ? true : false,
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const logout = asyncWrapper(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod" ? true : false,
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
  });
  res.status(200).json({
    status: "success",
  });
});

const me = asyncWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(appError.create("User not found", 404, httpStatus.FAIL));
  }
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await User.find({}, { password: 0, __v: 0 });
  res.status(200).json({
    status: "success",
    data: { users },
  });
});

module.exports = {
  register,
  login,
  logout,
  me,
  getAllUsers,
  editRole,
};
