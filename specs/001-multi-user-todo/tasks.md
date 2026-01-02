# Tasks: Multi-User Todo Web Application

**Input**: Design documents from `/specs/001-multi-user-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are omitted per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/app/`
- Paths shown below follow monorepo web application structure per plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create root-level project structure (backend/, frontend/, shared/ directories)
- [ ] T002 [P] Initialize backend Python project with requirements.txt and .env.example
- [ ] T003 [P] Initialize frontend Next.js project with package.json and .env.local.example
- [ ] T004 [P] Create backend/src/ directory structure (models/, services/, api/routes/, middleware/, core/)
- [ ] T005 [P] Create frontend directory structure (app/, components/, lib/, types/)
- [ ] T006 [P] Configure Python virtual environment and install FastAPI dependencies in backend/
- [ ] T007 [P] Install Next.js dependencies and configure TypeScript in frontend/
- [ ] T008 [P] Configure Tailwind CSS in frontend/tailwind.config.ts and frontend/app/globals.css
- [ ] T009 [P] Create .gitignore for root, backend/, and frontend/ directories
- [ ] T010 Create root README.md with project overview and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Configure environment variables in backend/.env for DATABASE_URL, JWT_SECRET, CORS_ORIGINS
- [ ] T012 Configure environment variables in frontend/.env.local for NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET
- [ ] T013 Create backend/src/core/config.py to load settings from environment variables using Pydantic BaseSettings
- [ ] T014 Create backend/src/core/database.py for Neon PostgreSQL connection and SQLModel session management
- [ ] T015 Create backend/src/core/security.py with password hashing utilities (bcrypt) and JWT token creation/verification functions
- [ ] T016 Initialize Alembic in backend/alembic/ for database migrations
- [ ] T017 Create initial Alembic migration (001_initial_schema.py) for users and tasks tables per data-model.md
- [ ] T018 Apply Alembic migration to create database schema in Neon PostgreSQL
- [ ] T019 Create backend/src/middleware/error_handler.py for global exception handling with consistent error response format
- [ ] T020 Create backend/src/middleware/auth_middleware.py for JWT token validation and user extraction from claims
- [ ] T021 Create backend/src/api/dependencies.py for dependency injection (get_db session, get_current_user)
- [ ] T022 Create backend/src/main.py FastAPI application with CORS middleware configured for frontend origin
- [ ] T023 [P] Configure Better Auth in frontend/lib/auth/config.ts with JWT secret matching backend
- [ ] T024 [P] Create frontend/app/api/auth/[...all]/route.ts for Better Auth API handler
- [ ] T025 [P] Create frontend/lib/services/api-client.ts base HTTP client with automatic JWT token attachment from Better Auth
- [ ] T026 [P] Create frontend/types/user.ts and frontend/types/task.ts TypeScript type definitions matching API contracts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Account Creation and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to register accounts, authenticate via JWT tokens, and access a protected dashboard

**Independent Test**: A user can register a new account with email + password, receive confirmation, sign in with credentials, and be redirected to an empty task dashboard. Authentication persists across sessions and user can sign out successfully.

### Implementation for User Story 1

- [ ] T027 [P] [US1] Create backend/src/models/user.py User model with SQLModel (id, email, hashed_password, timestamps)
- [ ] T028 [P] [US1] Create backend/src/services/auth_service.py with register_user function (hash password, create user record)
- [ ] T029 [US1] Add login_user function to backend/src/services/auth_service.py (verify password, generate JWT token)
- [ ] T030 [US1] Create backend/src/api/routes/auth.py with POST /api/v1/auth/register endpoint calling auth_service.register_user
- [ ] T031 [US1] Add POST /api/v1/auth/login endpoint to backend/src/api/routes/auth.py calling auth_service.login_user
- [ ] T032 [US1] Register auth router in backend/src/main.py FastAPI app with /api/v1 prefix
- [ ] T033 [US1] Add email format validation and password strength validation (min 8 chars, letters + numbers) to auth endpoints
- [ ] T034 [US1] Implement error handling for duplicate email (409 Conflict) and invalid credentials (401 Unauthorized) in auth routes
- [ ] T035 [P] [US1] Create frontend/components/auth/RegisterForm.tsx with email and password inputs and form validation
- [ ] T036 [P] [US1] Create frontend/components/auth/LoginForm.tsx with email and password inputs
- [ ] T037 [P] [US1] Create frontend/app/(auth)/register/page.tsx using RegisterForm component
- [ ] T038 [P] [US1] Create frontend/app/(auth)/login/page.tsx using LoginForm component
- [ ] T039 [US1] Create frontend/app/(dashboard)/layout.tsx with authentication check redirecting unauthenticated users to /login
- [ ] T040 [US1] Create frontend/app/(dashboard)/tasks/page.tsx empty task dashboard with "No tasks yet" empty state
- [ ] T041 [US1] Implement sign-out functionality in frontend using Better Auth session clearing
- [ ] T042 [US1] Add session persistence so authenticated users remain logged in after page refresh
- [ ] T043 [US1] Display validation error messages in RegisterForm for weak passwords and invalid emails
- [ ] T044 [US1] Display authentication error messages in LoginForm for invalid credentials

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (register, login, dashboard access, sign out)

