const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const Flashcard = require("../models/Flashcard");
const Report = require("../models/Report");
const Bookmark = require("../models/Bookmark");

const router = express.Router();

/**
 * POST /student/report-question
 * Report a question
 */
router.post("/report-question", auth, allowRoles("student"), async (req, res) => {
  try {
    const { questionId, reason, description } = req.body;

    if (!questionId || !reason) {
      return res.status(400).json({ error: "Question ID and reason are required" });
    }

    const validReasons = ["inappropriate", "incorrect_question", "incorrect_options", "other"];
    const mappedReason = validReasons.includes(reason) ? reason : "other";

    const report = await Report.create({
      question: questionId,
      reportedBy: req.user._id,
      reason: mappedReason,
      description: validReasons.includes(reason) ? description : reason, // Use user text as description if it was not valid
    });

    res.status(201).json({
      message: "Question reported successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to report question" });
  }
});

/**
 * GET /student/flashcards
 * Get flashcards with optional filters
 */
router.get("/flashcards", auth, allowRoles("student"), async (req, res) => {
  try {
    const { subject, chapter, difficulty } = req.query;
    const filter = {};

    if (subject) filter.subject = subject;
    if (chapter) filter.chapter = chapter;
    if (difficulty) filter.difficulty = difficulty;

    const flashcards = await Flashcard.find(filter)
      .select("quote subject chapter difficulty")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      count: flashcards.length,
      flashcards 
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flashcards" });
  }
});

/**
 * POST /student/bookmarks
 * Bookmark a question or flashcard
 */
router.post("/bookmarks", auth, allowRoles("student"), async (req, res) => {
  try {
    const { itemType, itemId, notes } = req.body;

    if (!["Question", "Flashcard"].includes(itemType) || !itemId) {
      return res.status(400).json({ error: "Valid itemType and itemId are required" });
    }

    // Check if already bookmarked
    const existing = await Bookmark.findOne({ user: req.user._id, itemId, itemType });
    if (existing) {
      return res.status(400).json({ error: "Already bookmarked" });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      itemType,
      itemId,
      notes,
    });

    res.status(201).json({ message: "Bookmarked successfully", bookmark });
  } catch (err) {
    // Check for duplicate key errors from Mongoose unique index
    if (err.code === 11000) {
        return res.status(400).json({ error: "Already bookmarked" });
    }
    res.status(500).json({ error: "Failed to create bookmark", err: err.message });
  }
});

/**
 * GET /student/bookmarks
 * View all bookmarks for user
 */
router.get("/bookmarks", auth, allowRoles("student"), async (req, res) => {
  try {
    const { itemType } = req.query;
    const filter = { user: req.user._id };
    
    if (itemType) {
      filter.itemType = itemType;
    }

    const bookmarks = await Bookmark.find(filter)
      .populate("itemId") // Automatically uses refPath to figure out Question or Flashcard dynamically
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookmarks.length, bookmarks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

/**
 * DELETE /student/bookmarks/:bookmarkId
 * Remove a bookmark
 */
router.delete("/bookmarks/:bookmarkId", auth, allowRoles("student"), async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ _id: req.params.bookmarkId, user: req.user._id });
    res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

module.exports = router;
