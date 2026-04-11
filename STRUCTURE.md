# Cubix Backend - API Documentation

## New Project Structure

```
CubixBackend/
├── config/
│   └── database.js              # MongoDB connection configuration
├── middleware/
│   └── errorHandler.js          # Global error handling middleware
├── routes/
│   ├── auth.js                  # Authentication endpoints (login, signup)
│   ├── users.js                 # User profile endpoints
│   ├── tasks.js                 # Task management endpoints
│   └── modes.js                 # Mode management endpoints
├── controllers/
│   ├── authController.js        # Auth business logic
│   ├── userController.js        # User business logic
│   ├── taskController.js        # Task business logic
│   └── modeController.js        # Mode business logic
├── utils/
│   └── validators.js            # Input validation functions
├── models/
│   ├── user.js                  # User schema
│   ├── task.js                  # Task schema
│   └── modes.js                 # Mode schema
├── index.js                     # Main server file
├── package.json
├── .env                         # Environment variables (do not commit)
├── .env.example                 # Example environment file
└── openapi.yaml                 # API documentation
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signUp` - User registration

### Users
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update user profile

### Tasks
- `GET /tasks` - Get tasks (filter by userId, modeId)
- `POST /tasks` - Create new task
- `PUT /tasks/:taskId` - Update task
- `PUT /tasks/:taskId/complete` - Mark task as complete
- `DELETE /tasks/:taskId` - Delete task

### Modes
- `GET /modes` - Get user modes (query: email, platform)
- `POST /modes` - Create new mode
- `PUT /modes/:modeId` - Update mode
- `DELETE /modes/:modeId` - Delete mode

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URL and port.

3. Run the server:
   ```bash
   npm start          # Production
   npm run dev        # Development (with nodemon)
   ```

4. Access API Documentation:
   - Visit `http://localhost:5000/docs` for Swagger UI

## Features Implemented

✅ Modular routing structure
✅ Separation of concerns (routes, controllers, models)
✅ Input validation
✅ Error handling middleware
✅ Database connection management
✅ Swagger API documentation
✅ Status HTTP codes (200, 201, 400, 404, 409, 500)
✅ Password hashing with bcryptjs
✅ MongoDB integration with Mongoose

## Next Steps to Consider

- Add JWT authentication middleware for protected routes
- Add role-based access control (RBAC)
- Add request logging middleware
- Add rate limiting
- Add CORS configuration
- Add input sanitization
- Add unit and integration tests
- Add API versioning (e.g., /v1/auth)
- Add pagination for list endpoints
- Add search and filtering capabilities
