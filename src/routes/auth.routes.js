const express = require("express");
const validateSignUpData = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

/**
 * SIGNUP
 */
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    res.status(201).json({
      message: "User created successfully",
    });

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

/**
 * LOGIN
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token =  user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      // sameSite: "strict",
      secure: false, // set true in production (HTTPS)
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = authRouter;
