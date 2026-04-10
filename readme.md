🗄️ Cubix Database Design

This document describes the MongoDB database structure used in the Cubix backend system.

⚙️ Tech Stack
MongoDB
Mongoose ODM
Node.js + Express.js backend
👤 Users Collection

Stores all user account information.

{
name: String (required),
age: Number (required),
email: String (required),
password: String (required, hashed),
profileImage: String,
theme: String (default: "light"),
createdAt: Date,
updatedAt: Date
}
📌 Description
Each user represents a registered account in the system
Passwords are stored securely using hashing (bcrypt)
Email is used as the main identifier for user queries
🎯 Modes Collection

Stores user-specific configurations or modes.

{
userId: ObjectId (ref: "users", required),
platform: String,
name: String (required),
cubeFace: Number (1–5),
blockedList: [String],
createdAt: Date,
updatedAt: Date
}
📌 Description
Each mode belongs to a specific user
Used to store user-defined configurations per platform
Includes restrictions via blockedList
📝 Tasks Collection

Stores tasks created by users.

{
userId: ObjectId (ref: "users", required),
modeId: ObjectId (ref: "Mode", required),
name: String (required),
description: String,
date: Date,
priority: String (default: "medium"),
startTime: Date,
endTime: Date,
completed: Boolean (default: false),
pointsEarned: Number (default: 0),
createdAt: Date,
updatedAt: Date
}
