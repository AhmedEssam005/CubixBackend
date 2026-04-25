const modes = require("../models/modes");
const users = require("../models/user");

const defaultModesData = [
	{
		name: "Deep Work",
		description: "Uninterrupted focused work session",
		color: "#8b5cf6",
		icon: "brain",
		energyLevel: "very-high",
		focusRequired: true,
		category: "work",
		cubeFace: 3,
	},
	{
		name: "Pomodoro",
		description: "25-minute focused work with 5-min breaks",
		color: "#f59e0b",
		icon: "timer",
		energyLevel: "medium",
		focusRequired: true,
		category: "work",
		cubeFace: 1,
	},
	{
		name: "Meetings",
		description: "Calls, discussions, and collaboration",
		color: "#06b6d4",
		icon: "users",
		energyLevel: "medium",
		focusRequired: false,
		category: "communication",
		cubeFace: 5,
	},
	{
		name: "Entertainment",
		description: "Relaxation and entertainment activities",
		color: "#ec4899",
		icon: "smile",
		energyLevel: "low",
		focusRequired: false,
		category: "break",
		cubeFace: 2,
	},
	{
		name: "Offline",
		description: "Work without internet connection",
		color: "#6366f1",
		icon: "wifi-off",
		energyLevel: "high",
		focusRequired: true,
		category: "work",
		cubeFace: 4,
	},
];

const seedInitialModes = async (userId, platform) => {
	try {
		const createdModes = await Promise.all(
			defaultModesData.map((mode) =>
				modes.create({
					...mode,
					userId,
					platform,
				}),
			),
		);

		// Update user with mode IDs
		const updateField =
			platform === "mobile" ? "mobileModes" : "desktopModes";
		await users.findByIdAndUpdate(userId, {
			[updateField]: createdModes.map((m) => m._id),
		});

		return createdModes;
	} catch (error) {
		console.error(`Error seeding modes for ${platform}:`, error);
		return [];
	}
};

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

		let allModes = await modes
			.find({
				userId: user._id,
				platform: platform,
			})
			.sort({ createdAt: 1 }); // Sort by creation to keep order consistent

		// If no modes found for this platform, seed them
		if (allModes.length === 0) {
			allModes = await seedInitialModes(user._id, platform);
		}

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
			allowedApps: req.body.allowedApps || [],
			allowedWebsites: req.body.allowedWebsites || [],
			muteNotifications: req.body.muteNotifications || false,
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
			allowedApps,
			allowedWebsites,
			muteNotifications,
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
		if (blockedWebsites) updateData.blockedWebsites = blockedWebsites;
		if (allowedApps) updateData.allowedApps = allowedApps;
		if (allowedWebsites) updateData.allowedWebsites = allowedWebsites;
		if (typeof muteNotifications === "boolean") updateData.muteNotifications = muteNotifications;
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
	seedInitialModes,
};
