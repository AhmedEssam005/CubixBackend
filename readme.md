# 🗄️ Cubix Database Documentation

---

## ⚙️ Tech Stack
- **Database:** MongoDB
- **ODM:** Mongoose
- **Backend:** Node.js + Express.js
- **API Documentation:** https://cubixbackend-production.up.railway.app/docs

---

## 🏗️ Data Models Overview

Cubix is built around three main collections:

- 👤 Users
- 🎯 Modes
- 📝 Tasks

They are linked using MongoDB references (`ObjectId`).

---

# 👤 Users Collection

Stores authentication and profile data.

```js
{
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  profileImage: { type: String },
  theme: { type: String, default: "light" },
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🎯 Modes Collection

Defines working modes for each user per platform.

```js
{
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  platform: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  cubeFace: { type: Number, min: 1, max: 5 },
  color: { type: String, default: "#6366f1" },
  icon: String,
  energyLevel: {
    type: String,
    enum: ["low", "medium", "high", "very-high"]
  },
  focusRequired: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ["work", "break", "communication", "learning"]
  },
  blockedApps: { type: [String], default: [] },
  blockedWebsites: { type: [String], default: [] },
  createdAt: Date,
  updatedAt: Date
}
```

---

# 📝 Tasks Collection

Stores user tasks linked to modes.

```js
{
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  modeId: { type: Schema.Types.ObjectId, ref: "Mode", required: true },
  name: { type: String, required: true },
  description: String,
  date: { type: Date, default: Date.now },
  duration: { type: Number, default: 30 },
  priority: { type: Number, min: 1, max: 5, default: 3 },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending"
  },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  startTime: Date,
  endTime: Date,
  completed: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  subtasks: [
    {
      id: String,
      name: String,
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

# 🔗 Relationships

| Collection | Relationship | Type |
|------------|-------------|------|
| Users → Modes | One-to-Many | 1:N |
| Users → Tasks | One-to-Many | 1:N |
| Modes → Tasks | One-to-Many | 1:N |

---

# 🚀 API Documentation
https://cubixbackend-production.up.railway.app/docs
