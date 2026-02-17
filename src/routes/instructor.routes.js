const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const Test = require("../models/Test");
const Question = require("../models/question");

const router = express.Router();

/**
 * POST /instructor/quizzes
 * Create new test
 */
router.post(
  "/quizzes",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const { title, subject, category, duration } = req.body;

      const test = await Test.create({
        title,
        subject,
        category,
        duration,
        totalMarks: 0,
        createdBy: req.user._id,
      });

      res.status(201).json(test);

    } catch (err) {
      res.status(500).json({ error: "Failed to create test" });
    }
  }
);

/**
 * POST /instructor/quizzes/:testId/questions
 * Add question to test
 */
router.post(
  "/quizzes/:testId/questions",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const {
        questionText,
        options,
        correctOption,
        difficulty,
        marks,
        negativeMarks,
      } = req.body;

      const test = await Test.findById(req.params.testId);

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      const question = await Question.create({
        testId: test._id,
        questionText,
        options,
        correctOption,
        difficulty,
        marks,
        negativeMarks,
      });

      test.questions.push(question._id);
      test.totalMarks += marks;

      await test.save();

      res.status(201).json({
        message: "Question added successfully",
        questionId: question._id,
      });

    } catch (err) {
      res.status(500).json({ error: "Failed to add question", err: err.message });
    }
  }
);

/**
 * GET /instructor/quizzes
 * View quizzes created by instructor
 */
router.get(
  "/quizzes",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const quizzes = await Test.find({ createdBy: req.user._id })
        .select("title subject category duration totalMarks");

      res.status(200).json(quizzes);

    } catch (err) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  }
);

/**
 * DELETE /instructor/quizzes/:testId
 * Delete a test
 */
router.delete(
  "/quizzes/:testId",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const test = await Test.findOneAndDelete({
        _id: req.params.testId,
        createdBy: req.user._id,
      });

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      await Question.deleteMany({ testId: test._id });

      res.status(200).json({
        message: "Test deleted successfully",
      });

    } catch (err) {
      res.status(500).json({ error: "Failed to delete test" });
    }
  }
);

module.exports = router;
