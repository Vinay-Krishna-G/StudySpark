const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // 🧠 Question core
    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      A: { type: String, required: true },
      B: { type: String, required: true },
      C: { type: String, required: true },
      D: { type: String, required: true },
    },

    correctOption: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
      select: false,
    },

    explanation: {
      type: String,
      select: false,
    },

    // 🎯 Marks
    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    // 📚 Question bank metadata
    subject: {
      type: String,
      required: true,
      index: true,
    },

    chapter: {
      type: String,
      index: true,
    },

    topic: {
      type: String,
      index: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true,
    },

    // 🏆 Exam history
    examYear: {
      type: Number,
    },

    isPYQ: {
      type: Boolean,
      default: false,
      index: true,
    },

    isRepeated: {
      type: Boolean,
      default: false,
    },

    importance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    // 👨‍🏫 Ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ⭐ Compound indexes for filtering speed
questionSchema.index({ subject: 1, chapter: 1 });
questionSchema.index({ subject: 1, difficulty: 1 });

module.exports = mongoose.model("Question", questionSchema);