---

## Phase 4: User Story 2 - Create and View Personal Tasks (Priority: P2)

**Goal**: Enable authenticated users to create new tasks and view their complete personal task list with strict user isolation

**Independent Test**: After signing in, a user can create multiple tasks with titles and descriptions, then view all their created tasks in a list. The user sees only their own tasks, never tasks created by other users. Empty state displays when no tasks exist.

### Implementation for User Story 2

- [ ] T045 [P] [US2] Create backend/src/models/task.py Task model with SQLModel (id, user_id FK, title, description, is_completed, timestamps)
- [ ] T046 [US2] Add relationship between User and Task models (one-to-many with cascade delete)
- [ ] T047 [P] [US2] Create backend/src/services/task_service.py with create_task function (validates user_id, enforces ownership)
- [ ] T048 [US2] Add get_user_tasks function to backend/src/services/task_service.py (filters WHERE user_id = current_user)
- [ ] T049 [US2] Create backend/src/api/routes/tasks.py with POST /api/v1/tasks endpoint calling task_service.create_task
- [ ] T050 [US2] Add GET /api/v1/tasks endpoint to backend/src/api/routes/tasks.py calling task_service.get_user_tasks
- [ ] T051 [US2] Register tasks router in backend/src/main.py with JWT authentication dependency on all endpoints
- [ ] T052 [US2] Add validation for task title (required, max 200 chars, non-whitespace) and description (max 2000 chars) in task endpoints
- [ ] T053 [US2] Implement error handling for validation errors (400 Bad Request) with field-specific error details
- [ ] T054 [P] [US2] Create frontend/lib/services/taskService.ts with createTask and getTasks API functions using api-client
- [ ] T055 [P] [US2] Create frontend/components/tasks/TaskForm.tsx with title and description inputs for creating tasks
- [ ] T056 [P] [US2] Create frontend/components/tasks/TaskItem.tsx to display individual task with title, description, completion status
- [ ] T057 [US2] Create frontend/components/tasks/TaskList.tsx to display array of tasks using TaskItem components
- [ ] T058 [US2] Update frontend/app/(dashboard)/tasks/page.tsx to fetch and display user's tasks using TaskList
- [ ] T059 [US2] Add "Add Task" button and modal/form to frontend/app/(dashboard)/tasks/page.tsx using TaskForm
- [ ] T060 [US2] Implement optimistic UI update when creating task (add to list immediately, rollback on error)
- [ ] T061 [US2] Display empty state message "No tasks yet. Create your first task!" when task list is empty
- [ ] T062 [US2] Add loading state indicator while fetching tasks from API
- [ ] T063 [US2] Verify user isolation: Ensure backend returns only tasks where user_id matches authenticated user
- [ ] T064 [US2] Display task creation timestamp and format dates in user-friendly format (e.g., "2 hours ago")

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (register/login + create/view tasks)

---

## Phase 5: User Story 3 - Update and Complete Tasks (Priority: P3)

**Goal**: Enable users to modify existing task details and toggle completion status with changes persisting across sessions

**Independent Test**: A user can select any of their existing tasks, edit the title or description, save changes, and mark the task as complete or incomplete. Changes persist when user signs out and signs back in.

### Implementation for User Story 3

