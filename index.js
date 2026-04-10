const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

/////////////////////////////////////////////////////////////
// Api Url: https://cubixbackend-production.up.railway.app/
/////////////////////////////////////////////////////////////

app.post("/login", async (req, res) => {
	try {
		const { userEmail, userPassword } = req.body;

		const user = await users.findOne({ email: userEmail });
		if (!user) {
			return res.json({ message: "Email Does Not Exist" });
		}

		const isMatch = await bcrypt.compare(userPassword, user.password);

		if (!isMatch) {
			return res.json({ message: "Password Isn`t Correct" });
		}

		res.json({
			name: user.name,
			age: user.age,
			profileImage: user.profileImage,
			theme: user.theme,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post("/signUp", async (req, res) => {
	try {
		const { userEmail, userPassword, userName, userAge } = req.body;

		const alreadyExist = await users.findOne({ email: userEmail });
		if (alreadyExist) {
			return res.json({ message: "Email Already Exists" });
		}

		const hashedPassword = await bcrypt.hash(userPassword, 10);

		await users.create({
			email: userEmail,
			password: hashedPassword,
			name: userName,
			age: userAge,
		});

		res.json({ message: "sucess" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/getUserModes", async (req, res) => {
	try {
		const userEmail = req.query.email;
		const userPlatform = req.query.platform;
		const userID = await users.findOne({ email: userEmail }).select("_id");

		if (!userID) {
			return res.json({ message: "This User Does Not Exists" });
		}

		const allModes = await modes.find({
			userId: userID,
			platform: userPlatform,
		});

		res.json(allModes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/getUserTasks", async (req, res) => {
	try {
		const userEmail = req.query.email;

		const userID = await users.findOne({ email: userEmail }).select("_id");

		if (!userID) {
			return res.json({ message: "This User Does Not Exists" });
		}

		const allTasks = await tasks.find({ userId: userID });

		res.send(allTasks);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/////////////////////////////////////////////////////////////

app.get("/getAllTasks", async (req, res) => {
	try {
		const allTasks = await tasks.find();
		res.json(allTasks);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/getAllUsers", async (req, res) => {
	try {
		const allUsers = await users.find();
		res.json(allUsers);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});
