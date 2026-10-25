const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
    },
    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // null means no cap for percentage
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 1000,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.methods.isValid = function (orderSubtotal) {
  if (!this.isActive) return { valid: false, message: "This coupon is inactive" };
  if (this.expiresAt && new Date() > this.expiresAt) {
    return { valid: false, message: "This coupon has expired" };
  }
  if (this.usedCount >= this.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }
  if (orderSubtotal < this.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order amount for this coupon is ₹${this.minOrderAmount}`,
    };
  }
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (orderSubtotal) {
  if (this.discountType === "percent") {
    let disc = (orderSubtotal * this.discountValue) / 100;
    if (this.maxDiscountAmount && disc > this.maxDiscountAmount) {
      disc = this.maxDiscountAmount;
    }
    return Math.round(disc);
  } else {
    return Math.min(orderSubtotal, this.discountValue);
  }
};

module.exports =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

