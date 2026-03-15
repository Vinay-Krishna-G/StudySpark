const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");
const upload = require("../middlewares/upload");
const fs = require("fs");
const csv = require("csv-parser");

const Flashcard = require("../models/Flashcard");
const Report = require("../models/Report");

const router = express.Router();

/**
 * POST /instructor/flashcards/upload-csv
 * Bulk upload flashcards
 */
router.post(
  "/flashcards/upload-csv",
  auth,
  allowRoles("instructor", "admin"),
  upload.single("file"),
  async (req, res) => {
    try {
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

            const flashcardsToInsert = results
              .map((row) => {
                const cleanedRow = {};
                Object.keys(row).forEach((key) => {
                  cleanedRow[cleanKey(key)] = row[key];
                });

                if (!cleanedRow.quote) return null;

                return {
                  quote: cleanedRow.quote?.trim(),
                  subject: cleanedRow.subject?.trim(),
                  chapter: cleanedRow.chapter?.trim(),
                  difficulty: cleanedRow.difficulty?.trim() || "medium",
                  createdBy: req.user._id,
                };
              })
              .filter((card) => card && card.quote && card.subject);

            if (!flashcardsToInsert.length) {
              return res.status(400).json({
                error: "No valid flashcards found in CSV (Need 'quote' and 'subject')",
              });
            }

            const inserted = await Flashcard.insertMany(flashcardsToInsert);

            fs.unlinkSync(req.file.path);

            res.json({
              message: "Flashcards uploaded successfully",
              count: inserted.length,
            });
          } catch (err) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            res.status(500).json({
              error: "Insert failed",
              err: err.message,
            });
          }
        });
    } catch (err) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(500).json({
        error: "Upload failed",
        err: err.message,
      });
    }
  }
);

/**
 * GET /instructor/reports
 * View all reports for questions created by this instructor
 */
router.get(
  "/reports",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      // Find reports where the associated question was created by this user
      // Alternatively, just return all reports for simplicity if admin
      
      const reports = await Report.find()
        .populate({
          path: "question",
          match: req.user.role !== "admin" ? { createdBy: req.user._id } : {}, // If admin see all, else see own
          select: "questionText subject correctOption options",
        })
        .populate("reportedBy", "firstName lastName email")
        .sort({ createdAt: -1 });
        
      // Filter out null questions (where match failed because instructor didn't create it)
      const validReports = reports.filter(r => r.question != null);

      res.status(200).json(validReports);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  }
);

/**
 * PATCH /instructor/reports/:reportId/status
 * Update report status (e.g. resolve it)
 */
router.patch(
  "/reports/:reportId/status",
  auth,
  allowRoles("instructor", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await Report.findByIdAndUpdate(req.params.reportId, { status });
      res.json({ message: "Report status updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update report status" });
    }
  }
);

module.exports = router;
