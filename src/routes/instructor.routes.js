const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const router = express.Router();

/**
 * POST /instructor/quizzes
 * Create new quiz
 */
router.post(
  "/quizzes",
  auth,
  allowRoles("instructor", "admin"),
  (req, res) => {
    res.status(201).json({
      message: "Quiz created successfully",
    });
  }
);

/**
 * PATCH /instructor/quizzes/:id
 * Update quiz
 */
router.patch(
  "/quizzes/:id",
  auth,
  allowRoles("instructor", "admin"),
  (req, res) => {
    res.json({
      message: `Quiz ${req.params.id} updated`,
    });
  }
);

/**
 * DELETE /instructor/quizzes/:id
 * Delete quiz
 */
router.delete(
  "/quizzes/:id",
  auth,
  allowRoles("instructor", "admin"),
  (req, res) => {
    res.json({
      message: `Quiz ${req.params.id} deleted`,
    });
  }
);

/**
 * POST /instructor/quizzes/:id/questions
 * Add question to quiz
 */
router.post(
  "/quizzes/:id/questions",
  auth,
  allowRoles("instructor", "admin"),
  (req, res) => {
    res.json({
      message: `Question added to quiz ${req.params.id}`,
    });
  }
);

/**
 * POST /instructor/resources
 * Upload learning resource
 */
router.post(
  "/resources",
  auth,
  allowRoles("instructor", "admin"),
  (req, res) => {
    res.status(201).json({
      message: "Resource uploaded successfully",
    });
  }
);

module.exports = router;