- [ ] T065 [P] [US3] Add update_task function to backend/src/services/task_service.py (validates ownership before update)
- [ ] T066 [US3] Add get_task_by_id function to backend/src/services/task_service.py (filters by user_id and task_id)
- [ ] T067 [US3] Create GET /api/v1/tasks/{taskId} endpoint in backend/src/api/routes/tasks.py with ownership validation
- [ ] T068 [US3] Create PUT /api/v1/tasks/{taskId} endpoint in backend/src/api/routes/tasks.py calling task_service.update_task
- [ ] T069 [US3] Implement 403 Forbidden error when user attempts to access task owned by another user
- [ ] T070 [US3] Implement 404 Not Found error when task does not exist or doesn't belong to user
- [ ] T071 [US3] Add validation for partial updates (only update provided fields, not all required)
- [ ] T072 [US3] Update updated_at timestamp automatically when task is modified
- [ ] T073 [P] [US3] Add updateTask function to frontend/lib/services/taskService.ts
- [ ] T074 [P] [US3] Create frontend/components/tasks/TaskEditForm.tsx with pre-filled title and description for editing
- [ ] T075 [US3] Add edit button/icon to frontend/components/tasks/TaskItem.tsx that opens TaskEditForm modal
- [ ] T076 [US3] Implement save functionality in TaskEditForm that calls taskService.updateTask and updates UI
- [ ] T077 [US3] Add completion checkbox/button to frontend/components/tasks/TaskItem.tsx that toggles is_completed
- [ ] T078 [US3] Update TaskItem visual styling to show completed tasks (strikethrough title, checkmark icon, muted color)
- [ ] T079 [US3] Implement optimistic UI update for task edits and completion toggle (update immediately, rollback on error)
- [ ] T080 [US3] Add cancel button to TaskEditForm that closes modal without saving changes
- [ ] T081 [US3] Display validation error when user tries to save task with empty title
- [ ] T082 [US3] Verify changes persist by signing out and signing back in after editing/completing tasks

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently (auth + create/view + edit/complete)

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to permanently remove tasks with confirmation prompt to prevent accidental deletion

**Independent Test**: A user can select any of their tasks and delete it. A confirmation prompt appears before deletion. Once confirmed, the task is permanently removed and does not reappear after sign out/sign in. Deletion only affects current user's tasks.

### Implementation for User Story 4

- [ ] T083 [US4] Add delete_task function to backend/src/services/task_service.py (validates ownership before delete)
- [ ] T084 [US4] Create DELETE /api/v1/tasks/{taskId} endpoint in backend/src/api/routes/tasks.py calling task_service.delete_task
- [ ] T085 [US4] Implement 403 Forbidden error when user attempts to delete task owned by another user
- [ ] T086 [US4] Return 204 No Content on successful deletion (no response body)
- [ ] T087 [P] [US4] Add deleteTask function to frontend/lib/services/taskService.ts
- [ ] T088 [P] [US4] Create frontend/components/tasks/TaskDeleteConfirm.tsx confirmation modal with "Cancel" and "Delete" buttons
- [ ] T089 [US4] Add delete button/icon to frontend/components/tasks/TaskItem.tsx that opens TaskDeleteConfirm modal
- [ ] T090 [US4] Implement delete functionality that calls taskService.deleteTask after user confirms
- [ ] T091 [US4] Remove deleted task from UI immediately (optimistic update, rollback on error)
- [ ] T092 [US4] Close TaskDeleteConfirm modal after successful deletion
- [ ] T093 [US4] Display error message if deletion fails (e.g., network error, task not found)
- [ ] T094 [US4] Verify deleted task does not reappear after sign out and sign in
- [ ] T095 [US4] Verify deleting one user's task has no effect on another user's task list (user isolation)

**Checkpoint**: All user stories should now be independently functional (auth + CRUD complete)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall application quality

