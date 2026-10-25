const express = require("express");
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public validation
router.post("/validate", validateCoupon);

// Admin coupon management
router.get("/", protect, admin, getAllCoupons);
router.post("/", protect, admin, createCoupon);
router.patch("/:id/toggle", protect, admin, toggleCouponStatus);
router.delete("/:id", protect, admin, deleteCoupon);

module.exports = router;

