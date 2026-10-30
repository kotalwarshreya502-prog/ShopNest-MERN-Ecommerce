const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/product");

// @desc    Get logged in user's wishlist from MongoDB Atlas
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [],
      });
    }

    res.json({
      success: true,
      count: wishlist.products.length,
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve wishlist" });
  }
};

// @desc    Toggle product in user's wishlist in MongoDB Atlas
// @route   POST /api/wishlist/toggle/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const prodIdStr = String(product._id);
    const existingIndex = wishlist.products.findIndex(
      (p) => String(p) === prodIdStr
    );

    let added = false;
    if (existingIndex > -1) {
      wishlist.products.splice(existingIndex, 1);
      added = false;
    } else {
      wishlist.products.push(product._id);
      added = true;
    }

    await wishlist.save();

    // Also synchronize user.wishlist
    await User.findByIdAndUpdate(req.user._id, {
      wishlist: wishlist.products,
    });

    const populated = await Wishlist.findById(wishlist._id).populate("products");

    res.json({
      success: true,
      added,
      message: added ? "Product added to your wishlist" : "Product removed from your wishlist",
      wishlist: populated.products,
    });
  } catch (error) {
    console.error("Toggle wishlist error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update wishlist" });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => String(p) !== String(productId));
      await wishlist.save();

      await User.findByIdAndUpdate(req.user._id, {
        wishlist: wishlist.products,
      });
    }

    const populated = await Wishlist.findOne({ user: req.user._id }).populate("products");

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: populated ? populated.products : [],
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to remove from wishlist" });
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/move-to-cart/:productId
// @access  Private
const moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 1. Remove from Wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => String(p) !== String(productId));
      await wishlist.save();
      await User.findByIdAndUpdate(req.user._id, { wishlist: wishlist.products });
    }

    // 2. Add to Cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const price = Number(product.discountPrice || product.price);
    const originalPrice = product.discountPrice ? Number(product.price) : price;

    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === String(product._id)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Math.min(product.stock, cart.items[existingIndex].quantity + 1);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price,
        originalPrice,
        image: product.image || (product.images && product.images[0]) || "",
        category: product.category,
        brand: product.brand || "",
        quantity: 1,
        stock: product.stock,
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Product moved from wishlist to cart!",
      cart: {
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
      },
      wishlist: wishlist ? wishlist.products : [],
    });
  } catch (error) {
    console.error("Move to cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to move product to cart" });
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  moveToCart,
};
