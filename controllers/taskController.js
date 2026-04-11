const tasks = require("../models/task");

const getTasks = async (req, res, next) => {
	try {
		const { userId, modeId } = req.query;

		const filter = {};
		if (userId) filter.userId = userId;
		if (modeId) filter.modeId = modeId;

		const allTasks = await tasks.find(filter).populate("userId", "name email");

		res.json(allTasks);
	} catch (error) {
		next(error);
	}
};

const createTask = async (req, res, next) => {
	try {
		const { userId, modeId, name, description, duration, mode, priority, startTime, endTime, subtasks } = req.body;

		if (!userId || !name) {
			return res.status(400).json({ message: "UserId and name are required" });
		}

		const newTask = await tasks.create({
			userId,
			modeId,
			name,
			description,
			duration: duration || 30,
			mode: mode || "pomodoro",
			priority: priority || 3,
			status: "pending",
			progress: 0,
			startTime,
			endTime,
			completed: false,
			pointsEarned: 0,
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
		const { name, description, duration, mode, priority, startTime, endTime, status, progress, completed, pointsEarned, subtasks } = req.body;

		const updateData = {};
		if (name) updateData.name = name;
		if (description) updateData.description = description;
		if (duration) updateData.duration = duration;
		if (mode) updateData.mode = mode;
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
			{ new: true }
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
	getTasks,
	createTask,
	updateTask,
	deleteTask,
	completeTask,
};
