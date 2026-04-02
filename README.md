# CU_reddit

This repository contains a full-stack social media platform, built for coursework submission for the 6005CMD module at Coventry University. 

## Key Features

This platform was built with a focus on modularity and security, moving beyond basic CRUD to provide a production-ready experience.

- Advanced Authentication: Dual-strategy support using JWT and Basic Auth, featuring session security with auto-logout functionality.
- Granular RBAC: A custom Role-Based Access Control system. On the frontend, this is powered by a custom v-can directive to conditionally render UI based on permissions.
- Layered Backend Architecture: A robust Koa.js API utilizing multiple middleware layers for logging, schema validation, authentication, and error handling.
- Dynamic Content: Full post and comment management featuring server-side pagination and a responsive grid layout.
- Developer-First Tooling: Includes a comprehensive automated test suite and interactive OpenAPI (Swagger) documentation for all REST endpoints.
- Data Integrity: Strict server-side validation paired with immediate client-side feedback to ensure a clean and secure database.


## Architecture Overview

The application is split into two main components: a frontend client and a backend server.

### [Client](./client/README.md)
The client is a Single Page Application (SPA) built with **Vue 3**, **Vite**, and **Pinia**. It handles the presentation layer, offering a responsive UI, client-side input validation, authentication flows, and role-based conditional rendering (e.g., admin vs. standard user views).
*View the full client details in the [Client README](./client/README.md).*

### [Server](./server/README.md)
The backend server is a RESTful API powered by **Node.js** and **Koa**. It acts as the backbone of the application, handling database interactions, handling multiple authentication strategies (JWT and Basic), enforcing permission rules, and safely storing file uploads.
*View the full server details in the [Server README](./server/README.md).*

## How to Start

To run the complete platform locally, you must create the database and start both the server and the client in separate terminal instances.

### 1. Database Setup
- Create a database with the name `cu_reddit` first.

### 2. Start the Backend Server
```sh
cd server
npm install
node scripts/seed-db.js  # Populate the database first
npm start  # or: node src/app.js
```

### 3. Start the Frontend Client
```sh
cd client
npm install
npm run dev
```

## URLs & Access

Once both environments are up and running, default access points are:
- **Frontend Client**: [http://localhost:5173](http://localhost:5173) (Vite default)
- **Backend API**: `http://localhost:3000` 

## OpenAPI Documentation

The backend REST API is fully documented using the OpenAPI specification. You can view the structured details about request schemas, parameters, responses, and authorization requirements through the API documentation endpoint at `/api/docs` when the server is running.

## Automated Testing

Reliability and stability are maintained through a robust automated testing mechanism on the backend. 
- The `server/__tests__/` directory contains a comprehensive suite that verifies models, routes, middlewares, permissions, strategies, and controllers.
- Create a database with the name `test_db` first before running tests!
- To execute the automated tests:
  ```sh
  cd server
  npm test
  ```

## Personal Reflection

- Developing a web application is not just about a flashy UI and a working server. It’s about building secure and maintainable software by validating data on both the client and server sides, stacking multiple middleware layers for authentication, validation, and RBAC, breaking down components for maximum unit test coverage, documenting the API, optimizing database queries, and implementing proper logging and monitoring.
