const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();

// Middleware
app.use(express.json());
const cors = require('cors');

// This allows every domain to access your routes
app.use(cors({
  origin: '*'
}));

const httpServer = http.createServer(app);

const initSocket = require("./socket/socketManager");
initSocket(httpServer);

// Database Connection
const connectDB = require("./config/database");
connectDB().then(() => {
	httpServer.listen(process.env.PORT || 5000, () => {
		console.log("Server + Socket.IO running");
	});
});

// Swagger Documentation
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const modeRoutes = require("./routes/modes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/modes", modeRoutes);

// Health check
app.get("/", (req, res) => {
	res.json({ message: "Cubix Backend API Running", status: "ok" });
});

// Error Handler Middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);
