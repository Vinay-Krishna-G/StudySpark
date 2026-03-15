const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ["biology", "chemistry", "physics", "maths", "engineering", "medical", "general"],
    },
    testType: {
      type: String,
      required: true,
      enum: ["mock", "chapter-wise"],
      default: "chapter-wise"
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "mixed"
    },
    category: {
      type: String,
      enum: ["engineering", "medical"],
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

testSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Test", testSchema);
