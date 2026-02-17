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
      enum: ["biology", "chemistry", "physics", "maths"],
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

module.exports = mongoose.model("Test", testSchema);
