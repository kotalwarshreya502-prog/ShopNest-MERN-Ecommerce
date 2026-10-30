const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All cart operations require authentication and protect each user's data
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.post("/", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);
router.delete("/", protect, clearCart);
router.post("/sync", protect, syncCart);

module.exports = router;
