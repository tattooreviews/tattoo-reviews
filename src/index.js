const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ Import API routes
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Use API routes
app.use("/api/auth", authRoutes);  // Authentication routes -> /api/auth
app.use("/api", reviewRoutes);  // ✅ Fix: Correctly mount reviewRoutes under /api

// ✅ Debugging: List All Registered Routes
console.log("✅ Listing all registered routes:");
const registeredRoutes = [];

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    registeredRoutes.push(`🛠️ Registered Route -> ${middleware.route.path} [${Object.keys(middleware.route.methods).join(", ").toUpperCase()}]`);
  } else if (middleware.name === "router") {
    const basePath = middleware.regexp.toString().replace("/^\\", "").replace("\\/?(?=\\/|$)/i", "").replace(/\\\//g, "/");
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        registeredRoutes.push(`🛠️ Registered Route -> ${basePath}${handler.route.path} [${Object.keys(handler.route.methods).join(", ").toUpperCase()}]`);
      }
    });
  }
});
registeredRoutes.forEach((route) => console.log(route));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Root Route (Basic API Test)
app.get("/", (req, res) => {
  res.send("🎉 Welcome to Tattoo Reviews API!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});