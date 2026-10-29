require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const DEMO_USERS = [
  {
    name: "ShopNest Administrator",
    email: "admin@shopnest.com",
    password: "Admin@123456",
    role: "admin",
    phone: "9876543210",
  },
  {
    name: "Rahul Sharma",
    email: "customer@shopnest.com",
    password: "Customer@123456",
    role: "customer",
    phone: "9123456780",
    addresses: [
      {
        fullName: "Rahul Sharma",
        phone: "9123456780",
        addressLine: "Flat 402, Sunshine Heights, Linking Road",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400050",
        country: "India",
        isDefault: true,
      },
    ],
  },
];

async function seedDemoUsers() {
  try {
    await connectDB();
    console.log("Verifying ShopNest demo accounts...");

    for (const demo of DEMO_USERS) {
      const normalizedEmail = demo.email.trim().toLowerCase();
      let user = await User.findOne({ email: normalizedEmail }).select("+password");

      if (!user) {
        // Create user from scratch - pre("save") hook will hash the password once
        await User.create({
          name: demo.name,
          email: normalizedEmail,
          password: demo.password,
          role: demo.role,
          phone: demo.phone,
          addresses: demo.addresses || [],
        });
        console.log(` Created missing demo user: ${normalizedEmail} (${demo.role})`);
      } else {
        // User exists: verify if existing password works
        const passwordMatches = await user.comparePassword(demo.password);
        if (!passwordMatches) {
          // Update password safely via save() to let pre("save") re-hash cleanly
          user.password = demo.password;
          user.role = demo.role; // ensure correct role
          await user.save();
          console.log(` Synchronized credentials for demo user: ${normalizedEmail} (${demo.role})`);
        } else {
          console.log(` Demo user ready and valid: ${normalizedEmail} (${demo.role})`);
        }
      }
    }

    console.log("\nDemo accounts ready for evaluation:");
    console.log("  1. Admin    : admin@shopnest.com    / Admin@123456");
    console.log("  2. Customer : customer@shopnest.com / Customer@123456\n");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed demo users:", error.message);
    process.exit(1);
  }
}

seedDemoUsers();

