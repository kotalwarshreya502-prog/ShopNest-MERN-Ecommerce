const Product = require("../models/product");
const Review = require("../models/Review");

// Intelligent category synonym mapping to prevent empty category pages
const CATEGORY_SYNONYMS = {
  kitchen: ["Kitchen", "Kitchen Products", "Kitchen & Dining", "Cookware", "Kitchen Appliances"],
  "kitchen-products": ["Kitchen Products", "Kitchen", "Kitchen & Dining", "Cookware", "Kitchen Appliances"],
  "home-accessories": ["Home Accessories", "Home & Living", "Accessories", "Home Decor", "Decor"],
  "home accessories": ["Home Accessories", "Home & Living", "Accessories", "Home Decor", "Decor"],
  "home-living": ["Home & Living", "Home Accessories", "Furniture", "Home Decor"],
  "home & living": ["Home & Living", "Home Accessories", "Furniture", "Home Decor"],
  toys: ["Toys", "Toys & Games", "Toys & Lifestyle"],
  lifestyle: ["Lifestyle", "Toys & Lifestyle", "Travel & Lifestyle"],
  "toys-lifestyle": ["Toys & Lifestyle", "Toys", "Lifestyle", "Toys & Games"],
  gaming: ["Gaming", "Video Games", "Gamers"],
  fashion: ["Fashion", "Clothing", "Apparel", "Wear"],
  beauty: ["Beauty", "Beauty & Personal Care", "Skincare", "Personal Care"],
  sports: ["Sports", "Sports & Fitness", "Fitness"],
  "sports-fitness": ["Sports & Fitness", "Sports", "Fitness"],
  books: ["Books", "Books & Stationery", "Stationery"],
  "books-stationery": ["Books & Stationery", "Books", "Stationery"],
  footwear: ["Footwear", "Shoes", "Sneakers"],
  watches: ["Watches", "Timepieces"],
  accessories: ["Accessories", "Home Accessories", "Mobiles & Accessories"],
  mobiles: ["Mobiles & Accessories", "Smartphones", "Mobiles"],
  "mobiles-accessories": ["Mobiles & Accessories", "Smartphones", "Mobiles"],
  laptops: ["Laptops & Computers", "Laptops", "Computers"],
  "laptops-computers": ["Laptops & Computers", "Laptops", "Computers"],
  electronics: ["Electronics", "Audio", "Cameras"],
};

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 48);
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
        { subcategory: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    // Category filter (flexible slug or exact matching with synonym expansion)
    if (req.query.category && req.query.category !== "All") {
      const catParam = req.query.category.trim();
      const slugKey = catParam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const synonyms = CATEGORY_SYNONYMS[slugKey] || CATEGORY_SYNONYMS[catParam.toLowerCase()] || [];

      const sanitized = catParam.replace(/[-_]+/g, "[ &-_]*");
      const terms = Array.from(new Set([catParam, sanitized, ...synonyms]));

      const categoryConditions = [];
      terms.forEach((term) => {
        const escaped = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/\\\[ &-_\\\*\\\]\*/g, "[ &-_]*");
        categoryConditions.push({ category: new RegExp(`^${escaped}$`, "i") });
        categoryConditions.push({ category: new RegExp(`\\b${escaped}\\b`, "i") });
        categoryConditions.push({ subcategory: new RegExp(`^${escaped}$`, "i") });
      });

      if (query.$and) {
        query.$and.push({ $or: categoryConditions });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: categoryConditions }];
        delete query.$or;
      } else {
        query.$or = categoryConditions;
      }
    }

    // Subcategory filter
    if (req.query.subcategory) {
      query.subcategory = new RegExp(`^${req.query.subcategory.trim()}$`, "i");
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== "All") {
      query.brand = new RegExp(`^${req.query.brand.trim()}$`, "i");
    }

    // Price range (handles both discountPrice and regular price accurately)
    if (req.query.minPrice || req.query.maxPrice) {
      const priceQuery = {};
      if (req.query.minPrice) priceQuery.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceQuery.$lte = Number(req.query.maxPrice);

      const priceConditions = [
        { discountPrice: priceQuery },
        {
          $and: [
            { $or: [{ discountPrice: null }, { discountPrice: { $exists: false } }, { discountPrice: 0 }] },
            { price: priceQuery },
          ],
        },
      ];

      if (query.$and) {
        query.$and.push({ $or: priceConditions });
      } else {
        query.$and = [{ $or: priceConditions }];
      }
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

    // Bestseller only
    if (req.query.bestseller === "true") {
      query.isBestseller = true;
    }

    // New arrivals only
    if (req.query.newArrival === "true") {
      query.isNewArrival = true;
    }

    // Sorting
    let sort = { isFeatured: -1, createdAt: -1 };
    const sortBy = req.query.sort || req.query.sortBy;

    if (sortBy === "price-low" || sortBy === "price_asc") {
      sort = { discountPrice: 1, price: 1 };
    } else if (sortBy === "price-high" || sortBy === "price_desc") {
      sort = { discountPrice: -1, price: -1 };
    } else if (sortBy === "rating") {
      sort = { ratings: -1, numReviews: -1 };
    } else if (sortBy === "newest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "bestseller") {
      sort = { isBestseller: -1, numReviews: -1, ratings: -1 };
    } else if (sortBy === "discount") {
      sort = { discountPrice: 1 };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit).lean();

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

// @desc    Fetch single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    let product;
    const param = req.params.id;

    // Try slug first, then ObjectId
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param);
    } else {
      product = await Product.findOne({ slug: param.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Fetch associated reviews
    const reviews = await Review.find({ product: product._id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    // Fetch 6 related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .sort({ ratings: -1 })
      .limit(6)
      .lean();

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

// @desc    Fetch featured, trending, bestsellers & new arrivals for homepage
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const [featured, trending, bestsellers, newArrivals] = await Promise.all([
      Product.find({ isFeatured: true }).sort({ ratings: -1 }).limit(10).lean(),
      Product.find({ stock: { $gt: 0 } }).sort({ ratings: -1, numReviews: -1 }).limit(10).lean(),
      Product.find({ isBestseller: true }).sort({ numReviews: -1 }).limit(10).lean(),
      Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    res.json({
      success: true,
      featured: featured.length ? featured : trending.slice(0, 8),
      trending,
      bestsellers: bestsellers.length ? bestsellers : trending,
      newArrivals: newArrivals.length ? newArrivals : featured.slice(0, 4),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories with product counts and images
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
        slug: c._id.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get distinct brands (optionally filtered by category)
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") {
      filter.category = new RegExp(`^${req.query.category}$`, "i");
    }
    const brands = await Product.distinct("brand", filter);
    res.json({ success: true, brands: brands.filter(Boolean).sort() });
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
      name, price, discountPrice, description, image, images,
      brand, category, subcategory, stock, isFeatured, isBestseller,
      isNewArrival, specifications, tags, slug,
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
      subcategory: subcategory || "",
      stock: Number(stock) || 0,
      isFeatured: !!isFeatured,
      isBestseller: !!isBestseller,
      isNewArrival: !!isNewArrival,
      specifications: specifications || [],
      tags: tags || [],
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, message: "Product created successfully", product: createdProduct });
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
      "name", "price", "discountPrice", "description", "image", "images",
      "brand", "category", "subcategory", "stock", "isFeatured", "isBestseller",
      "isNewArrival", "specifications", "tags", "slug",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    const updatedProduct = await product.save();
    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
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
