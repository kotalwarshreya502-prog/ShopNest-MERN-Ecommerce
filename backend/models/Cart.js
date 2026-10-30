const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    brand: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    stock: {
      type: Number,
      default: 999,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to recalculate totals
cartSchema.methods.calculateTotals = function () {
  this.totalQuantity = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );
  return this;
};

cartSchema.pre("save", function () {
  this.calculateTotals();
});

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
