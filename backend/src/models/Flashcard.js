const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      index: true,
    },
    chapter: {
      type: String,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster filtering
flashcardSchema.index({ subject: 1, chapter: 1 });
flashcardSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Flashcard", flashcardSchema);
