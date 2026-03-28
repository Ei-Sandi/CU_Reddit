# Frontend Client

This is the client-side Vue.js application for our application. Built with Vue 3, Vite, and Pinia, it provides a responsive and interactive user interface for interacting with the backend API, managing users, and handling content seamlessly.

## Features
- **Authentication & Security**: User registration, login, and **auto logout** functionality for session security.
- **Posts Management**: Create, view, and interact with posts using responsive grid and card layouts, equipped with **pagination** to easily navigate through content.
- **Comments**: View and interact with comments on posts.
- **User Profiles**: Dedicated user profile views.
- **Admin Dashboard**: Administrator-specific actions and views.
- **Role-based Access Control**: Custom permission directives (e.g., `v-can`) to conditionally render UI.
- **Client-Side Validation**: Immediate feedback on user inputs for forms before submitting to the server, improving the user experience and reducing unnecessary API calls.
- **State Management**: User state managed globally using Pinia.
- **Routing**: Client-side routing with Vue Router, distinguishing between public and authenticated views.

## Folder Structure
```text
client/
├── src/
│   ├── assets/       # Static assets like images and styles
│   ├── components/   # Reusable Vue components (PostCard, CommentCard, PostGrid)
│   ├── directives/   # Custom Vue directives (e.g., v-can for permissions)
│   ├── router/       # Vue Router configuration
│   ├── stores/       # Pinia stores for state management (user store)
│   ├── views/        # Page-level components (Home, Login, Profile, AdminDashboard, etc.)
│   ├── App.vue       # Root Vue component
│   └── main.js       # Application entry point
├── index.html        # Main HTML file
├── package.json      # Dependencies and project scripts
└── vite.config.js    # Vite configuration
```

## How to Run

### Project Setup
```sh
npm install
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```
