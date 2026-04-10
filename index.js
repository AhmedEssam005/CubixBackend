const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
const users = require("./models/user");
const tasks = require("./models/task");
const modes = require("./models/modes");
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("Database Connented Succesfuly");
		app.listen(process.env.PORT, () => {
			console.log("Running\n");
		});
	})
	.catch((error) => {
		console.log("Error Connceting Database", error);
	});
app.get("/getAllUsers", async (req, res) => {
	try {
		const allUsers = await users.find();
		res.json(allUsers);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/getAllModes", async (req, res) => {
	try {
		const allModes = await modes.find();
		res.json(allModes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/getAllTasks", async (req, res) => {
	try {
		const allTasks = await tasks.find();
		res.json(allTasks);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});
