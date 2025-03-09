const express = require("express");
const Review = require("../models/Review"); // ✅ FIXED PATH
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import Authentication Middleware

const router = express.Router();

// ✅ POST: Add a New Review (Protected)
router.post("/reviews", authMiddleware, async (req, res) => {
  try {
    const { artistName, shopName, location, rating, reviewText, reviewImages } = req.body;

    const newReview = new Review({
      artistName,
      shopName,
      location,
      rating,
      reviewText,
      reviewImages,
      user: req.user.userId, // ✅ Associate review with logged-in user
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully!", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

// ✅ GET: Fetch All Reviews (Public)
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// ✅ GET: Fetch a Single Review by ID (Public)
router.get("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

// ✅ PUT: Update a Review by ID (Protected)
router.put("/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId }, // ✅ Ensure the logged-in user owns the review
      req.body,
      { new: true }
    );

    if (!updatedReview) return res.status(404).json({ error: "Review not found or unauthorized" });

    res.json({ message: "Review updated successfully!", review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to update review" });
  }
});

// ✅ DELETE: Remove a Review by ID (Protected)
router.delete("/reviews/:id", authMiddleware, async (req, res) => {
  try {
    const deletedReview = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId, // ✅ Ensure the logged-in user owns the review
    });

    if (!deletedReview) return res.status(404).json({ error: "Review not found or unauthorized" });

    res.json({ message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;