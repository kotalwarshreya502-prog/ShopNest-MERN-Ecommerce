require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/product");
const Category = require("./models/Category");

async function fixCatalog() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1: Fix Known Category Mismatches on Existing Products
    // ─────────────────────────────────────────────────────────────────────────
    console.log("Fixing misplaced products into strict canonical categories...");

    // 1. Move watches out of Accessories into Watches
    await Product.updateMany(
      {
        $or: [
          { name: { $regex: /wrist watch/i } },
          { name: { $regex: /smartwatch/i } },
          { name: { $regex: /\bwatch\b/i }, category: { $ne: "Watches" } }
        ]
      },
      {
        $set: { category: "Watches" }
      }
    );

    // 2. Move mice, keyboards, monitors out of Laptops/Computers into Gaming
    await Product.updateMany(
      {
        name: { $regex: /mouse|keyboard|monitor/i },
        category: { $in: ["Laptops", "Laptops & Computers", "Electronics"] }
      },
      {
        $set: { category: "Gaming" }
      }
    );

    // 3. Move chargers, cases, power banks out of Mobiles into Accessories
    await Product.updateMany(
      {
        name: { $regex: /charger|bumper case|magfit case|power bank|cable/i },
        category: { $in: ["Mobiles", "Mobiles & Accessories"] }
      },
      {
        $set: { category: "Accessories", subcategory: "Mobile accessories" }
      }
    );

    // 4. Move headphones/earbuds into Accessories
    await Product.updateMany(
      {
        name: { $regex: /headphones|earbuds|airpods/i },
        category: { $in: ["Electronics", "Mobiles & Accessories"] }
      },
      {
        $set: { category: "Accessories", subcategory: "Headphones" }
      }
    );

    // 5. Canonicalize "Mobiles & Accessories" phones -> "Mobiles"
    await Product.updateMany(
      { category: "Mobiles & Accessories" },
      { $set: { category: "Mobiles" } }
    );

    // 6. Canonicalize "Laptops & Computers" laptops -> "Laptops"
    await Product.updateMany(
      { category: "Laptops & Computers" },
      { $set: { category: "Laptops" } }
    );

    console.log("Canonical categories assigned.");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2: Fix Mismatched Image URLs on Individual Products
    // ─────────────────────────────────────────────────────────────────────────
    console.log("Fixing specific image mismatches...");

    // Fix Tommy Hilfiger Belt (was using backpack photo)
    await Product.updateMany(
      { name: { $regex: /tommy hilfiger.*belt/i } },
      {
        $set: {
          image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Fix Da Milano Belt
    await Product.updateMany(
      { name: { $regex: /da milano.*belt/i } },
      {
        $set: {
          image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Fix Women's Running Shoes (was using high heel sandal photo)
    await Product.updateMany(
      { name: { $regex: /women's running shoes/i } },
      {
        $set: {
          image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Fix Woodland Trekking Boots (was using sneaker photo)
    await Product.updateMany(
      { name: { $regex: /woodland.*boots/i } },
      {
        $set: {
          image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Ensure Men's Classic Wrist Watch has real watch image
    await Product.updateMany(
      { name: { $regex: /men's classic wrist watch/i } },
      {
        $set: {
          category: "Watches",
          image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Ensure Women's Elegant Wrist Watch has real watch image
    await Product.updateMany(
      { name: { $regex: /women's elegant wrist watch/i } },
      {
        $set: {
          category: "Watches",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Ensure Spigen case has real phone case image
    await Product.updateMany(
      { name: { $regex: /spigen ultra hybrid shockproof/i } },
      {
        $set: {
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    // Ensure Anker 65W GaN Charger has real charger image
    await Product.updateMany(
      { name: { $regex: /anker 65w gan/i } },
      {
        $set: {
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
          images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"]
        }
      }
    );

    console.log("Specific image URLs verified and updated.");

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3: Remove Redundant Duplicate Products
    // ─────────────────────────────────────────────────────────────────────────
    console.log("Auditing and removing duplicate products...");
    // Group products by lowercase name
    const allProducts = await Product.find({}).sort({ createdAt: -1 });
    const seenNames = new Set();
    let removedDuplicates = 0;

    for (const p of allProducts) {
      // Normalize name for comparison (remove extra spaces and punctuation)
      const cleanName = p.name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30);
      if (seenNames.has(cleanName)) {
        await Product.deleteOne({ _id: p._id });
        removedDuplicates++;
      } else {
        seenNames.add(cleanName);
      }
    }
    console.log(`Deduplication complete: ${removedDuplicates} duplicate records removed.`);

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4: Verify Category Counts & Clean Category Collection
    // ─────────────────────────────────────────────────────────────────────────
    const remainingBreakdown = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log("=== Final Products Breakdown by Category ===");
    console.log(JSON.stringify(remainingBreakdown, null, 2));

    // Update Category Collection
    for (const group of remainingBreakdown) {
      const slug = group._id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const sampleProd = await Product.findOne({ category: group._id }).sort({ ratings: -1 });
      await Category.findOneAndUpdate(
        { slug },
        {
          $set: {
            name: group._id,
            slug,
            itemCount: group.count,
            image: sampleProd ? sampleProd.image : "",
            isActive: true
          }
        },
        { upsert: true }
      );
    }

    // Clean up deprecated category slugs from Category collection
    await Category.deleteMany({ slug: { $in: ["mobiles-accessories", "laptops-computers", "home-accessories"] } });

    const totalCount = await Product.countDocuments();
    console.log(`Final Total Products in Atlas: ${totalCount}`);

    await mongoose.disconnect();
    console.log("Database catalog normalization completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during catalog fix:", err);
    process.exit(1);
  }
}

fixCatalog();

