# BookStore MERN Application - Backend

This is the backend service for the professional BookStore MERN stack application.

## Tech Stack
- **Node.js** & **Express.js** for the server framework
- **MongoDB** & **Mongoose** for the database
- **CORS** for cross-origin resource sharing
- **Dotenv** for environment variable management
- **Nodemon** for development auto-reloading

## Folder Structure
```text
backend/
├── config/       # Database and environment configuration
├── controllers/  # Request handling logic
├── middleware/   # Authentication, error handling, and validation middlewares
├── models/       # Mongoose models
├── routes/       # Express route definitions
├── services/     # Business logic
├── utils/        # Helper and utility functions
├── validations/  # Request validation schemas
├── uploads/      # Temporary storage for uploaded images
├── .env          # Environment variables (not tracked in git)
├── .env.example  # Placeholder environment variables
├── .gitignore    # Git ignore rules
├── package.json  # Dependencies and scripts
├── README.md     # Project documentation
└── server.js     # Entry point of the application
```

## Installation Steps
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` (if not already created).
   - Fill in the values for `PORT`, `MONGODB_URI`, and `JWT_SECRET`.

## Run Commands

- **Development mode** (with auto-reload using nodemon):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```
