# Quickstart Guide: Multi-User Todo Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-03
**Estimated Setup Time**: 20-30 minutes

## Overview

This guide will help you set up and run the multi-user Todo application locally. The application consists of a Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher ([Download](https://nodejs.org/))
- **Python**: Version 3.11 or higher ([Download](https://www.python.org/downloads/))
- **Git**: For version control ([Download](https://git-scm.com/))
- **Neon Account**: Free serverless PostgreSQL ([Sign up](https://neon.tech/))

Verify installations:
```bash
node --version  # Should show v20.x or higher
python --version  # Should show Python 3.11 or higher
git --version
```

## Project Structure

```
Todo-Web-Application/
├── backend/           # FastAPI backend
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── frontend/          # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── .env.local
└── README.md
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Todo-Web-Application
git checkout 001-multi-user-todo
```

## Step 2: Database Setup (Neon PostgreSQL)

### 2.1 Create Neon Project

1. Go to [neon.tech](https://neon.tech/) and sign in
2. Click "Create Project"
3. Configure:
   - Project name: `todo-app-dev`
   - Region: Select closest to your location
   - PostgreSQL version: 16 (latest stable)
4. Click "Create Project"

### 2.2 Get Database Connection String

1. In the Neon dashboard, go to your project
2. Navigate to "Connection Details"
3. Copy the connection string (it looks like):
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```
4. Save this for the next step

### 2.3 Initialize Database Schema

The database schema will be created automatically by Alembic migrations when you first run the backend (Step 3.3).

## Step 3: Backend Setup (FastAPI)

### 3.1 Navigate to Backend Directory

```bash
cd backend
```

### 3.2 Create Python Virtual Environment

**Windows**:
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 3.3 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.4 Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Database
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require

# Authentication (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# API
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000

# Server
HOST=0.0.0.0
PORT=8000
```

**Important**: Replace `your-super-secret-jwt-key-change-this-in-production` with a strong random string. Generate one with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3.5 Run Database Migrations

```bash
alembic upgrade head
```

This creates the `users` and `tasks` tables in your Neon database.

### 3.6 Start the Backend Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 3.7 Verify Backend is Running

Open your browser and navigate to:

- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

You should see the interactive Swagger UI with all API endpoints.

## Step 4: Frontend Setup (Next.js)

### 4.1 Open New Terminal

Keep the backend running in the first terminal. Open a new terminal window/tab.

### 4.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 4.3 Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and Better Auth.

### 4.4 Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:3000

# Note: BETTER_AUTH_SECRET must match JWT_SECRET from backend .env
```

**Critical**: The `BETTER_AUTH_SECRET` MUST be the same value as `JWT_SECRET` from the backend `.env` file. This shared secret enables JWT verification between frontend and backend.

### 4.5 Start the Frontend Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### 4.6 Open the Application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Todo application landing page!

## Step 5: Test the Application

### 5.1 Register a New User

1. Click "Sign Up" or navigate to [http://localhost:3000/register](http://localhost:3000/register)
2. Enter:
   - Email: `test@example.com`
   - Password: `TestPass123`
3. Click "Create Account"
4. You should be redirected to the login page

### 5.2 Login

1. Enter the email and password you just created
2. Click "Sign In"
3. You should be redirected to the task dashboard at `/tasks`

### 5.3 Create a Task

1. On the task dashboard, click "Add Task" or the "+" button
2. Enter:
   - Title: `Buy groceries`
   - Description: `Milk, eggs, bread`
3. Click "Create Task"
4. The task should appear in your task list

### 5.4 Update a Task

1. Click on the task you just created
2. Click "Edit" or the pencil icon
3. Change the title to `Buy groceries and cook dinner`
4. Click "Save"
5. The task should update immediately

### 5.5 Complete a Task

1. Click the checkbox next to the task
2. The task should be marked as completed (strikethrough or checkmark)

### 5.6 Delete a Task

1. Click the "Delete" or trash icon on the task
2. Confirm the deletion in the modal
3. The task should be removed from the list

### 5.7 Test User Isolation

1. Open a new incognito/private browser window
2. Register a different user (e.g., `user2@example.com`)
3. Create tasks for the second user
4. Verify that:
   - User 1 only sees their own tasks
   - User 2 only sees their own tasks
   - No cross-user data is visible

## Development Workflow

### Running Both Services

You need **two terminal windows**:

**Terminal 1 - Backend**:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### Hot Reloading

Both services support hot reloading:
- **Backend**: Changes to Python files automatically reload the server
- **Frontend**: Changes to TypeScript/React files automatically refresh the browser

### Stopping the Services

Press `CTRL+C` in each terminal to stop the servers.

## Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

### E2E Tests

```bash
cd frontend
npx playwright test
```

## Troubleshooting

### Backend Won't Start

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd backend
source venv/bin/activate  # Ensure virtual environment is activated
pip install -r requirements.txt
```

---

**Issue**: `Connection refused` when connecting to database

**Solution**:
1. Check that your Neon database is running (log into Neon dashboard)
2. Verify `DATABASE_URL` in `backend/.env` is correct
3. Ensure `?sslmode=require` is at the end of the connection string
4. Check your internet connection (Neon requires internet access)

---

**Issue**: `alembic.util.exc.CommandError: Can't locate revision identified by`

**Solution**:
```bash
cd backend
rm -rf alembic/versions/*  # Clear old migrations
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

### Frontend Won't Start

**Issue**: `Error: Cannot find module 'next'`

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

**Issue**: API requests failing with CORS errors

**Solution**:
1. Check that backend is running on `http://localhost:8000`
2. Verify `CORS_ORIGINS=http://localhost:3000` in `backend/.env`
3. Restart the backend server after changing `.env`

---

**Issue**: `401 Unauthorized` on all API requests

**Solution**:
1. Verify `BETTER_AUTH_SECRET` in `frontend/.env.local` MATCHES `JWT_SECRET` in `backend/.env`
2. Clear your browser cookies and login again
3. Check browser console for token errors
4. Verify you're logged in (check for token in Application > Cookies)

### Database Issues

**Issue**: `relation "users" does not exist`

**Solution**:
```bash
cd backend
source venv/bin/activate
alembic upgrade head
```

---

**Issue**: Cannot connect to Neon database

**Solution**:
1. Check internet connection
2. Verify Neon project is active (not paused due to inactivity on free tier)
3. Check if IP is whitelisted (if you configured IP restrictions in Neon)
4. Try connecting with `psql` directly to test connectivity:
   ```bash
   psql "postgresql://username:password@host.neon.tech/database?sslmode=require"
   ```

## Environment Variables Reference

### Backend (.env)

| Variable              | Description                          | Example                                    |
|-----------------------|--------------------------------------|--------------------------------------------|
| DATABASE_URL          | Neon PostgreSQL connection string    | postgresql://user:pass@host/db?sslmode=require |
| JWT_SECRET            | Secret key for JWT signing           | (32+ character random string)              |
| JWT_ALGORITHM         | JWT signing algorithm                | HS256                                      |
| JWT_EXPIRATION_HOURS  | Token expiration in hours            | 24                                         |
| API_V1_PREFIX         | API URL prefix                       | /api/v1                                    |
| CORS_ORIGINS          | Allowed frontend origins             | http://localhost:3000                      |
| HOST                  | Server host                          | 0.0.0.0                                    |
| PORT                  | Server port                          | 8000                                       |

### Frontend (.env.local)

| Variable              | Description                          | Example                        |
|-----------------------|--------------------------------------|--------------------------------|
| NEXT_PUBLIC_API_URL   | Backend API base URL                 | http://localhost:8000          |
| BETTER_AUTH_SECRET    | JWT secret (must match backend)      | (same as backend JWT_SECRET)   |
| BETTER_AUTH_URL       | Frontend URL for Better Auth         | http://localhost:3000          |

## Next Steps

Now that your development environment is set up:

1. **Read the API Documentation**: Explore the Swagger UI at `http://localhost:8000/docs`
2. **Review the Data Model**: Check `specs/001-multi-user-todo/data-model.md`
3. **Run Tests**: Execute backend and frontend test suites
4. **Explore the Code**: Familiarize yourself with the backend (`backend/src/`) and frontend (`frontend/app/`) structure
5. **Implement Tasks**: Proceed to `specs/001-multi-user-todo/tasks.md` (created by `/sp.tasks` command)

## Additional Resources

- **API Contracts**: `specs/001-multi-user-todo/contracts/README.md`
- **Feature Specification**: `specs/001-multi-user-todo/spec.md`
- **Implementation Plan**: `specs/001-multi-user-todo/plan.md`
- **Research Notes**: `specs/001-multi-user-todo/research.md`

## Getting Help

If you encounter issues not covered in this guide:

1. Check the main project README.md
2. Review the troubleshooting section above
3. Inspect browser console for frontend errors
4. Check terminal logs for backend errors
5. Verify all environment variables are set correctly

## Production Deployment

This quickstart guide is for **local development only**. For production deployment:

- Use Vercel for frontend hosting
- Use Render or Railway for backend hosting
- Ensure HTTPS is enabled
- Use strong JWT secrets (64+ characters)
- Enable rate limiting on auth endpoints
- Configure production CORS origins
- Set up monitoring and logging
- Implement database backups

Deployment instructions will be provided separately.
