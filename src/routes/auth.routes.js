const express = require("express");
const validateSignUpData = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send("User created Successfully !!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    } else {
      const isPasswordCorrect = await user.validatePassword(password);

      if (!isPasswordCorrect) {
        throw new Error("Invalid Credentials!!");
      } else {
        const token = await user.getJWT();
        console.log(token);

        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 3600000),
        });
        res.status(200).json({
          message: "Login Successful !!",
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
          }
        });
      }
    }
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = authRouter;


