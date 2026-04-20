const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},

		modeId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Mode",
			required: true,
		},

		name: { type: String, required: true },
		description: String,

		date: { type: Date, default: Date.now },

		duration: {
			type: Number,
			default: 30,
		},

		priority: {
			type: Number,
			min: 1,
			max: 5,
			default: 3,
		},

		status: {
			type: String,
			enum: ["pending", "active", "completed", "cancelled"],
			default: "pending",
		},

		progress: {
			type: Number,
			min: 0,
			max: 100,
			default: 0,
		},

		startTime: Date,
		endTime: Date,

		completed: { type: Boolean, default: false },

		pointsEarned: { type: Number, default: 0 },

		subtasks: [
			{
				id: String,
				name: String,
				completed: { type: Boolean, default: false },
			},
		],
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
