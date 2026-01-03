# Testing Guide - Phase 3 Authentication

## ✅ Backend Dependencies Installed!

All Python packages have been successfully installed:
- FastAPI, Uvicorn, SQLModel
- JWT authentication (python-jose)
- Password hashing (passlib, bcrypt)
- Database (psycopg3, Alembic)
- And all dependencies

## 🗄️ Step 1: Database Setup

### Option A: Neon PostgreSQL (Recommended - Free)

1. **Sign up**: Go to https://neon.tech
2. **Create project**: Click "Create Project"
3. **Copy connection string**: You'll see something like:
   ```
   postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **Update `backend/.env`**: Replace line 3 with your actual connection string

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/todo_db?sslmode=prefer
```

## 🔧 Step 2: Run Database Migrations

Once you have your database URL configured:

```powershell
# Make sure you're in the backend directory
cd backend

# Run migrations to create tables
.venv\Scripts\alembic.exe upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 001_initial_schema, Initial schema for users and tasks tables
```

## 🚀 Step 3: Start Backend Server

```powershell
# Still in backend directory
.venv\Scripts\uvicorn.exe src.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test it**: Open http://localhost:8000/docs - You should see the Swagger UI!

## 📦 Step 4: Frontend Setup

**Open a NEW terminal** (keep backend running):

```powershell
# Navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Step 5: Test Authentication Flow

### Test 1: Registration ✅

1. Open http://localhost:3000
2. Click "Get Started" or go to http://localhost:3000/register
3. Fill in:
   - **Email**: `test@example.com`
   - **Password**: `password123` (min 8 chars, letters + numbers)
4. Click "Create Account"
5. **Expected**: Redirect to login page with success message

### Test 2: Login ✅

1. On login page, enter:
   - **Email**: `test@example.com`
   - **Password**: `password123`
2. Click "Sign In"
3. **Expected**: Redirect to dashboard at http://localhost:3000/tasks

### Test 3: Dashboard ✅

1. You should see:
   - Header with "My Tasks"
   - Your email displayed
   - "Sign Out" button
   - Empty state message: "No tasks yet"
   - Stats cards (all showing 0)

### Test 4: Session Persistence ✅

1. While logged in, **refresh the page** (F5)
2. **Expected**: Still logged in, no redirect to login

3. **Close the browser** completely
4. **Reopen** and go to http://localhost:3000/tasks
5. **Expected**: Still logged in!

### Test 5: Sign Out ✅

1. Click "Sign Out" button in header
2. **Expected**: Redirect to login page

3. Try to access http://localhost:3000/tasks directly
4. **Expected**: Redirected to login page

### Test 6: Validation Errors ✅

1. Try registering with:
   - **Weak password**: `abc` → Should show "Password must be at least 8 characters"
   - **No numbers**: `abcdefgh` → Should show "Password must contain numbers"
   - **Invalid email**: `notanemail` → Should show "Invalid email format"

2. Try logging in with wrong credentials:
   - **Expected**: "Invalid email or password" error

3. Try registering with same email twice:
   - **Expected**: "Email already registered" error

## 📊 What's Working?

### Backend (API)
- ✅ `POST /api/v1/auth/register` - User registration
- ✅ `POST /api/v1/auth/login` - User authentication
- ✅ JWT token generation
- ✅ Password hashing (bcrypt)
- ✅ Email validation
- ✅ Password strength validation
- ✅ Error handling (400, 401, 409)
- ✅ Database models (User, Task)
- ✅ Database migrations (Alembic)

### Frontend (UI)
- ✅ Landing page
- ✅ Registration page with validation
- ✅ Login page with validation
- ✅ Protected dashboard layout
- ✅ Empty tasks page
- ✅ Sign out functionality
- ✅ Session persistence (localStorage)
- ✅ Password visibility toggle
- ✅ Error message display
- ✅ Loading states
- ✅ Responsive design

## 🐛 Troubleshooting

### Backend won't start

**Error**: `alembic.util.exc.CommandError: Can't locate revision identified by '001_initial_schema'`

**Solution**: The migration file might not be detected. Run:
```powershell
.venv\Scripts\alembic.exe revision --autogenerate -m "Initial schema"
.venv\Scripts\alembic.exe upgrade head
```

**Error**: `sqlalchemy.exc.OperationalError: could not connect to server`

**Solution**:
1. Check your DATABASE_URL in backend/.env
2. Make sure your Neon database is active
3. Test connection from browser or psql

### Frontend won't connect to backend

**Error**: `Network Error` or `CORS error`

**Solution**:
1. Make sure backend is running on port 8000
2. Check `CORS_ORIGINS` in backend/.env includes `http://localhost:3000`
3. Verify `NEXT_PUBLIC_API_URL` in frontend/.env.local is `http://localhost:8000`

### JWT token errors

**Error**: `Invalid token` or authentication keeps failing

**Solution**:
1. Make sure `JWT_SECRET` in backend/.env matches `BETTER_AUTH_SECRET` in frontend/.env.local
2. Clear localStorage in browser DevTools (Application → Local Storage → Clear All)
3. Sign out and sign in again

### Frontend shows blank page

**Solution**:
1. Open browser DevTools (F12) and check Console for errors
2. Make sure you ran `npm install` in frontend directory
3. Try deleting `frontend/.next` folder and restart dev server

## 📝 API Documentation

While backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Try the API directly:

```bash
# Register a user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "api@test.com", "password": "apitest123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "api@test.com", "password": "apitest123"}'
```

## ✨ What's Next?

Once authentication is working, you're ready for **Phase 4: Create and View Tasks**!

This will add:
- Task creation API endpoint
- Task list API endpoint
- Task creation form in frontend
- Task list display component
- Real task data instead of empty state

---

**Need help?** Check the error messages in:
- Backend: Terminal where uvicorn is running
- Frontend: Terminal where npm run dev is running
- Browser: DevTools Console (F12)

Happy testing! 🎉
