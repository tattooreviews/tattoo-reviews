const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  artistName: { type: String, required: true },
  shopName: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
  reviewImages: { type: [String] },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", ReviewSchema);