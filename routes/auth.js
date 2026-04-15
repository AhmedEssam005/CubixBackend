const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/authController");

// POST /auth/login
router.post("/login", login);

// POST /auth/signUp
router.post("/signUp", signUp);

module.exports = router;
