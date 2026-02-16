const express = require("express");
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/role");

const router = express.Router();

/**
 * GET /student/profile
 * View own profile
 */
router.get(
  "/profile",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.status(200).json({
      message: "Student profile",
      user: req.user,
    });
  }
);

/**
 * GET /student/tests
 * View available mock tests
 */
router.get(
  "/tests",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.json({
      message: "List of available tests",
    });
  }
);

/**
 * POST /student/tests/:id/start
 * Start a test
 */
router.post(
  "/tests/:id/start",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.json({
      message: `Started test ${req.params.id}`,
    });
  }
);

/**
 * POST /student/tests/:id/submit
 * Submit test answers
 */
router.post(
  "/tests/:id/submit",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.json({
      message: `Submitted test ${req.params.id}`,
    });
  }
);

/**
 * GET /student/results/:id
 * View result of a test
 */
router.get(
  "/results/:id",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.json({
      message: `Result for test ${req.params.id}`,
    });
  }
);

/**
 * GET /student/resources
 * View learning resources
 */
router.get(
  "/resources",
  auth,
  allowRoles("student"),
  (req, res) => {
    res.json({
      message: "Learning resources list",
    });
  }
);

module.exports = router;
