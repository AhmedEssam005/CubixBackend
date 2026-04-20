const modes = require("../models/modes");
const users = require("../models/user");

const getUserModes = async (req, res, next) => {
	try {
		const { email, platform } = req.query;

		if (!email || !platform) {
			return res
				.status(400)
				.json({ message: "Email and platform are required" });
		}

		const user = await users.findOne({ email }).select("_id");
		if (!user) {
			return res.status(404).json({ message: "This User Does Not Exist" });
		}

		const allModes = await modes
			.find({
				userId: user._id,
				platform: platform,
			})
			.populate("userId", "name")
			.sort({ createdAt: -1 });

		res.json(allModes);
	} catch (error) {
		next(error);
	}
};

const createMode = async (req, res, next) => {
	try {
		const {
			userId,
			platform,
			name,
			description,
			color,
			icon,
			energyLevel,
			focusRequired,
			category,
			blockedApps,
			blockedWebsites,
			cubeFace,
		} = req.body;

		if (!userId || !platform || !name) {
			return res
				.status(400)
				.json({ message: "UserId, platform, and name are required" });
		}

		const newMode = await modes.create({
			userId,
			platform,
			name,
			description: description || "",
			color: color || "#6366f1",
			icon: icon || "",
			energyLevel: energyLevel || "medium",
			focusRequired: focusRequired || false,
			category: category || "work",
			blockedApps: blockedApps || [],
			blockedWebsites: blockedWebsites || [],
			cubeFace: cubeFace || 1,
		});

		res.status(201).json(newMode);
	} catch (error) {
		next(error);
	}
};

const updateMode = async (req, res, next) => {
	try {
		const { modeId } = req.params;
		const {
			name,
			description,
			color,
			icon,
			energyLevel,
			focusRequired,
			category,
			blockedApps,
			blockedWebsites,
			cubeFace,
		} = req.body;

		const updateData = {};
		if (name) updateData.name = name;
		if (description) updateData.description = description;
		if (color) updateData.color = color;
		if (icon) updateData.icon = icon;
		if (energyLevel) updateData.energyLevel = energyLevel;
		if (typeof focusRequired === "boolean")
			updateData.focusRequired = focusRequired;
		if (category) updateData.category = category;
		if (blockedApps) updateData.blockedApps = blockedApps;
		if (blockedWebsites) updateData.blockedWebsites = 	blockedWebsites;
		if (cubeFace) updateData.cubeFace = cubeFace;

		const updatedMode = await modes.findByIdAndUpdate(modeId, updateData, {
			new: true,
		});

		if (!updatedMode) {
			return res.status(404).json({ message: "Mode not found" });
		}

		res.json(updatedMode);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getUserModes,
	createMode,
	updateMode,
};
