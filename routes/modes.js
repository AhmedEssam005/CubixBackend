const express = require("express");
const router = express.Router();
const {
	getUserModes,
	createMode,
	updateMode,
} = require("../controllers/modeController");

// GET /modes - Get user modes by email and platform
router.get("/getUserModes", getUserModes);

// POST /modes - Create new mode
router.post("/createMode", createMode);

// PUT /modes/:modeId - Update mode
router.put("/updateMode/:modeId", updateMode);

module.exports = router;
