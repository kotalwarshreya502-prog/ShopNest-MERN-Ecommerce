const Product = require("../models/product");
const Review = require("../models/Review");

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Keyword search
    const keyword = req.query.keyword || req.query.search || req.query.q;
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { name: regex },
        { brand: regex },
        { category: regex },
        { description: regex },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== "All") {
      query.category = new RegExp(`^${req.query.category.trim()}$`, "i");
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== "All") {
      query.brand = new RegExp(`^${req.query.brand.trim()}$`, "i");
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.minRating) {
      query.ratings = { $gte: Number(req.query.minRating) };
    }

    // In-stock only
    if (req.query.inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Featured only
    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    // Sorting
    let sort = { createdAt: -1 };
    const sortBy = req.query.sort || req.query.sortBy;

    if (sortBy === "price-low" || sortBy === "price_asc") {
      sort = { price: 1 };
    } else if (sortBy === "price-high" || sortBy === "price_desc") {
      sort = { price: -1 };
    } else if (sortBy === "rating") {
      sort = { ratings: -1 };
    } else if (sortBy === "newest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "bestseller") {
      sort = { numReviews: -1, ratings: -1 };
    } else {
      // Default: featured first, then newest
      sort = { isFeatured: -1, createdAt: -1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Fetch associated reviews
    const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 });

    // Fetch 4 related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json({
      success: true,
      product,
      reviews,
      relatedProducts,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch featured & trending products for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(8);
    const trending = await Product.find({}).sort({ ratings: -1, numReviews: -1 }).limit(8);
    const bestsellers = await Product.find({ isBestseller: true }).limit(8);

    res.json({
      success: true,
      featured: featured.length ? featured : trending,
      trending,
      bestsellers: bestsellers.length ? bestsellers : featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories with counts
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          image: { $first: "$image" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories: categories.map((c) => ({
        name: c._id,
        count: c.count,
        image: c.image,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distinct brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json({ success: true, brands: brands.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      image,
      images,
      brand,
      category,
      stock,
      isFeatured,
      isBestseller,
      specifications,
    } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      description,
      image: image || (images && images[0]) || "",
      images: images || (image ? [image] : []),
      brand: brand || "ShopNest",
      category,
      stock: Number(stock) || 0,
      isFeatured: !!isFeatured,
      isBestseller: !!isBestseller,
      specifications: specifications || [],
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const fields = [
      "name",
      "price",
      "discountPrice",
      "description",
      "image",
      "images",
      "brand",
      "category",
      "stock",
      "isFeatured",
      "isBestseller",
      "specifications",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.deleteOne({ _id: product._id });
    await Review.deleteMany({ product: product._id });

    res.json({ success: true, message: "Product and associated reviews deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
};

