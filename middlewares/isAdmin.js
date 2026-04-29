const appError = require("../utils/appError");

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Access denied. Admins only.",
    });
  }
  next();
};

module.exports = isAdmin;
