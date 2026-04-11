const express = require("express");
const router = express.Router();
const { getUserModes, createMode, updateMode, deleteMode } = require("../controllers/modeController");

// GET /modes - Get user modes by email and platform
router.get("/", getUserModes);

// POST /modes - Create new mode
router.post("/", createMode);

// PUT /modes/:modeId - Update mode
router.put("/:modeId", updateMode);

// DELETE /modes/:modeId - Delete mode
router.delete("/:modeId", deleteMode);

module.exports = router;
