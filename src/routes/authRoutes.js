const express = require("express");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2"); // ✅ Using Argon2
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// ✅ Ensure JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env file.");
  process.exit(1);
}

// ✅ POST: User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // ✅ Validate input
    if (!name || !username || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("🔍 Hashing password...");
    const hashedPassword = await argon2.hash(password);

    console.log("✅ Hashed Password:", hashedPassword);

    user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    console.log("✅ User registered successfully:", user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ✅ POST: User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("🔍 Verifying password...");
    const isMatch = await argon2.verify(user.password, password);
    console.log("✅ Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("❌ Passwords do NOT match.");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;