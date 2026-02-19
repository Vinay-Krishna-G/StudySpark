const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const Test = require("../models/Test");
const Question = require("../models/question");
const TestAttempt = require("../models/TestAttempt");

const router = express.Router();

/**
 * GET /student/tests
 * Get available tests
 */
router.get("/tests", auth, allowRoles("student"), async (req, res) => {
  try {
    const tests = await Test.find().select(
      "title subject category duration totalMarks",
    );

    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

/**
 * POST /student/tests/:testId/start
 * Start a test
 */
router.post(
  "/tests/:testId/start",
  auth,
  allowRoles("student"),
  async (req, res) => {
    try {
      // 🔒 Prevent multiple active attempts
      const existingAttempt = await TestAttempt.findOne({
        user: req.user._id,
        test: req.params.testId,
        status: "started",
      });

      if (existingAttempt) {
        return res.status(400).json({
          error: "You already have an active attempt for this test",
        });
      }

      const test = await Test.findById(req.params.testId).populate({
        path: "questions",
        select: "questionText options marks negativeMarks",
      });

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // ✅ correct creation
      const attempt = await TestAttempt.create({
        user: req.user._id,
        test: test._id,
      });

      res.status(200).json({
        attemptId: attempt._id,
        test,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to start test", err: err.message });
    }
  },
);

// POST /student/tests/:attemptId/submit
// Submit test and calculate score

router.post(
  "/tests/:attemptId/submit",
  auth,
  allowRoles("student"),
  async (req, res) => {
    try {
      const { answers } = req.body;
      // answers = [{ question: ObjectId, selectedOption: "A" }]

      const attempt = await TestAttempt.findOne({
        _id: req.params.attemptId,
        user: req.user._id,
      }).populate("test", "duration");

      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found" });
      }

      if (attempt.status === "submitted") {
        return res.status(400).json({ error: "Test already submitted" });
      }

      // ⏱ Timer validation AFTER attempt check
      const expiry =
        new Date(attempt.startTime).getTime() +
        attempt.test.duration * 60 * 1000;

      if (Date.now() > expiry) {
        attempt.status = "expired";
        attempt.endTime = new Date();
        await attempt.save();

        return res.status(400).json({
          error: "Time expired. Attempt closed.",
        });
      }

      let score = 0;

      for (let ans of answers) {
        const question = await Question.findById(ans.question).select(
          "+correctOption marks negativeMarks",
        );

        if (!question) continue;

        if (question.correctOption === ans.selectedOption) {
          score += question.marks;
        } else {
          score -= question.negativeMarks;
        }

        console.log("Correct Option:", question.correctOption);
        console.log("Selected Option:", ans.selectedOption);
        console.log("Marks:", question.marks);
        console.log("Negative:", question.negativeMarks);
        console.log("------");
      }

      attempt.answers = answers;
      attempt.score = score;
      attempt.status = "submitted";

      await attempt.save();

      res.status(200).json({
        message: "Test submitted successfully",
        score,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to submit test" });
    }
  },
);

// GET /student/results/:attemptId
// View test result

router.get(
  "/results/:attemptId",
  auth,
  allowRoles("student"),
  async (req, res) => {
    try {
      const attempt = await TestAttempt.findOne({
        _id: req.params.attemptId,
        user: req.user._id,
      }).populate("test", "title subject");

      if (!attempt) {
        return res.status(404).json({ error: "Result not found" });
      }

      res.status(200).json(attempt);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch result" });
    }
  },
);

module.exports = router;
