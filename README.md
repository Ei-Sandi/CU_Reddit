
# 6005CMD_Coursework
Submission for 6005CMD - social media platform

This repository contains a full-stack social media platform, built as the coursework submission for the 6005CMD module.

## Architecture Overview

The application is split into two main components: a frontend client and a backend server.

### [Client](./client/README.md)
The client is a Single Page Application (SPA) built with **Vue 3**, **Vite**, and **Pinia**. It handles the presentation layer, offering a responsive UI, client-side input validation, authentication flows, and role-based conditional rendering (e.g., admin vs. standard user views).
*View the full client details in the [Client README](./client/README.md).*

### [Server](./server/README.md)
The backend server is a RESTful API powered by **Node.js** and **Koa**. It acts as the backbone of the application, handling database interactions, handling multiple authentication strategies (JWT and Basic), enforcing permission rules, and safely storing file uploads.
*View the full server details in the [Server README](./server/README.md).*

## How to Start

To run the complete platform locally, you must start both the server and the client in separate terminal instances.

### 1. Start the Backend Server
```sh
cd server
npm install
npm start  # or: node src/app.js
```

### 2. Start the Frontend Client
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
- To execute the automated tests:
  ```sh
  cd server
  npm test
  ```
