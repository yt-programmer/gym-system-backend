const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    validate: validator.isEmail,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  subscription: {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "failed"],
      default: "inactive",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
