# 🗄️ Cubix Database Documentation

---

## ⚙️ Tech Stack
* **Database:** MongoDB
* **ODM:** Mongoose
* **Environment:** Node.js + Express.js
* **API Documentation:** [Swagger UI / API Docs](https://cubixbackend-production.up.railway.app/docs)

---

## 🏗️ Data Models

### 👤 Users Collection
The core collection for managing identity and personalization.

```javascript
{
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Bcrypt hashed
  profileImage: { type: String },
  theme: { type: String, default: "light" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
**📌 Key Details:**
* **Security:** Passwords must be hashed using `bcrypt` before persistence.
* **Identifier:** The `email` field is indexed and used as the primary lookup for authentication.

---

### 🎯 Modes Collection
Configurations that define how a user interacts with different platforms.

```javascript
{
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String },
  name: { type: String, required: true },
  cubeFace: { type: Number, min: 1, max: 6 },
  blockedList: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
**📌 Key Details:**
* **Relationship:** One-to-Many (`User` ⮕ `Modes`).
* **Functionality:** Stores platform-specific restrictions (via `blockedList`) and physical hardware mapping (`cubeFace`).

---

### 📝 Tasks Collection
Stores actionable items, scheduling data, and gamification metrics.

```javascript
{
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  modeId: { type: Schema.Types.ObjectId, ref: "Mode", required: true },
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  startTime: { type: Date },
  endTime: { type: Date },
  completed: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
**📌 Key Details:**
* **Contextual Linking:** Every task is tied to both a `User` and a specific `Mode`.
* **Gamification:** The `pointsEarned` field tracks user progression upon task completion.

---

## 🔗 Entity Relationship Summary



| Collection | Parent | Relationship Type |
| :--- | :--- | :--- |
| **Users** | — | Root Collection |
| **Modes** | Users | One-to-Many (1 User : N Modes) |
| **Tasks** | Users & Modes | Many-to-One (N Tasks : 1 Mode) |

---

## 🚀 Testing & Deployment
The production database is accessible via the Cubix API Gateway. For integration testing and endpoint validation, refer to the live documentation:

👉 **[Live API Documentation](https://cubixbackend-production.up.railway.app/docs)**