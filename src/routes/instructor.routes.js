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
      res.status(500).json({ error: "Failed to create test" + err.message });
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
      res
        .status(500)
        .json({ error: "Failed to add question", err: err.message });
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
            const cleanKey = (key) => key.replace(/"/g, "").trim();

            const questionsToInsert = results
              .map((row) => {
                const cleanedRow = {};
                Object.keys(row).forEach((key) => {
                  cleanedRow[cleanKey(key)] = row[key];
                });

                if (!cleanedRow.questionText) return null;

                return {
                  questionText: cleanedRow.questionText?.trim(),

                  options: {
                    A: cleanedRow.optionA?.trim(),
                    B: cleanedRow.optionB?.trim(),
                    C: cleanedRow.optionC?.trim(),
                    D: cleanedRow.optionD?.trim(),
                  },

                  correctOption: cleanedRow.correctOption?.trim(),
                  explanation: cleanedRow.explanation?.trim(),

                  marks: Number(cleanedRow.marks) || 1,
                  negativeMarks: Number(cleanedRow.negativeMarks) || 0,

                  subject: cleanedRow.subject?.trim(),
                  chapter: cleanedRow.chapter?.trim(),
                  topic: cleanedRow.topic?.trim(),

                  difficulty: cleanedRow.difficulty?.trim() || "medium",

                  examYear: cleanedRow.examYear
                    ? Number(cleanedRow.examYear)
                    : undefined,

                  isPYQ: cleanedRow.isPYQ === "true",
                  isRepeated: cleanedRow.isRepeated === "true",

                  importance: cleanedRow.importance?.trim() || "medium",

                  createdBy: req.user._id,
                };
              })
              .filter(Boolean);

            if (!questionsToInsert.length) {
              return res.status(400).json({
                error: "No valid questions found in CSV",
              });
            }

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
            res.status(500).json({
              error: "Insert failed",
              err: err.message,
            });
          }
        });
    } catch (err) {
      res.status(500).json({
        error: "Upload failed",
        err: err.message,
      });
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

/**
 * GET /instructor/questions
 * Filter questions from question bank
 */
router.get(
  "/questions",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const { subject, chapter, topic, difficulty, isPYQ, importance } =
        req.query;

      const filter = {
        createdBy: req.user._id, // only show instructor's questions
      };

      if (subject) filter.subject = subject;
      if (chapter) filter.chapter = chapter;
      if (topic) filter.topic = topic;
      if (difficulty) filter.difficulty = difficulty;
      if (importance) filter.importance = importance;
      if (isPYQ !== undefined) filter.isPYQ = isPYQ === "true";

      const questions = await Question.find(filter).select(
        "-correctOption -explanation",
      );

      res.json({
        count: questions.length,
        questions,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to fetch questions",
      });
    }
  },
);

/**
 * POST /instructor/quizzes/:testId/generate
 * Auto-generate test from question bank
 */
router.post(
  "/quizzes/:testId/generate",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const { subject, chapter, difficulty, count } = req.body;

      const test = await Test.findById(req.params.testId);

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      if (test.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized test" });
      }

      const filter = {
        createdBy: req.user._id,
      };

      if (subject) filter.subject = subject;
      if (chapter) filter.chapter = chapter;
      if (difficulty) filter.difficulty = difficulty;

      const questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: Number(count) || 5 } },
      ]);

      if (!questions.length) {
        return res.status(400).json({
          error: "Not enough questions available",
        });
      }

      const ids = questions.map((q) => q._id);
      test.questions.push(...ids);

      const addedMarks = questions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0
      );

      test.totalMarks += addedMarks;

      await test.save();

      res.json({
        message: "Test generated successfully",
        addedQuestions: questions.length,
      });
    } catch (err) {
      res.status(500).json({
        error: "Generation failed",
        details: err.message,
      });
    }
  }
);

module.exports = router;
