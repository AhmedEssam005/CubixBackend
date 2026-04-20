const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		age: { type: Number, required: true },
		email: { type: String, required: true,unique: true },
		password: { type: String, required: true },
		profileImage: { type: String },
		theme: { type: String, required: true, default: "light" },
	},
	{ timestamps: true },
);
module.exports = mongoose.model("users", userSchema);
