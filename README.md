# Multi-User Todo Web Application

A secure, full-stack todo application with user authentication and task management capabilities.

## Features

- User registration and authentication with JWT tokens
- Create, read, update, and delete personal tasks
- Mark tasks as complete/incomplete
- Strict user isolation (users can only access their own tasks)
- Responsive design for mobile, tablet, and desktop
- Secure password storage with bcrypt hashing
- RESTful API with OpenAPI documentation

## Tech Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **Authentication**: Better Auth 1.x
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library, Playwright

### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.11+
- **ORM**: SQLModel 0.0.22+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (python-jose)
- **Password Hashing**: passlib with bcrypt
- **Server**: Uvicorn (ASGI)
- **Testing**: pytest

## Project Structure

```
.
├── backend/          # Python FastAPI backend
│   ├── src/          # Source code
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   ├── api/      # API routes
│   │   ├── middleware/ # Middleware
│   │   └── core/     # Configuration
│   ├── alembic/      # Database migrations
│   ├── tests/        # Backend tests
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities and services
│   ├── types/        # TypeScript types
│   └── package.json
├── shared/           # Shared types
└── specs/            # Feature specifications
```

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 20 or higher
- PostgreSQL database (Neon account recommended)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Unix/MacOS: `source .venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

6. Update `.env` with your database URL and secrets

7. Run database migrations:
   ```bash
   alembic upgrade head
   ```

8. Start the development server:
   ```bash
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

Backend will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` with your configuration

5. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will be available at: `http://localhost:3000`

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test                # Unit tests
npm run test:e2e        # E2E tests
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Or see the OpenAPI specification at: `specs/001-multi-user-todo/contracts/api-spec.yaml`

## Constitutional Principles

This application adheres to nine core principles:

1. **Clean Architecture Separation**: Frontend and backend are completely separated
2. **Secure & Authenticated Access**: All endpoints require JWT authentication (except login/register)
3. **User Data Isolation**: Users can only access their own tasks
4. **RESTful API Design**: Standard HTTP methods and status codes
5. **Reliable Data Persistence**: PostgreSQL with ACID guarantees
6. **Clean Code Organization**: Clear directory structure and single responsibility
7. **Responsive & Accessible Frontend**: Mobile-first design with WCAG 2.1 AA compliance
8. **Maintainability & Clarity**: Type safety with TypeScript and Python type hints
9. **Cloud-Native Best Practices**: Stateless JWT auth, environment variables, HTTPS

## Security Features

- Passwords hashed with bcrypt (rounds=12)
- JWT token-based authentication with 24-hour expiration
- CORS configured to whitelist frontend origin only
- SQL injection protection via SQLModel parameterized queries
- XSS protection via React's built-in escaping
- CSRF protection via Better Auth
- HTTPS enforced in production
- Rate limiting on authentication endpoints

## Performance

- Target API response time: <500ms (p95)
- Target page load time: <3 seconds
- Task operations: <3 seconds
- Supports 100+ concurrent users

## Deployment

### Backend (Render/Railway/Fly.io)
1. Set environment variables in platform dashboard
2. Deploy from Git repository
3. Run migrations: `alembic upgrade head`
4. Configure health check endpoint: `/health`

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push to main

### Database (Neon)
1. Create production database
2. Enable automatic backups
3. Configure connection string in backend `.env`

## License

MIT

## Contributing

Please read the specification in `specs/001-multi-user-todo/spec.md` before contributing.
