# Data Model: Multi-User Todo Web Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-03
**Phase**: Phase 1 - Data Model Design

## Overview

This document defines the database schema and entity relationships for the multi-user Todo application. The data model enforces user isolation, referential integrity, and validation constraints aligned with functional requirements.

## Entity-Relationship Diagram

```
┌─────────────────────────┐
│        User             │
├─────────────────────────┤
│ id: UUID (PK)           │
│ email: String (UNIQUE)  │
│ hashed_password: String │
│ created_at: DateTime    │
│ updated_at: DateTime    │
└─────────────┬───────────┘
              │
              │ 1:N (owns)
              │
              ▼
┌─────────────────────────┐
│        Task             │
├─────────────────────────┤
│ id: UUID (PK)           │
│ user_id: UUID (FK)      │──┐
│ title: String(200)      │  │
│ description: Text(2000) │  │
│ is_completed: Boolean   │  │
│ created_at: DateTime    │  │
│ updated_at: DateTime    │  │
└─────────────────────────┘  │
                             │
     Foreign Key Constraint  │
     ON DELETE CASCADE ──────┘
```

## Entities

### 1. User

Represents an authenticated account holder in the system.

**Table Name**: `users`

**Columns**:

| Column           | Type         | Constraints                        | Description                           |
|------------------|--------------|------------------------------------|---------------------------------------|
| id               | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique user identifier               |
| email            | VARCHAR(255) | NOT NULL, UNIQUE                   | User's email address (login identifier) |
| hashed_password  | VARCHAR(255) | NOT NULL                           | bcrypt-hashed password                |
| created_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()            | Account creation timestamp            |
| updated_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()            | Last account update timestamp         |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (for fast lookup during login)

**Validation Rules**:
- `email`: Must be valid email format (validated in application layer)
- `email`: Must be unique across all users
- `hashed_password`: Never store plain text passwords, always bcrypt hash
- `hashed_password`: Minimum original password length 8 characters with letters and numbers (validated before hashing)

**SQLModel Definition** (backend/src/models/user.py):

```python
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional, List

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="owner", cascade_delete=True)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
```

**TypeScript Type** (frontend/types/user.ts):

```typescript
export interface User {
  id: string;
  email: string;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string;
}

// Password is never included in API responses
```

**Notes**:
- Password is NEVER returned in API responses (separate Pydantic response models exclude it)
- `updated_at` is automatically updated on any user record modification
- Users can own zero or more tasks (one-to-many relationship)

---

### 2. Task

Represents a todo item owned by a single user.

**Table Name**: `tasks`

**Columns**:

| Column        | Type         | Constraints                                  | Description                          |
|---------------|--------------|----------------------------------------------|--------------------------------------|
| id            | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()       | Unique task identifier               |
| user_id       | UUID         | NOT NULL, FOREIGN KEY → users(id) ON DELETE CASCADE | Owner of the task                    |
| title         | VARCHAR(200) | NOT NULL                                     | Task title (required)                |
| description   | TEXT(2000)   | NULL                                         | Task description (optional)          |
| is_completed  | BOOLEAN      | NOT NULL, DEFAULT false                      | Completion status                    |
| created_at    | TIMESTAMP    | NOT NULL, DEFAULT NOW()                      | Task creation timestamp              |
| updated_at    | TIMESTAMP    | NOT NULL, DEFAULT NOW()                      | Last task update timestamp           |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for fast filtering of user's tasks)
- INDEX on `created_at` (for sorting tasks by creation date)

**Foreign Keys**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE
  - If a user is deleted, all their tasks are automatically deleted

**Validation Rules**:
- `title`: Required, max 200 characters, must contain non-whitespace characters
- `description`: Optional, max 2000 characters if provided
- `is_completed`: Boolean (true or false), defaults to false
- `user_id`: Must reference an existing user
- **Authorization**: Users can only access tasks where `user_id` matches their authenticated user ID

**SQLModel Definition** (backend/src/models/task.py):

```python
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False, index=True)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationship to user
    owner: Optional["User"] = Relationship(back_populates="tasks")

    def __repr__(self):
        return f"<Task(id={self.id}, title='{self.title}', completed={self.is_completed})>"
```

**TypeScript Type** (frontend/types/task.ts):

```typescript
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}
```

**Notes**:
- Every task MUST be owned by exactly one user (enforced by NOT NULL on user_id)
- Tasks are automatically deleted if the owning user is deleted (CASCADE)
- `updated_at` is automatically updated on any task modification
- `is_completed` tracks whether task is done (default: false for new tasks)

---

## Database Constraints & Integrity

### Referential Integrity

1. **User → Task Relationship**:
   - One user can have zero or more tasks (1:N relationship)
   - Each task belongs to exactly one user (enforced by NOT NULL foreign key)
   - Foreign key constraint ensures `task.user_id` always references a valid `users.id`
   - ON DELETE CASCADE: When user deleted, all their tasks are automatically deleted

### Data Integrity Constraints

1. **User Constraints**:
   - Email must be unique (UNIQUE constraint)
   - Email cannot be NULL (NOT NULL constraint)
   - Hashed password cannot be NULL (NOT NULL constraint)

2. **Task Constraints**:
   - Title cannot be NULL (NOT NULL constraint)
   - Title max length 200 characters (enforced by VARCHAR(200))
   - Description max length 2000 characters (enforced by TEXT(2000))
   - user_id cannot be NULL (NOT NULL constraint)
   - user_id must reference existing user (FOREIGN KEY constraint)

