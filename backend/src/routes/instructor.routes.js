const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const { body, validationResult } = require("express-validator");

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

  // 🔥 Validation rules
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("duration")
      .isInt({ min: 1 })
      .withMessage("Duration must be positive number"),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, subject, category, duration, testType, difficulty } = req.body;

      const test = await Test.create({
        title,
        subject,
        category,
        duration,
        testType: testType || 'chapter-wise',
        difficulty: difficulty || 'mixed',
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

      if (!questionText || !options || !correctOption || !subject) {
        return res.status(400).json({
          error: "Required fields missing",
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
      if (!test.questions.includes(question._id)) {
        test.questions.push(question._id);
      }
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

            if (req.body.limits) {
              try {
                const limits = JSON.parse(req.body.limits);
                const counts = { maths: 0, physics: 0, chemistry: 0, biology: 0 };
                
                // Shuffle array so we don't always pick the first questions
                for (let i = questionsToInsert.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [questionsToInsert[i], questionsToInsert[j]] = [questionsToInsert[j], questionsToInsert[i]];
                }

                questionsToInsert = questionsToInsert.filter(q => {
                   const sub = q.subject?.toLowerCase();
                   if (!sub || !limits[sub] || limits[sub] <= 0) return true; // Keep if no limit or not tracked subject
                   if (counts[sub] < parseInt(limits[sub], 10)) {
                     counts[sub]++;
                     return true;
                   }
                   return false;
                });
              } catch (e) {
                console.warn('Failed to parse limits', e);
              }
            }

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
 * GET /instructor/quizzes/:testId/questions
 * Get specific test with all its questions populated
 */
router.get(
  "/quizzes/:testId/questions",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const test = await Test.findById(req.params.testId).populate("questions");

      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }

      // Check ownership or admin
      if (req.user.role !== "admin" && test.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized access to this test" });
      }

      res.status(200).json(test);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch test questions" });
    }
  }
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
      console.error("Test Deletion Error:", err);
      res.status(500).json({ error: "Failed to delete test", details: err.message });
    }
  },
);

/**
 * GET /instructor/questions
 * Filter + Pagination
 */
router.get(
  "/questions",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const {
        subject,
        chapter,
        topic,
        difficulty,
        isPYQ,
        importance,
        page = 1,
        limit = 10,
      } = req.query;

      const filter = {
        createdBy: req.user._id,
      };

      if (subject) filter.subject = subject;
      if (chapter) filter.chapter = chapter;
      if (topic) filter.topic = topic;
      if (difficulty) filter.difficulty = difficulty;
      if (importance) filter.importance = importance;
      if (isPYQ !== undefined) filter.isPYQ = isPYQ === "true";

      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const total = await Question.countDocuments(filter);

      const questions = await Question.find(filter)
        .select("-correctOption -explanation")
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 });

      res.json({
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
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
 * Auto-generate test without duplicates
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

      const availableQuestions = await Question.aggregate([
        {
          $match: {
            ...filter,
            _id: { $nin: test.questions }, // 🔥 prevent duplicates
          },
        },
        {
          $sample: { size: Number(count) || 5 },
        },
      ]);

      if (!availableQuestions.length) {
        return res.status(400).json({
          error: "No more unique questions available for this filter",
        });
      }

      const ids = availableQuestions.map((q) => q._id);

      test.questions.push(...ids);

      const addedMarks = availableQuestions.reduce(
        (sum, q) => sum + (q.marks || 1),
        0,
      );

      test.totalMarks += addedMarks;

      await test.save();

      res.json({
        message: "Test generated successfully",
        addedQuestions: availableQuestions.length,
        remainingPool: "Unique questions only were added",
      });
    } catch (err) {
      res.status(500).json({
        error: "Generation failed",
        details: err.message,
      });
    }
  },
);

/**
 * PUT /instructor/questions/:questionId
 * Edit question
 */
router.put(
  "/questions/:questionId",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      // Ownership check
      if (question.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          error: "You are not allowed to edit this question",
        });
      }

      const allowedUpdates = [
        "questionText",
        "options",
        "correctOption",
        "explanation",
        "marks",
        "negativeMarks",
        "subject",
        "chapter",
        "topic",
        "difficulty",
        "examYear",
        "isPYQ",
        "isRepeated",
        "importance",
      ];

      allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) {
          question[field] = req.body[field];
        }
      });

      await question.save();

      res.json({
        message: "Question updated successfully",
        question,
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to update question",
        details: err.message,
      });
    }
  },
);

/**
 * DELETE /instructor/questions/:questionId
 * Delete question safely
 */
router.delete(
  "/questions/:questionId",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const question = await Question.findById(req.params.questionId);

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      // Ownership check
      if (question.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          error: "You are not allowed to delete this question",
        });
      }

      // Remove question from all tests
      await Test.updateMany(
        { questions: question._id },
        { $pull: { questions: question._id } },
      );

      // Delete question
      await question.deleteOne();

      res.json({
        message: "Question deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to delete question",
        details: err.message,
      });
    }
  },
);

module.exports = router;
