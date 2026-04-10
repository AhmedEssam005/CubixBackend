const express = require("express");
const app = express();
app.use(express.json());
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

		cubeFace: {
			type: Number,
			min: 1,
			max: 5,
		},

		blockedList: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Mode", modeSchema);
