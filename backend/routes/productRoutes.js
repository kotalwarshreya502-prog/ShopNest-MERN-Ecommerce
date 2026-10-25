const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  createProductReview,
  getProductReviews,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public discovery endpoints
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/:id", getProductById);

// Reviews
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createProductReview);

// Admin product management
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
