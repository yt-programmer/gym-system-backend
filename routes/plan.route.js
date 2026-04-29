const router = require("express").Router();
const { body, validationResult, param } = require("express-validator");
const {
  getAllPlans,
  createPlan,
  updatePlan,
  getPlan,
  deletePlan,
} = require("../controllers/plan.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const validateRequest = require("../middlewares/validateRequest");

router
  .route("/")
  .get(getAllPlans)
  .post(
    verifyToken,
    isAdmin,
    [
      body("title").notEmpty().withMessage("Title is required"),
      body("description").notEmpty().withMessage("Description is required"),
      body("price").isNumeric().withMessage("Price must be a number"),
      body("duration").isNumeric().withMessage("Duration must be a number"),
      body("datesMen").notEmpty().withMessage("Dates is required"),
      body("datesWomen").notEmpty().withMessage("Dates is required"),
    ],
    validateRequest,
    createPlan,
  );
router
  .route("/:planId")
  .get(
    [param("planId").isMongoId().withMessage("Invalid plan ID")],
    validateRequest,
    getPlan,
  )
  .patch(
    verifyToken,
    isAdmin,
    [
      param("planId").isMongoId().withMessage("Invalid plan ID"),
      body("title").optional().notEmpty().withMessage("Title is required"),
      body("description")
        .optional()
        .notEmpty()
        .withMessage("Description is required"),
      body("price")
        .optional()
        .isNumeric()
        .withMessage("Price must be a number"),
      body("duration")
        .optional()
        .isNumeric()
        .withMessage("Duration must be a number"),
      body("datesMen").optional().notEmpty().withMessage("Dates is required"),
      body("datesWomen").optional().notEmpty().withMessage("Dates is required"),
    ],
    validateRequest,
    updatePlan,
  )
  .delete(
    verifyToken,
    isAdmin,
    [param("planId").isMongoId().withMessage("Invalid plan ID")],
    validateRequest,
    deletePlan,
  );

module.exports = router;
