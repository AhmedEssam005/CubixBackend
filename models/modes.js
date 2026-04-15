const mongoose = require("mongoose");

const modeSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},

		platform: {
			type: String,
		},

		name: {
			type: String,
			required: true,
		},

		description: {
			type: String,
		},

		cubeFace: {
			type: Number,
			min: 1,
			max: 5,
		},

		color: {
			type: String,
			default: "#6366f1",
		},

		icon: {
			type: String,
		},

		energyLevel: {
			type: String,
			enum: ["low", "medium", "high", "very-high"],
		},

		focusRequired: {
			type: Boolean,
			default: false,
		},

		category: {
			type: String,
			enum: ["work", "break", "communication", "learning"],
		},

		blockedApps: {
			type: [String],
			default: [],
		},

		blockedWebsites: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Mode", modeSchema);
