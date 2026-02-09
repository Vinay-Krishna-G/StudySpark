const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    questionText: {
      type: String,
      required: true,
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

    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
