const asyncWrapper = require("../middlewares/asyncWrapper");
const Plan = require("../models/plan.model");

const getAllPlans = asyncWrapper(async (req, res) => {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const plans = await Plan.find({ __v: 0 }).skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    data: {
      plans,
    },
  });
});

const createPlan = asyncWrapper(async (req, res, next) => {
  const { title, description, price, duration, datesMen, datesWomen } =
    req.body;
  const plan = await Plan.create({
    title,
    description,
    price,
    duration,
    datesMen,
    datesWomen,
  });

  const plans = await Plan.find({ __v: 0 });

  res.status(201).json({
    status: "success",
    data: {
      plans,
    },
  });
});

const updatePlan = asyncWrapper(async (req, res, next) => {
  const { planId } = req.params;
  const { title, description, price, duration, datesMen, datesWomen } =
    req.body;

  const plan = await Plan.findByIdAndUpdate(planId, {
    title,
    description,
    price,
    duration,
    datesMen,
    datesWomen,
  });

  const plans = await Plan.find({ __v: 0 });

  res.status(200).json({
    status: "success",
    data: {
      plans,
    },
  });
});

const deletePlan = asyncWrapper(async (req, res, next) => {
  const { planId } = req.params;
  await Plan.findByIdAndDelete(planId);

  const plans = await Plan.find({ __v: 0 });
  res.status(200).json({
    status: "success",
    data: {
      plans,
    },
  });
});

const getPlan = asyncWrapper(async (req, res, next) => {
  const { planId } = req.params;
  const plan = await Plan.findById(planId, { __v: 0 });
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

module.exports = {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getPlan,
};
