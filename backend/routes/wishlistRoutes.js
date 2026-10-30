const express = require("express");
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  moveToCart,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getWishlist);
router.post("/toggle/:productId", protect, toggleWishlist);
router.post("/:productId", protect, toggleWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.post("/move-to-cart/:productId", protect, moveToCart);

module.exports = router;

