# Backend Server

This is the server-side REST API for our application. Built with Node.js and Koa, it handles database interactions, user authentication, file uploads, and ensures robust validation and security for all incoming requests.

## Features
- **RESTful API**: Clear and structured endpoints for managing users, posts, comments, and likes.
- **Authentication & Security**: Multi-strategy authentication utilizing JWT (JSON Web Tokens) and Basic Auth.
- **Authorization**: Granular, role-based access control and permissions middleware to protect sensitive routes.
- **Server-Side Validation**: Strict request schema validation to ensure data integrity before it reaches the database.
- **File Uploads**: Handles media and image uploads efficiently, serving static assets when requested.
- **Database Modularity**: Structured data models and helpers for organized and reusable database logic.
- **Testing**: Comprehensive test suite covering controllers, models, routes, middlewares, and permissions.

## Folder Structure
```text
server/
├── __tests__/        # Complete test suite organized by architectural layers
├── scripts/          # Utility scripts (e.g., seed-db.js for database seeding)
├── src/
│   ├── controllers/  # Request handlers for routes (users, posts, uploads, etc.)
│   ├── helpers/      # Utility helpers (e.g., database connection logic)
│   ├── middlewares/  # Koa middlewares (auth, logger, validation, permissions)
│   ├── models/       # Database models representing core entities
│   ├── permissions/  # Role and action-based permission rules
│   ├── routes/       # Koa route definitions
│   ├── schemas/      # Validation schemas for incoming request bodies
│   ├── strategies/   # Authentication strategies (JWT, Basic)
│   ├── uploads/      # Processed file upload handlers
│   └── app.js        # Koa application setup and entry point
├── uploads/          # Directory where user uploaded files/media are stored
├── config.js         # Configuration and environment variables mapping
└── package.json      # Dependencies and server scripts
```

## How to Run

### Project Setup
```sh
npm install
```

### Seed the Database (Optional)
```sh
npm run seed  # Note: Adjust to your specific seed script if different (node scripts/seed-db.js)
```

### Run for Development (with hot-reload)
```sh
npm run dev
```

### Run for Production
```sh
npm start
```

### Run Tests
```sh
npm test
```
