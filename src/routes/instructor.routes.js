const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const Test = require("../models/Test");
const Question = require("../models/question");

const upload = require("../middlewares/upload");
const fs = require("fs");
const csv = require("csv-parser");

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
  },
);

/**
 * POST /instructor/quizzes/:testId/questions
 * Add single question to test
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
        explanation,
        marks,
        negativeMarks,
        subject,
        chapter,
        topic,
        difficulty,
        examYear,
        isPYQ,
        isRepeated,
        importance,
      } = req.body;

      const test = await Test.findById(req.params.testId);

      // check test exists
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // ownership check
      if (test.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          error: "You are not allowed to modify this test",
        });
      }

      // create question (NO testId now)
      const question = await Question.create({
        questionText,
        options,
        correctOption,
        explanation,
        marks,
        negativeMarks,
        subject,
        chapter,
        topic,
        difficulty,
        examYear,
        isPYQ,
        isRepeated,
        importance,
        createdBy: req.user._id,
      });

      // link to test
      test.questions.push(question._id);
      test.totalMarks += marks || 1;

      await test.save();

      res.status(201).json({
        message: "Question added successfully",
        questionId: question._id,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to add question", err: err.message });
    }
  },
);

/**
 * POST /instructor/quizzes/:testId/upload-csv
 * Bulk upload questions
 */
router.post(
  "/quizzes/:testId/upload-csv",
  auth,
  allowRoles("instructor", "admin"),
  upload.single("file"),
  async (req, res) => {
    try {
      const test = await Test.findById(req.params.testId);

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      if (test.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized test" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "CSV file required" });
      }

      const results = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            const questionsToInsert = results.map((row) => ({
              questionText: row.questionText,

              options: {
                A: row.optionA,
                B: row.optionB,
                C: row.optionC,
                D: row.optionD,
              },

              correctOption: row.correctOption,
              explanation: row.explanation,

              marks: Number(row.marks) || 1,
              negativeMarks: Number(row.negativeMarks) || 0,

              subject: row.subject,
              chapter: row.chapter,
              topic: row.topic,

              difficulty: row.difficulty || "medium",

              examYear: row.examYear ? Number(row.examYear) : undefined,
              isPYQ: row.isPYQ === "true",
              isRepeated: row.isRepeated === "true",
              importance: row.importance || "medium",

              createdBy: req.user._id,
            }));

            const insertedQuestions =
              await Question.insertMany(questionsToInsert);

            const ids = insertedQuestions.map((q) => q._id);
            test.questions.push(...ids);

            const addedMarks = insertedQuestions.reduce(
              (sum, q) => sum + (q.marks || 1),
              0,
            );

            test.totalMarks += addedMarks;
            await test.save();

            fs.unlinkSync(req.file.path);

            res.json({
              message: "CSV uploaded successfully",
              count: insertedQuestions.length,
            });
          } catch (err) {
            res.status(500).json({ error: "Insert failed", err: err.message });
          }
        });
    } catch (err) {
      res.status(500).json({ error: "Upload failed", err: err.message });
    }
  },
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
      const quizzes = await Test.find({ createdBy: req.user._id }).select(
        "title subject category duration totalMarks",
      );

      res.status(200).json(quizzes);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  },
);

/**
 * DELETE /instructor/quizzes/:testId
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

      res.status(200).json({
        message: "Test deleted successfully",
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete test" });
    }
  },
);

module.exports = router;
