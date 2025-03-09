const mongoose = require("mongoose");
const argon2 = require("argon2");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password using Argon2
});

// 🔹 Hash password function (before saving)
UserSchema.methods.setPassword = async function (password) {
  this.password = await argon2.hash(password); // Hash password with Argon2
};

// 🔹 Validate password function (during login)
UserSchema.methods.validatePassword = async function (password) {
  return await argon2.verify(this.password, password); // Verify hash with Argon2
};

module.exports = mongoose.model("User", UserSchema);