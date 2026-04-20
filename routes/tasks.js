const express = require("express");
const router = express.Router();
const {
	getUserTasks,
	createTask,
	updateTask,
	deleteTask,
	completeTask,
} = require("../controllers/taskController");

// GET /tasks - Get all or filtered tasks
router.get("/getUserTasks", getUserTasks);

// POST /tasks - Create new task
router.post("/createTask", createTask);

// PUT /tasks/:taskId/complete - Mark task as complete
router.put("/completeTask/:taskId", completeTask);

// PUT /tasks/:taskId - Update task
router.put("/updateTask/:taskId", updateTask);

// DELETE /tasks/:taskId - Delete task
router.delete("/deleteTask/:taskId", deleteTask);

module.exports = router;
