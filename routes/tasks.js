const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, completeTask } = require("../controllers/taskController");

// GET /tasks - Get all or filtered tasks
router.get("/", getTasks);

// POST /tasks - Create new task
router.post("/", createTask);

// PUT /tasks/:taskId/complete - Mark task as complete
router.put("/:taskId/complete", completeTask);

// PUT /tasks/:taskId - Update task
router.put("/:taskId", updateTask);

// DELETE /tasks/:taskId - Delete task
router.delete("/:taskId", deleteTask);

module.exports = router;
