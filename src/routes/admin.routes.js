const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");
const User = require("../models/user");
const Test = require("../models/Test");
const Question = require("../models/question");
const TestAttempt = require("../models/TestAttempt");

const router = express.Router();

/**
 * GET /admin/users
 * View all users
 */
router.get("/users", auth, allowRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    message: "All users",
    users,
  });
});

/**
 * PATCH /admin/users/:id/role
 * Change user role
 */
router.patch("/users/:id/role", auth, allowRoles("admin"), async (req, res) => {
  const { role } = req.body;

  if (!["student", "instructor", "admin"].includes(role)) {
    return res.status(400).json({
      error: "Invalid role",
    });
  }

  await User.findByIdAndUpdate(req.params.id, { role });

  res.json({
    message: "User role updated",
  });
});

/**
 * PATCH /admin/users/:id/block
 * Block a user
 */
router.patch(
  "/users/:id/block",
  auth,
  allowRoles("admin"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
      isBlocked: true,
    });

    res.json({
      message: "User blocked",
    });
  },
);

/**
 * DELETE /admin/users/:id
 * Delete user
 */
router.delete("/users/:id", auth, allowRoles("admin"), async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await user.deleteOne();

  res.json({
    message: "User deleted",
  });
});

router.get("/dashboard", auth, allowRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTests = await Test.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAttempts = await TestAttempt.countDocuments();

    res.json({
      totalUsers,
      totalTests,
      totalQuestions,
      totalAttempts,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

router.get("/online-users", auth, allowRoles("admin"), async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const users = await User.find({
      updatedAt: { $gte: fiveMinutesAgo },
    }).select("firstName lastName email role updatedAt");

    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch online users",
    });
  }
});

router.get("/recent-attempts", auth, allowRoles("admin"), async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
      .populate("user", "firstName email")
      .populate("test", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(attempts);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch attempts",
    });
  }
});

module.exports = router;
