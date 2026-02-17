const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: {
          type: String,
          enum: ["A", "B", "C", "D"],
        },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["started", "submitted"],
      default: "started",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
