# Quick Start Guide - Todo Application

Get up and running in 5 minutes!

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- PostgreSQL database (Neon configured)

## Step 1: Database Setup (1 minute)

```bash
cd backend
pip install -r requirements.txt
python create_tables.py
```

✅ Tables created: users, tasks

## Step 2: Start Backend (1 minute)

```bash
uvicorn src.main:app --reload
```

✅ http://localhost:8000 (API docs: /docs)

## Step 3: Start Frontend (1 minute)

```bash
cd frontend
npm install
npm run dev
```

✅ http://localhost:3000

## Step 4: Test (2 minutes)

1. Register at /register
2. Login with your credentials
3. Create tasks with "+ Add Task"
4. Test edit, complete, delete

## Features

✅ Full authentication & authorization
✅ Complete task CRUD operations
✅ Responsive design (mobile-first)
✅ Toast notifications
✅ User isolation
✅ WCAG 2.1 AA accessible
✅ Professional UI/UX

See IMPLEMENTATION_COMPLETE.md for details!
