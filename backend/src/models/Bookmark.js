const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["Question", "Flashcard"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // RefPath is dynamic depending on itemType
      refPath: 'itemType'
    },
    notes: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

// Prevent duplicate bookmarks for the same item by the same user
bookmarkSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
