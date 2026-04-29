const asyncWrapper = require("../utils/asyncWrapper");
const userModel = require("../models/user.model");
const planModel = require("../models/plan.model");
const Pay = require("../models/pay.model");

const getAnalysis = asyncWrapper(async (req, res) => {
  const allUsers = await userModel.find();
  const allPlans = await planModel.find();
  const planMap = new Map(
    allPlans.map((plan) => [plan._id.toString(), plan.price]),
  );

  const revenue = await Pay.aggregate([
    { $match: { status: "success" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const analysisData = {
    totalMembers: allUsers.length,
    activeMembers: allUsers.filter((user) => {
      const endDate = user.subscription?.endDate;
      return endDate && new Date(endDate) > new Date();
    }).length,
    Plans: allPlans,

    revenue: revenue[0]?.total,
  };
  res.status(200).json({
    success: true,
    data: { analysisData },
  });
});

module.exports = {
  getAnalysis,
};
