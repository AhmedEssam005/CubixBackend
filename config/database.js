const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log("Database Connected Successfully");
	} catch (error) {
		console.log("Error Connecting Database:", error);
		process.exit(1);
	}
};

module.exports = connectDB;
