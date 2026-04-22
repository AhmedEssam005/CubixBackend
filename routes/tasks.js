const express = require("express");
const router = express.Router();
const {
	getUserTasks,
	createTask,
	updateTask,
	deleteTask,
	completeTask,
	startTask,
	pauseTask,
	getSummaryStats,
	getHeatmap,
	toggleSubtask,
	getTimeline,
} = require("../controllers/taskController");

router.get("/getUserTasks", getUserTasks);

router.post("/createTask", createTask);

router.put("/completeTask/:taskId", completeTask);

router.put("/updateTask/:taskId", updateTask);

router.delete("/deleteTask/:taskId", deleteTask);

// PUT /tasks/startTask/:taskId - Start a task
router.put("/startTask/:taskId", startTask);

// PUT /tasks/pauseTask/:taskId - Pause a task
router.put("/pauseTask/:taskId", pauseTask);

// GET /tasks/summary - Get summary stats for a user
router.get("/summary", getSummaryStats);    

// GET /tasks/heatmap - Get heatmap data for a user
router.get("/heatmap", getHeatmap);

// PUT /tasks/:taskId/subtasks/:subtaskId - Toggle subtask completion
router.put("/:taskId/subtasks/:subtaskId", toggleSubtask);

router.get("/timeline", getTimeline);

module.exports = router;
