const express = require("express");
const {
  login,
  register,
  logout,
  me,
  getAllUsers,

  editRole,
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const router = express.Router();
const { body } = require("express-validator");
const validateRequest = require("../middlewares/validateRequest");

router.get("/all", verifyToken, isAdmin, getAllUsers);
router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login,
);
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(["user", "admin"])
      .withMessage("Role must be either 'user' or 'admin'"),
  ],
  validateRequest,
  register,
);
router.patch(
  "/edit-role",
  verifyToken,
  isAdmin,
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["user", "admin"])
      .withMessage("Role must be user or admin"),
  ],
  validateRequest,
  editRole,
);

router.get("/logout", verifyToken, logout);

router.get("/me", verifyToken, me);

module.exports = router;
