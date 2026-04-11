const users = require("../models/user");

const getUserProfile = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const user = await users.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		next(error);
	}
};

const updateUserProfile = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { name, age, profileImage, theme } = req.body;

		const updateData = {};
		if (name) updateData.name = name;
		if (age) updateData.age = age;
		if (profileImage) updateData.profileImage = profileImage;
		if (theme) updateData.theme = theme;

		const updatedUser = await users.findByIdAndUpdate(userId, updateData, {
			new: true,
		}).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(updatedUser);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUserProfile,
	updateUserProfile,
};
