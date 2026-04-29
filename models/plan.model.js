const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  duration: {
    type: Number,
    required: [true, "Duration is required"],
  },
  datesMen: {
    type: String,
    required: [true, "Dates is required"],
  },
  datesWomen: {
    type: String,
    required: [true, "Dates is required"],
  },
});

module.exports = mongoose.model("Plan", planSchema);