- [ ] T096 [P] Add loading spinners/skeletons to all async operations (login, task fetch, create, update, delete)
- [ ] T097 [P] Implement toast notifications for success/error messages using a notification library
- [ ] T098 [P] Add form field validation with real-time feedback (email format, password strength, task title length)
- [ ] T099 [P] Implement responsive design breakpoints for mobile (375px), tablet (768px), and desktop (1920px) viewports
- [ ] T100 [P] Add keyboard navigation support (Tab to navigate, Enter to submit forms, Escape to close modals)
- [ ] T101 [P] Implement ARIA attributes for screen reader accessibility (labels, roles, announcements)
- [ ] T102 [P] Ensure color contrast meets WCAG AA standards for all text and interactive elements
- [ ] T103 Add rate limiting to backend authentication endpoints (5 requests per minute per IP)
- [ ] T104 Configure CORS in backend to only allow requests from frontend origin (http://localhost:3000 dev, production domain)
- [ ] T105 Add request logging middleware to backend for debugging and monitoring
- [ ] T106 Implement proper error boundaries in frontend to catch and display React errors gracefully
- [ ] T107 Add meta tags and SEO optimization to frontend pages (title, description, Open Graph tags)
- [ ] T108 [P] Create frontend/components/ui/ reusable components (Button, Input, Card, Modal) with consistent styling
- [ ] T109 Add password visibility toggle (eye icon) to password input fields in RegisterForm and LoginForm
- [ ] T110 Implement backend health check endpoint GET /health for monitoring and deployment verification
- [ ] T111 [P] Create comprehensive README.md files for backend/ and frontend/ with setup instructions
- [ ] T112 Add environment variable validation at startup (fail fast if required vars missing)
- [ ] T113 Configure production environment variables templates (.env.production.example)
- [ ] T114 Implement database connection pooling configuration in backend/src/core/database.py
- [ ] T115 Add logout button to dashboard header/nav that calls sign-out functionality
- [ ] T116 Display current user's email in dashboard header for user awareness
- [ ] T117 Implement session timeout warning (show modal 5 minutes before JWT expiration)
- [ ] T118 Add task sorting options (by creation date, alphabetical, completion status)
- [ ] T119 Implement filter to show only active tasks or only completed tasks
- [ ] T120 Add task count badge showing total tasks and completed tasks
- [ ] T121 Verify quickstart.md instructions by following setup steps from scratch
- [ ] T122 Run manual end-to-end test following all acceptance scenarios from spec.md
- [ ] T123 Verify all constitutional principles are implemented (check each of the 9 principles)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires authentication from US1 to test but can be implemented independently
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Requires tasks from US2 to test but can be implemented independently
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Requires tasks from US2 to test but can be implemented independently

### Within Each User Story

- Models before services (services depend on models)
- Services before API routes (routes call services)
- Backend endpoints before frontend integration (frontend needs working API)
- Core implementation before UI polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T009)
- All Foundational tasks marked [P] can run in parallel within Phase 2 (T023-T026)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel (T027, T045)
- Frontend components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- All Polish tasks marked [P] can run in parallel (T096-T102, T108, T111)

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes, these User Story 1 tasks can run in parallel:
Task T027: Create User model (backend/src/models/user.py)
Task T028: Create auth_service.register_user (backend/src/services/auth_service.py)
Task T035: Create RegisterForm component (frontend/components/auth/RegisterForm.tsx)
Task T036: Create LoginForm component (frontend/components/auth/LoginForm.tsx)

# These run sequentially after models/forms are done:
Task T030: POST /register endpoint (depends on T027, T028)
Task T031: POST /login endpoint (depends on T027, T029)
Task T037: Register page (depends on T035)
Task T038: Login page (depends on T036)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T026) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T027-T044)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Register new account with valid credentials → Success
   - Register with existing email → 409 Conflict error
   - Register with weak password → 400 Validation error
   - Login with correct credentials → Redirect to dashboard
   - Login with wrong credentials → 401 Unauthorized error
   - Session persists after page refresh → Still logged in
   - Sign out → Redirected to login, cannot access dashboard
5. Deploy/demo if ready (MVP with authentication complete!)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - authentication)
3. Add User Story 2 → Test independently → Deploy/Demo (create/view tasks)
4. Add User Story 3 → Test independently → Deploy/Demo (edit/complete tasks)
5. Add User Story 4 → Test independently → Deploy/Demo (delete tasks)
6. Add Polish (Phase 7) → Final production-ready deployment
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T026)
2. Once Foundational is done:
   - Developer A: User Story 1 (T027-T044) - Authentication
   - Developer B: User Story 2 (T045-T064) - Create/View (needs US1 auth to test)
   - Developer C: User Story 3 (T065-T082) - Update/Complete (needs US1 + US2 to test)
   - Developer D: User Story 4 (T083-T095) - Delete (needs US1 + US2 to test)
3. Stories complete and integrate independently
4. Team works on Polish together (T096-T123)

**Note**: While US2, US3, US4 can be implemented in parallel, they require US1 authentication to be functional for testing. Developers can implement backend models/services/routes independently, but frontend integration testing requires US1 auth flow to be complete.

---

## Notes

- **[P] tasks** = different files, no dependencies on incomplete tasks
- **[Story] label** maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable once Foundational phase is done
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All file paths are explicit and follow the monorepo structure defined in plan.md
- Tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- Total tasks: 123 (10 Setup, 16 Foundational, 18 US1, 20 US2, 18 US3, 13 US4, 28 Polish)
