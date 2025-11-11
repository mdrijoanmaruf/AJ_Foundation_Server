# AJ Foundation Server

A basic backend API with MVC pattern using Express.js and MongoDB.

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database (Cloud/Atlas)
- **Mongoose** - MongoDB driver
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **nodemon** - Auto-restart on file changes (dev)

## Project Structure

```
aj-foundation-server/
├── src/
│   ├── controllers/     # Business logic
│   │   └── userController.js
│   ├── routes/          # API routes
│   │   └── userRoutes.js
│   └── middleware/      # Custom middleware
│       └── errorHandler.js
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── index.js             # Main entry point
└── package.json
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB Atlas connection string

3. **Run the server:**
   - Development mode (with auto-restart):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aj-foundation?retryWrites=true&w=majority
NODE_ENV=development
```

## Notes

- No Mongoose schemas used - direct MongoDB collection operations
- All database operations use native MongoDB driver methods
- Error handling middleware included
- CORS enabled for all origins (configure as needed for production)
