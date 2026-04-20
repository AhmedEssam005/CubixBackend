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

const completeTask = async (req, res, next) => {
	try {
		const { taskId } = req.params;
		const { pointsEarned } = req.body;

		const updatedTask = await tasks.findByIdAndUpdate(
			taskId,
			{
				completed: true,
				pointsEarned: pointsEarned || 10,
			},
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

module.exports = {
	getUserTasks,
	createTask,
	updateTask,
	deleteTask,
	completeTask,
};
