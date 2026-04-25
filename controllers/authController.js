const bcrypt = require("bcryptjs");
const users = require("../models/user");
const {
	validateLoginInput,
	validateSignUpInput,
} = require("../utils/validators");

const login = async (req, res, next) => {
	try {
		const { userEmail, userPassword } = req.body;

		// Validate input
		const validation = validateLoginInput(userEmail, userPassword);
		if (!validation.valid) {
			return res.status(400).json({ message: validation.message });
		}

		const user = await users.findOne({ email: userEmail });
		if (!user) {
			return res.status(401).json({ message: "Email Does Not Exist" });
		}

		const isMatch = await bcrypt.compare(userPassword, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Password Isn't Correct" });
		}

		res.json({
			id: user._id,
			name: user.name,
			age: user.age,
			email: user.email,
			profileImage: user.profileImage,
			theme: user.theme,
		});
	} catch (error) {
		next(error);
	}
};

const signUp = async (req, res, next) => {
	try {
		const { userEmail, userPassword, userName, userAge } = req.body;

		// Validate input
		const validation = validateSignUpInput(
			userEmail,
			userPassword,
			userName,
			userAge,
		);
		if (!validation.valid) {
			return res.status(400).json({ message: validation.message });
		}

		const alreadyExist = await users.findOne({ email: userEmail });
		if (alreadyExist) {
			return res.status(409).json({ message: "Email Already Exists" });
		}

		const hashedPassword = await bcrypt.hash(userPassword, 10);
		const { seedInitialModes } = require("./modeController");

		const newUser = await users.create({
			email: userEmail,
			password: hashedPassword,
			name: userName,
			age: userAge,
			theme: "light",
			mobileModes: null,
			desktopModes: null,
		});

		// Seed modes for both platforms immediately
		await seedInitialModes(newUser._id, "mobile");
		await seedInitialModes(newUser._id, "desktop");

		res.status(201).json({
			message: "Account created successfully",
			id: newUser._id,
			email: newUser.email,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	login,
	signUp,
};
