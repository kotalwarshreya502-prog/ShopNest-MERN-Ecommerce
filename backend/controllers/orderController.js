const Order = require("../models/Order");
const Product = require("../models/product");
const Coupon = require("../models/Coupon");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      customerInfo,
      couponCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided" });
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: "Shipping address is incomplete" });
    }

    // 1. Recalculate prices & validate stock against the database
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product || item._id);

      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || item.product}`,
        });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for "${dbProduct.name}". Only ${dbProduct.stock} units available.`,
        });
      }

      const unitPrice = dbProduct.discountPrice || dbProduct.price;
      itemsPrice += unitPrice * item.quantity;

      validatedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.image || (dbProduct.images && dbProduct.images[0]) || "",
        price: unitPrice,
        quantity: item.quantity,
      });

      // Deduct stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    // 2. Shipping calculation: Free above ₹999, else ₹79
    const shippingPrice = itemsPrice >= 999 ? 0 : 79;

    // 3. Coupon validation on server
    let discountPrice = 0;
    let validCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        const check = coupon.isValid(itemsPrice);
        if (check.valid) {
          discountPrice = coupon.calculateDiscount(itemsPrice);
          validCouponCode = coupon.code;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const totalPrice = Math.max(0, itemsPrice + shippingPrice - discountPrice);

    const order = new Order({
      user: req.user._id,
      customerInfo: customerInfo || {
        name: req.user.name,
        email: req.user.email,
        phone: shippingAddress.phone || "",
      },
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      itemsPrice,
      shippingPrice,
      discountPrice,
      couponApplied: validCouponCode,
      totalPrice,
      isPaid: paymentMethod === "Razorpay" ? false : false, // Marked paid on verification
      status: "Pending",
      statusHistory: [
        {
          status: "Pending",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Authorization check: User can only view their own order, unless admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not have permission to view this order",
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an order (customer)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status.toLowerCase()}`,
      });
    }

    // Restore inventory stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "Cancelled";
    order.cancelReason = req.body.reason || "Cancelled by customer";
    order.statusHistory.push({
      status: "Cancelled",
      timestamp: new Date(),
      note: order.cancelReason,
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully. Restored inventory stock.",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("user", "id name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    if (status === "Delivered") {
      order.deliveredAt = new Date();
      if (order.paymentMethod === "COD") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};

