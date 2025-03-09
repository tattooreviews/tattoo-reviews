const jwt = require("jsonwebtoken");

// ✅ Ensure JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env file.");
  process.exit(1);
}

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "").trim(); // ✅ Ensure clean token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach user info to request
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      return res.status(401).json({ error: "Unauthorized: Token verification failed" });
    }
  }
};