# MEVN TaskFlow

MEVN TaskFlow is a simple, robust, and intuitive web application for users to manage their personal to-do lists, enabling creation, viewing, updating, and deletion of tasks with user authentication.

## Table of Contents


- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [API Endpoints](#api-endpoints)
- [Seed Data](#seed-data)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Register, Login)
- JWT-based stateless authentication
- Create, Read, Update, Delete (CRUD) tasks
- Users can only manage their own tasks
- Responsive and modern UI
- Client-side and server-side input validation
- Centralized state management with Pinia

## Technology Stack

**Frontend:**
- Vue.js 3 (Composition API)
- Pinia (State Management)
- Vuetify (UI Framework)
- VeeValidate (Form Validation)
- Axios (HTTP Client)
- Vue Icons (Icon Library)
- Vite (Bundler)

**Backend:**
- Node.js (Express.js Framework)
- Mongoose (MongoDB ODM)
- bcryptjs (Password Hashing)
- jsonwebtoken (JWT)
- express-rate-limit (Rate Limiting)
- joi (Server-side Validation)

**Database:**
- MongoDB (NoSQL Document Database)

**Deployment:**
- Docker, Docker Compose

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, CORS, environment
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers (JWT, password, validation)
│   │   └── app.js           # Express app setup
│   ├── package.json
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── jest.config.js       # Testing configuration
├── frontend/
│   ├── src/
│   │   ├── assets/          # CSS, images
│   │   ├── components/      # Reusable Vue components
│   │   ├── views/           # Page-level components
│   │   ├── stores/          # Pinia modules
│   │   ├── router/          # Vue Router setup
│   │   ├── services/        # Axios API calls
│   │   ├── utils/           # Validation rules
│   │   ├── main.js          # Vue app entry
│   │   └── App.vue          # Root component
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env                 # Environment variables
│   ├── nginx.conf           # Nginx config for Docker
│   └── vitest.config.js     # Testing configuration
├── cdev.json                # Project metadata
├── docker-compose.yml       # Docker Compose setup
├── Dockerfile.backend       # Dockerfile for backend
├── Dockerfile.frontend      # Dockerfile for frontend
├── install.sh               # Installation script
└── start.sh                 # Local start script
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local installation or Docker)
- Docker and Docker Compose (for containerized setup)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd MEVN-TaskFlow
    ```

2.  **Install dependencies:**
    ```bash
    ./install.sh
    ```

3.  **Configure Environment Variables:**
    Create `.env` files in both `backend/` and `frontend/` directories.

    **`backend/.env`:**
    ```env
    NODE_ENV=development
    PORT=4000
    MONGO_URI=mongodb://localhost:27017/taskflow_db
    JWT_SECRET=your_jwt_secret_key_32_chars_long
    FRONTEND_URL=http://localhost:8080
    ```

    **`frontend/.env`:**
    ```env
    VITE_API_BASE_URL=http://localhost:4000/api
    ```

4.  **Start the applications:**
    ```bash
    ./start.sh
    ```
    Alternatively, you can start them separately:
    ```bash
    # In backend/ directory
    npm start

    # In frontend/ directory (in a new terminal)
    npm run dev
    ```

    The backend will run on `http://localhost:4000` and the frontend on `http://localhost:8080`.

### Docker Setup

1.  **Ensure Docker is running.**

2.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```
    This will set up MongoDB, the backend, and the frontend.
    The frontend will be accessible at `http://localhost:8080`.

## API Endpoints

All API endpoints are prefixed with `/api`.

**Auth:**
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user, returns JWT.

**Users:**
- `GET /api/users/me`: Get authenticated user's profile (protected).

**Todos:**
- `GET /api/todos`: Get all todos for the authenticated user (protected).
- `GET /api/todos/:id`: Get a specific todo by ID (protected).
- `POST /api/todos`: Create a new todo (protected).
- `PUT /api/todos/:id`: Update an existing todo (protected).
- `DELETE /api/todos/:id`: Delete a todo by ID (protected).

**Health:**
- `GET /api/health`: Basic health check endpoint.

## Seed Data

To quickly populate your database with some initial data, you can run the seed script.

1.  **Ensure your MongoDB is running.**
2.  **Navigate to the `backend` directory.**
3.  **Run the seed script:**
    ```bash
    node src/utils/seed.js
    ```
    This will create a default user:
    - **Username**: `testuser`
    - **Email**: `test@example.com`
    - **Password**: `password123`

## Security

- **Password Hashing**: Passwords are securely hashed using `bcryptjs`.
- **JWT Authentication**: Stateless authentication using JSON Web Tokens.
- **Authorization**: Users can only access/modify their own resources.
- **Input Validation**: Robust server-side validation using Joi and client-side validation using VeeValidate.
- **Rate Limiting**: Implemented on authentication routes to prevent brute-force attacks.
- **CORS**: Configured to allow requests only from the trusted frontend origin.
- **HTTPS**: Recommended for production environments.

## Testing

### Backend Tests (Jest)

To run backend tests:
```bash
cd backend
npm test
```

### Frontend Tests (Vitest)

To run frontend tests:
```bash
cd frontend
npm test
```

## Deployment

The project is set up with Dockerfiles and `docker-compose.yml` for easy containerized deployment. For production, consider using a cloud provider like AWS ECS, Google Cloud Run, or a PaaS like Heroku/DigitalOcean App Platform. Ensure HTTPS is enabled in production.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open-sourced under the MIT License.