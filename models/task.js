const express = require("express");
const app = express();
app.use(express.json());
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

		priority: {
			type: String,
			default: "medium",
		},

		startTime: Date,
		endTime: Date,

		completed: { type: Boolean, default: false },

		pointsEarned: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
