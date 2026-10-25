const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");

const razorpayKey = process.env.RAZORPAY_KEY_ID || "";
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "";

let razorpayInstance = null;
if (razorpayKey && razorpaySecret && !razorpayKey.includes("your_")) {
  try {
    razorpayInstance = new Razorpay({
      key_id: razorpayKey,
      key_secret: razorpaySecret,
    });
  } catch (err) {
    console.warn("Razorpay initialization skipped:", err.message);
  }
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Convert amount to paise (e.g. ₹100 = 10000 paise)
    const amountInPaise = Math.round(order.totalPrice * 100);

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${order._id}`,
        notes: {
          orderId: order._id.toString(),
          user: req.user._id.toString(),
        },
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);

      return res.json({
        success: true,
        isLiveGateway: true,
        key: razorpayKey,
        razorpayOrder,
        orderId: order._id,
      });
    } else {
      // Sandbox / Test Simulator Mode when real keys are not in .env
      const mockRazorpayOrderId = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      return res.json({
        success: true,
        isLiveGateway: false,
        key: "rzp_test_shopnest_demo_key",
        razorpayOrder: {
          id: mockRazorpayOrderId,
          amount: amountInPaise,
          currency: "INR",
          status: "created",
        },
        orderId: order._id,
        note: "ShopNest Test Payment Mode Active. Real keys can be configured in backend/.env",
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isMock,
    } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (isMock || !razorpaySecret || razorpaySecret.includes("your_")) {
      // Simulated verified payment in development mode
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "Confirmed";
      order.paymentResult = {
        id: razorpay_payment_id || `pay_mock_${Date.now()}`,
        status: "captured",
        razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id || `pay_mock_${Date.now()}`,
        razorpay_signature: "mock_signature_verified",
        paidAt: new Date(),
      };
      order.statusHistory.push({
        status: "Confirmed",
        timestamp: new Date(),
        note: "Payment completed successfully via Razorpay (Test Mode)",
      });

      const updated = await order.save();
      return res.json({
        success: true,
        message: "Payment verified successfully (Test Mode)",
        order: updated,
      });
    }

    // Cryptographic signature verification using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "Confirmed";
      order.paymentResult = {
        id: razorpay_payment_id,
        status: "captured",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paidAt: new Date(),
      };
      order.statusHistory.push({
        status: "Confirmed",
        timestamp: new Date(),
        note: "Payment verified successfully by server signature",
      });

      const updated = await order.save();
      return res.json({
        success: true,
        message: "Payment successfully verified",
        order: updated,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid cryptographic signature",
      });
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};

