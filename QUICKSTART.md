# Quickstart Guide - Multi-User Todo App

## 🎉 What's Implemented (Phase 1-3 Complete!)

### ✅ Phase 1: Project Setup
- Complete monorepo structure (backend + frontend)
- All configuration files (TypeScript, Tailwind, environment variables)
- Git ignore files and README

### ✅ Phase 2: Core Infrastructure
- **Backend Core**:
  - Configuration management (Pydantic settings)
  - Database connection with SQLModel
  - JWT authentication & password hashing (bcrypt)
  - Global error handling middleware
  - Auth middleware for protected routes

- **Frontend Core**:
  - Better Auth configuration
  - API client with interceptors
  - TypeScript type definitions
  - Reusable UI components (Button, Input)

### ✅ Phase 3: User Authentication (MVP!)
- **Backend**:
  - User & Task database models
  - Auth service (register, login, password validation)
  - Auth API routes (POST /api/v1/auth/register, POST /api/v1/auth/login)
  - Database migration script for PostgreSQL

- **Frontend**:
  - Registration form with validation
  - Login form with validation
  - Protected dashboard layout
  - Empty tasks page (ready for Phase 4)
  - Sign-out functionality
  - Session persistence

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL database (Neon recommended)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Unix/MacOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env with your database URL:
# DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require

# Run database migrations (IMPORTANT!)
alembic upgrade head

# Start backend server
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be running at: http://localhost:8000
API docs: http://localhost:8000/docs

### Step 2: Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Environment variables are already configured in .env.local
# (Make sure BETTER_AUTH_SECRET matches backend JWT_SECRET!)

# Start frontend development server
npm run dev
```

Frontend will be running at: http://localhost:3000

## 🧪 Testing the Authentication Flow

1. **Visit http://localhost:3000**
   - You'll see the landing page

2. **Register a new account**
   - Click "Get Started" or go to http://localhost:3000/register
   - Enter email and password (min 8 chars, letters + numbers)
   - Submit the form
   - You'll be redirected to login page

3. **Login**
   - Enter your credentials
   - You'll be redirected to the dashboard at http://localhost:3000/tasks

4. **Dashboard**
   - See the empty tasks page (tasks will be added in Phase 4)
   - Notice your email in the header
   - Try the "Sign Out" button

5. **Session Persistence**
   - After logging in, refresh the page
   - You should remain logged in
   - Try closing the browser and reopening - still logged in!

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── models/          # User & Task models ✅
│   │   ├── services/        # Auth service ✅
│   │   ├── api/routes/      # Auth routes ✅
│   │   ├── middleware/      # Error & Auth middleware ✅
│   │   └── core/            # Config, DB, Security ✅
│   ├── alembic/             # Database migrations ✅
│   ├── requirements.txt     # Python dependencies ✅
│   └── .env                 # Environment variables ✅
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/          # Register & Login pages ✅
│   │   ├── (dashboard)/     # Protected dashboard ✅
│   │   └── api/auth/        # Better Auth handler ✅
│   ├── components/
│   │   ├── ui/              # Button, Input components ✅
│   │   └── auth/            # RegisterForm, LoginForm ✅
│   ├── lib/
│   │   ├── auth/            # Better Auth config ✅
│   │   └── services/        # API client ✅
│   ├── types/               # TypeScript types ✅
│   ├── package.json         # Node dependencies ✅
│   └── .env.local           # Environment variables ✅
│
└── README.md                # Project documentation ✅
```

## 🔐 Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
```

**⚠️ IMPORTANT**: `BETTER_AUTH_SECRET` and `JWT_SECRET` **MUST match**!

## 🐛 Troubleshooting

### Database Connection Issues
- Make sure your DATABASE_URL in backend/.env is correct
- Verify you ran `alembic upgrade head` to create tables
- Check that your PostgreSQL database is running

### Frontend Can't Connect to Backend
- Ensure backend is running on port 8000
- Check CORS_ORIGINS in backend/.env includes http://localhost:3000
- Verify NEXT_PUBLIC_API_URL in frontend/.env.local is http://localhost:8000

### JWT Token Issues
- Ensure JWT_SECRET (backend) and BETTER_AUTH_SECRET (frontend) match exactly
- Clear localStorage in browser dev tools if you see auth errors
- Check browser console for error messages

## ✨ What's Next?

### Phase 4: Create & View Tasks (Next!)
- Implement task creation API endpoint
- Build task list component
- Add task form with validation
- Display user's tasks with empty state

### Phase 5: Update & Complete Tasks
- Edit task functionality
- Mark tasks as complete/incomplete
- Update timestamps

### Phase 6: Delete Tasks
- Delete task API endpoint
- Confirmation modal
- Optimistic UI updates

### Phase 7: Polish
- Loading states
- Toast notifications
- Responsive design
- Accessibility improvements
- Error boundaries

## 📚 Additional Resources

- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Specification**: See `specs/001-multi-user-todo/spec.md`
- **Data Model**: See `specs/001-multi-user-todo/data-model.md`
- **API Contract**: See `specs/001-multi-user-todo/contracts/api-spec.yaml`

## 🎯 Success Criteria (Phase 3)

- [X] User can register with email + password
- [X] Validation errors display for weak passwords
- [X] Duplicate email returns 409 error
- [X] User can login with credentials
- [X] Invalid credentials return 401 error
- [X] Authenticated users redirect to dashboard
- [X] Dashboard shows empty task state
- [X] User can sign out
- [X] Session persists across page refreshes

**Status**: ✅ All Phase 3 criteria met!

---

Ready to continue? Run the next phase with `/sp.implement` or continue manually!
