const Cart = require("../models/Cart");
const Product = require("../models/product");

// @desc    Get current user's cart from MongoDB
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        user: cart.user,
        items: cart.items.map((item) => ({
          _id: item._id,
          product: item.product?._id || item.product,
          productId: item.product?._id || item.product,
          name: item.product?.name || item.name,
          price: Number(item.product?.discountPrice || item.product?.price || item.price),
          originalPrice: Number(item.product?.price || item.originalPrice || item.price),
          image: item.product?.image || item.image || (item.product?.images && item.product.images[0]) || "",
          category: item.product?.category || item.category || "General",
          brand: item.product?.brand || item.brand || "",
          stock: item.product?.stock !== undefined ? item.product.stock : item.stock || 999,
          quantity: item.quantity,
        })),
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve cart" });
  }
};

// @desc    Add product to user's MongoDB cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    // Validate product existence and inventory in MongoDB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Sorry, this product is currently out of stock" });
    }

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
      const newQty = Math.min(product.stock, cart.items[existingIndex].quantity + qty);
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
      cart.items[existingIndex].stock = product.stock;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price,
        originalPrice,
        image: product.image || (product.images && product.images[0]) || "",
        category: product.category,
        brand: product.brand || "",
        quantity: Math.min(product.stock, qty),
        stock: product.stock,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Your product has been successfully added to your cart!",
      cart: {
        _id: cart._id,
        items: cart.items.map((item) => ({
          _id: item._id,
          product: item.product,
          productId: item.product,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.image,
          category: item.category,
          brand: item.brand,
          stock: item.stock,
          quantity: item.quantity,
        })),
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to add product to cart" });
  }
};

// @desc    Update quantity of an item in MongoDB cart
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = parseInt(quantity, 10);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    if (isNaN(qty) || qty <= 0) {
      cart.items = cart.items.filter((item) => String(item.product) !== String(productId));
    } else {
      const itemIndex = cart.items.findIndex((item) => String(item.product) === String(productId));
      if (itemIndex > -1) {
        const product = await Product.findById(productId);
        const maxStock = product ? product.stock : 999;
        cart.items[itemIndex].quantity = Math.min(maxStock, qty);
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: {
        _id: cart._id,
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update cart" });
  }
};

// @desc    Remove an item from MongoDB cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => String(item.product) !== String(productId));
    await cart.save();

    res.json({
      success: true,
      message: "Product removed from cart",
      cart: {
        _id: cart._id,
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to remove item" });
  }
};

// @desc    Clear entire cart in MongoDB
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalPrice = 0;
      await cart.save();
    }
    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to clear cart" });
  }
};

// @desc    Sync pending or guest item into MongoDB cart after login
// @route   POST /api/cart/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items = [] } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    for (const item of items) {
      const prodId = item.productId || item.product || item._id;
      if (!prodId) continue;

      const product = await Product.findById(prodId);
      if (!product || product.stock <= 0) continue;

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const price = Number(product.discountPrice || product.price);
      const originalPrice = product.discountPrice ? Number(product.price) : price;

      const existingIndex = cart.items.findIndex(
        (ci) => String(ci.product) === String(product._id)
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity = Math.min(
          product.stock,
          cart.items[existingIndex].quantity + qty
        );
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          price,
          originalPrice,
          image: product.image || (product.images && product.images[0]) || "",
          category: product.category,
          brand: product.brand || "",
          quantity: Math.min(product.stock, qty),
          stock: product.stock,
        });
      }
    }

    await cart.save();

    res.json({
      success: true,
      message: "Cart synced with MongoDB Atlas successfully",
      cart: {
        _id: cart._id,
        items: cart.items,
        totalQuantity: cart.totalQuantity,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to sync cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart,
};

