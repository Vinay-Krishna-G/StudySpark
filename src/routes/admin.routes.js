const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");
const User = require("../models/user");

const router = express.Router();

/**
 * GET /admin/users
 * View all users
 */
router.get(
  "/users",
  auth,
  allowRoles("admin"),
  async (req, res) => {
    const users = await User.find().select("-password");

    res.json({
      message: "All users",
      users,
    });
  }
);

/**
 * PATCH /admin/users/:id/role
 * Change user role
 */
router.patch(
  "/users/:id/role",
  auth,
  allowRoles("admin"),
  async (req, res) => {
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
  }
);

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
  }
);

/**
 * DELETE /admin/users/:id
 * Delete user
 */
router.delete(
  "/users/:id",
  auth,
  allowRoles("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted",
    });
  }
);

module.exports = router;
