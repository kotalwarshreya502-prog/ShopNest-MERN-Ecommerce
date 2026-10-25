const express = require("express");
const router = express.Router();
const {
  getDashboardAnalytics,
  getAllCustomers,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.use(protect, admin);

router.get("/dashboard", getDashboardAnalytics);
router.get("/customers", getAllCustomers);

module.exports = router;

