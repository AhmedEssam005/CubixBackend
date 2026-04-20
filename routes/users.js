const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require("../controllers/userController");

// GET /users/:userId
router.get("/getUserProfile/:userId", getUserProfile);

// PUT /users/:userId
router.put("/updateUserProfile/:userId", updateUserProfile);

module.exports = router;
