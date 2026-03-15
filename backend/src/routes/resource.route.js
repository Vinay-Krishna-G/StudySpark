const express = require("express");
const path = require("path");
const fs = require("fs");

const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");
const uploadPDF = require("../middlewares/resourceUpload");

const Resource = require("../models/Resources");

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

/**
 * GET /resources
 * Get all available resources
 */
router.get("/", auth, async (req, res) => {
  try {
    const { subject, chapter } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (chapter) filter.chapter = chapter;

    if (req.user.role === "student") {
      // Students only see non-premium, or premium if they are in allowedUsers
      filter.$or = [
        { isPremium: false },
        { allowedUsers: req.user._id }
      ];
    } else if (req.user.role === "instructor") {
      // Instructor only sees their own uploads
      filter.createdBy = req.user._id;
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

/**
 * DELETE /resources/:id
 * Instructor/Admin deletes a resource
 */
router.delete("/:id", auth, allowRoles("instructor", "admin"), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Checking ownership if not admin
    if (req.user.role !== "admin" && resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own resources." });
    }

    if (fs.existsSync(resource.filePath)) {
      fs.unlinkSync(resource.filePath); // Remove file from server
    }
    
    await resource.deleteOne();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

module.exports = router;