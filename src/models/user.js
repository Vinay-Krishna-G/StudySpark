const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: [3, "First name must be at least 3 characters long"],
    },
    lastName: {
      type: String,
      trim: true,
      min: [3, "Last name must be at least 3 characters long"],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "admin", "educator"],
      default: "student",
    },

    adBlockDetected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordCorrect = await bcrypt.compare(
    passwordInputByUser,
    this.password,
  );
  return isPasswordCorrect;
};

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
