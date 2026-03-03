const express = require("express");
const path = require("path");
const fs = require("fs");

const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");
const uploadPDF = require("../middlewares/resourceUpload");

const Resource = require("../models/Resource");

const router = express.Router();

/**
 * POST /resources/upload
 * Instructor uploads PDF
 */
router.post(
  "/upload",
  auth,
  allowRoles("instructor", "admin"),
  uploadPDF.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "PDF file required" });
      }

      const { title, subject, chapter, isPremium } = req.body;

      const resource = await Resource.create({
        title,
        subject,
        chapter,
        filePath: req.file.path,
        isPremium: isPremium === "true",
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: "Resource uploaded successfully",
        resourceId: resource._id,
      });
    } catch (err) {
      res.status(500).json({
        error: "Upload failed",
        details: err.message,
      });
    }
  }
);

/**
 * GET /resources/:id/view
 * Secure PDF streaming
 */
router.get("/:id/view", auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // 🔐 Premium check
    if (resource.isPremium) {
      const allowed =
        resource.allowedUsers.includes(req.user._id);

      if (!allowed && req.user.role !== "admin") {
        return res.status(403).json({
          error: "Premium resource. Access denied.",
        });
      }
    }

    if (!fs.existsSync(resource.filePath)) {
      return res.status(404).json({
        error: "File not found on server",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline"); // Not attachment

    const fileStream = fs.createReadStream(
      path.resolve(resource.filePath)
    );

    fileStream.pipe(res);
  } catch (err) {
    res.status(500).json({
      error: "Failed to load resource",
    });
  }
});

module.exports = router;