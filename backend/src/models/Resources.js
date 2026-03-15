const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      index: true,
    },

    chapter: {
      type: String,
      index: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);