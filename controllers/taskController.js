const tasks = require("../models/task");
const users = require("../models/user");
const modes = require("../models/modes");

const getUserTasks = async (req, res, next) => {
	try {
		const { userEmail } = req.query;
		if (!userEmail) {
			return res.status(400).json({ message: "User email is required" });
		}

		const userID = await users.findOne({ email: userEmail }).select("_id");
		if (!userID) {
			return res.status(404).json({ message: "User not found" });
		}
		const allTasks = await tasks
			.find({ userId: userID._id })
			.populate("modeId")
			.populate("userId", "name")
			.sort({ date: -1 });
		res.json(allTasks);
	} catch (error) {
		next(error);
	}
};

const createTask = async (req, res, next) => {
	try {
		const {
			userId,
			modeId,
			name,
			description,
			duration,
			priority,
			startTime,
			endTime,
			subtasks,
		} = req.body;

		if (!userId || !modeId || !name) {
			return res.status(400).json({
				message: "userId, modeId and name are required",
			});
		}

		const newTask = await tasks.create({
			userId,
			modeId,
			name,
			description,
			duration: duration || 30,
			priority: priority || 3,
			startTime,
			endTime,
			subtasks: subtasks || [],
		});

		res.status(201).json(newTask);
	} catch (error) {
		next(error);
	}
};

const updateTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const {
			name,
			description,
			duration,
			mode,
			priority,
			startTime,
			endTime,
			status,
			progress,
			completed,
			pointsEarned,
			subtasks,
		} = req.body;

		const updateData = {};
		if (name) updateData.name = name;
		if (description) updateData.description = description;
		if (duration) updateData.duration = duration;
		if (priority) updateData.priority = priority;
		if (startTime) updateData.startTime = startTime;
		if (endTime) updateData.endTime = endTime;
		if (status) updateData.status = status;
		if (progress !== undefined) updateData.progress = progress;
		if (typeof completed === "boolean") updateData.completed = completed;
		if (pointsEarned !== undefined) updateData.pointsEarned = pointsEarned;
		if (subtasks) updateData.subtasks = subtasks;

		const updatedTask = await tasks.findByIdAndUpdate(taskId, updateData, {
			new: true,
		});

		if (!updatedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.json(updatedTask);
	} catch (error) {
		next(error);
	}
};

const deleteTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;

		const deletedTask = await tasks.findByIdAndDelete(taskId);
		if (!deletedTask) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.json({ message: "Task deleted successfully" });
	} catch (error) {
		next(error);
	}
};

// ==========================================
// ANALYTICS & DASHBOARD
// ==========================================

const getSummaryStats = async (req, res, next) => {
	try {
		const { userId } = req.query;
		if (!userId) {
			return res.status(400).json({ message: "userId is required" });
		}

		const stats = await tasks.aggregate([
			{ $match: { userId: new mongoose.Types.ObjectId(userId) } },
			{
				$group: {
					_id: null,
					totalPoints: { $sum: "$pointsEarned" },
					totalTasks: { $sum: 1 },
					completedTasks: {
						$sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
					},
				},
			},
		]);

		const result = stats[0] || {
			totalPoints: 0,
			totalTasks: 0,
			completedTasks: 0,
		};
		const efficiency =
			result.totalTasks === 0
				? 0
				: Math.round((result.completedTasks / result.totalTasks) * 100);

		res.json({
			totalPoints: result.totalPoints,
			efficiency: `${efficiency}%`,
			completedTasks: result.completedTasks,
		});
	} catch (error) {
		next(error);
	}
};

const getHeatmap = async (req, res, next) => {
	try {
		const { userId } = req.query;
		if (!userId) {
			return res.status(400).json({ message: "userId is required" });
		}

		const heatmap = await tasks.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
					status: "completed",
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		res.json(heatmap.map((item) => ({ date: item._id, count: item.count })));
	} catch (error) {
		next(error);
	}
};

// ==========================================
// TASK EXECUTION (STATE MACHINE)
// ==========================================

const startTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;

		// Fetch the task first to ensure it exists and get the userId
		const taskToStart = await tasks.findById(taskId);
		if (!taskToStart) {
			return res.status(404).json({ message: "Task not found" });
		}

		// Auto-pause any currently active tasks for this specific user
		await tasks.updateMany(
			{ userId: taskToStart.userId, status: "active" },
			{ $status: "pending" },
		);

		// Start the target task
		const updatedTask = await tasks.findByIdAndUpdate(
			taskId,
			{ status: "active", startTime: new Date() },
			{ new: true },
		);

		res.json(updatedTask);
	} catch (error) {
		next(error);
	}
};

const pauseTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;

		const updatedTask = await tasks.findByIdAndUpdate(
			taskId,
			{ status: "pending" },
			{ new: true },
		);

		if (!updatedTask) {
			return res.status(404).json({ message: "Task not found" });
		}

		res.json(updatedTask);
	} catch (error) {
		next(error);
	}
};

// Replace your existing completeTask with this enhanced version
const completeTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { pointsEarned } = req.body;

		// We need to fetch the task first to read its priority if points aren't manually passed
		const task = await tasks.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		// Use passed points, or calculate dynamically (Priority 3 = 30 points)
		const earned =
			pointsEarned !== undefined ? pointsEarned : task.priority * 10;

		const updatedTask = await tasks.findByIdAndUpdate(
			taskId,
			{
				status: "completed",
				completed: true,
				endTime: new Date(),
				progress: 100, // Max out the progress bar
				pointsEarned: earned,
			},
			{ new: true },
		);

		res.json(updatedTask);
	} catch (error) {
		next(error);
	}
};

// ==========================================
// SUBTASKS
// ==========================================

const toggleSubtask = async (req, res, next) => {
	try {
		const { taskId, subtaskId } = req.params;
		const { completed } = req.body;

		if (typeof completed !== "boolean") {
			return res.status(400).json({ message: "completed boolean is required" });
		}

		const updatedTask = await tasks.findOneAndUpdate(
			{ _id: taskId, "subtasks._id": subtaskId },
			{ $set: { "subtasks.$.completed": completed } },
			{ new: true },
		);

		if (!updatedTask) {
			return res.status(404).json({ message: "Task or subtask not found" });
		}

		res.json(updatedTask);
	} catch (error) {
		next(error);
	}
};

// ==========================================
// TIMELINE
// ==========================================

const getTimeline = async (req, res, next) => {
	try {
		const { userId, date } = req.query;

		if (!userId) {
			return res.status(400).json({ message: "userId is required" });
		}

		// Default to today if no date query is provided
		const targetDate = date ? new Date(date) : new Date();
		
		// Create start and end of the day for database querying
		const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
		const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

		const timelineTasks = await tasks.find({
			userId: userId, 
			date: { $gte: startOfDay, $lte: endOfDay }
		})
		.populate("modeId", "name color icon") // Joins the mode data to the task
		.sort({ startTime: 1, date: 1 }); // Sort chronologically for the timeline view

		res.json(timelineTasks);
	} catch (error) {
		next(error);
	}
};

module.exports = {
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
};