### Application-Level Validation

While database constraints enforce data integrity, additional validation occurs in the application layer:

**User**:
- Email format validation (RFC 5322 compliant)
- Password strength validation (min 8 chars, contains letters and numbers)
- Password hashing with bcrypt before storage

**Task**:
- Title must contain at least one non-whitespace character
- Title and description sanitized to prevent XSS attacks
- User authorization: User can only create/read/update/delete their own tasks

## State Transitions

### Task Lifecycle

```
   [Create Task]
        │
        ▼
  ┌──────────┐
  │  Active  │ (is_completed = false)
  │  Task    │
  └────┬─────┘
       │
       │ [Mark Complete]
       ▼
  ┌──────────┐
  │Completed │ (is_completed = true)
  │  Task    │
  └────┬─────┘
       │
       │ [Mark Incomplete]
       ▼
  ┌──────────┐
  │  Active  │ (is_completed = false)
  │  Task    │
  └────┬─────┘
       │
       │ [Delete Task]
       ▼
   [Deleted]
```

**Valid Transitions**:
1. Create → Active (is_completed = false)
2. Active → Completed (is_completed = true)
3. Completed → Active (is_completed = false) - user can uncomplete task
4. Active/Completed → Deleted (removed from database)

**Notes**:
- Tasks can toggle between completed and active states indefinitely
- Once deleted, task cannot be recovered (permanent deletion)
- Task title and description can be updated in any state (active or completed)

## Query Patterns

### User Isolation Enforcement

**Critical**: ALL task queries MUST filter by authenticated user_id to enforce isolation.

**Example Queries**:

1. **Get all tasks for a user**:
```sql
SELECT * FROM tasks
WHERE user_id = :authenticated_user_id
ORDER BY created_at DESC;
```

2. **Get a specific task** (with ownership check):
```sql
SELECT * FROM tasks
WHERE id = :task_id AND user_id = :authenticated_user_id;
```

3. **Update task** (with ownership check):
```sql
UPDATE tasks
SET title = :new_title,
    description = :new_description,
    is_completed = :is_completed,
    updated_at = NOW()
WHERE id = :task_id AND user_id = :authenticated_user_id;
```

4. **Delete task** (with ownership check):
```sql
DELETE FROM tasks
WHERE id = :task_id AND user_id = :authenticated_user_id;
```

**Security Note**: The `AND user_id = :authenticated_user_id` clause is MANDATORY in all task queries to prevent unauthorized access to other users' tasks.

## Migrations

### Initial Migration (Version 1)

**File**: `backend/alembic/versions/001_initial_schema.py`

**Operations**:
1. Create `users` table with all columns and constraints
2. Create `tasks` table with all columns and constraints
3. Create indexes on `users.email`, `tasks.user_id`, `tasks.created_at`
4. Create foreign key relationship `tasks.user_id → users.id` with ON DELETE CASCADE

**Rollback**: Drop `tasks` table first (due to foreign key), then drop `users` table

### Future Migrations

Potential future schema changes (out of scope for initial version):
- Add `tasks.due_date` column for task deadlines
- Add `tasks.priority` column for task prioritization
- Add `task_categories` table for task categorization
- Add `users.display_name` column for user profiles

## Performance Considerations

### Indexes

1. **users.email**: UNIQUE index enables fast lookup during login (O(log n) vs O(n))
2. **tasks.user_id**: INDEX enables fast filtering of user's tasks
3. **tasks.created_at**: INDEX supports efficient sorting by creation date

### Query Optimization

- Use connection pooling to reduce database connection overhead (Neon provides this)
- Implement pagination for large task lists (LIMIT/OFFSET or cursor-based)
- Use `SELECT` with specific columns instead of `SELECT *` where possible
- Consider adding composite index on (user_id, created_at) if sorting by date is common

### Scaling Considerations

- Database supports horizontal scaling via read replicas (Neon feature)
- Use database branching for testing migrations (Neon feature)
- Monitor slow queries and add indexes as needed
- Consider archiving completed tasks after a certain period (out of scope initially)

## Data Model Validation Checklist

✅ All entities from specification defined (User, Task)
✅ Primary keys defined for all tables (UUID)
✅ Foreign keys enforce referential integrity (Task → User)
✅ Constraints match specification requirements (max lengths, required fields)
✅ User isolation enforced via user_id filtering
✅ Timestamps for audit trail (created_at, updated_at)
✅ Indexes on frequently queried columns
✅ ON DELETE CASCADE prevents orphaned tasks
✅ Password security (hashed, never returned in responses)
✅ Type definitions match between backend (Python) and frontend (TypeScript)

## Summary

This data model provides a secure, scalable foundation for the multi-user Todo application. Key design decisions:

- **UUIDs** as primary keys for globally unique identifiers
- **Foreign key constraints** ensure referential integrity
- **ON DELETE CASCADE** automatically cleans up orphaned tasks
- **Indexes** on critical columns for query performance
- **User isolation** enforced via mandatory user_id filtering
- **Type safety** with SQLModel (backend) and TypeScript (frontend)
- **Audit trail** via created_at and updated_at timestamps

The model aligns with all constitutional principles and functional requirements, particularly Principle III (User Data Isolation) and Principle V (Reliable Data Persistence).
