const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    subcategory: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "ShopNest",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    ratings: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Text search index
productSchema.index({ name: "text", brand: "text", category: "text", description: "text", tags: "text" });

// Compound indexes for common queries
productSchema.index({ category: 1, isFeatured: -1 });
productSchema.index({ isBestseller: 1, ratings: -1 });
productSchema.index({ isNewArrival: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });

module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);
