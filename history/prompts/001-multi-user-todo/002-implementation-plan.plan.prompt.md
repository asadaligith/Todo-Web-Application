---
id: 002
title: Multi-User Todo Implementation Plan
stage: plan
date: 2026-01-03
surface: agent
model: claude-sonnet-4-5
feature: 001-multi-user-todo
branch: 001-multi-user-todo
user: unknown
command: /sp.plan
labels: ["plan", "architecture", "nextjs", "fastapi", "neon", "postgresql", "jwt", "better-auth"]
links:
  spec: specs/001-multi-user-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-multi-user-todo/plan.md
  - specs/001-multi-user-todo/research.md
  - specs/001-multi-user-todo/data-model.md
  - specs/001-multi-user-todo/contracts/api-spec.yaml
  - specs/001-multi-user-todo/contracts/README.md
  - specs/001-multi-user-todo/quickstart.md
  - CLAUDE.md
tests:
  - none
---

## Prompt

```text
Implement the Todo application as a full-stack monorepo.

Architecture:
- Frontend: Next.js 16+ using App Router
- Backend: Python FastAPI
- Database: Neon Serverless PostgreSQL
- ORM: SQLModel
- Authentication: Better Auth with JWT tokens

Design Decisions:
- Monorepo structure enabling shared context between frontend and backend
- RESTful API implemented in FastAPI and consumed by Next.js
- JWT tokens issued by Better Auth on the frontend
- JWT verification middleware in FastAPI backend
- All API endpoints require valid authentication
- Task queries are filtered by authenticated user ID
- Shared JWT secret configured via environment variables
- Database schema defined using SQLModel
- API contracts strictly follow defined specifications
```

## Response snapshot

Created comprehensive implementation plan with complete technical architecture, research, data model, API contracts, and deployment guide.

**Planning Phases Completed**:

**Phase 0 - Research** (`research.md`):
- 10 technology decisions documented with rationale and alternatives
- Next.js 16+ App Router for frontend (SSR, RSC, file-based routing)
- FastAPI for backend (async, auto-validation, OpenAPI docs)
- Neon Serverless PostgreSQL (ACID, auto-scaling, branching)
- SQLModel ORM (combines SQLAlchemy + Pydantic)
- Better Auth for JWT authentication (Next.js App Router optimized)
- Tailwind CSS for responsive UI
- bcrypt for password hashing
- Comprehensive security, performance, and deployment strategies

**Phase 1 - Design** (data-model, contracts, quickstart):

1. **Data Model** (`data-model.md`):
   - 2 entities: User, Task
   - UUID primary keys for global uniqueness
   - Foreign key `tasks.user_id → users.id` with ON DELETE CASCADE
   - Indexes on `user_id`, `email`, `created_at` for performance
   - All queries MUST filter by authenticated user ID
   - SQLModel definitions with relationships
   - TypeScript type definitions for frontend
   - Validation rules and state transitions documented

2. **API Contracts** (`contracts/api-spec.yaml`, `contracts/README.md`):
   - OpenAPI 3.1.0 specification with 7 endpoints
   - **Auth endpoints**: POST /auth/register, POST /auth/login
   - **Task endpoints**: GET/POST /tasks, GET/PUT/DELETE /tasks/{id}
   - Bearer JWT authentication on all task endpoints
   - Comprehensive request/response schemas
   - Error responses with consistent format
   - Status codes: 200, 201, 204, 400, 401, 403, 404, 500
   - Interactive examples and cURL commands

3. **Quickstart Guide** (`quickstart.md`):
   - Step-by-step local development setup (20-30 min)
   - Neon database creation and configuration
   - Backend setup: venv, dependencies, migrations, server start
   - Frontend setup: npm install, env config, dev server
   - Testing workflow: register, login, CRUD tasks, user isolation
   - Troubleshooting guide for common issues
   - Environment variable reference tables

**Project Structure**:
- Monorepo: `backend/` (FastAPI) + `frontend/` (Next.js)
- Backend: `src/models`, `src/services`, `src/api/routes`, `src/middleware`, `src/core`
- Frontend: `app/` (App Router), `components/`, `lib/`, `types/`
- Shared: type definitions for API contracts

**Technical Context**:
- Languages: Python 3.11+, TypeScript 5.x, Node.js 20+
- Key dependencies: FastAPI 0.115+, SQLModel 0.0.22+, Next.js 16+, Better Auth 1.x
- Performance goals: <500ms API response, <3s page load, 100 concurrent users
- Constraints: All endpoints require JWT (except auth), user_id filtering mandatory

**Constitutional Compliance**:
- ✅ Pre-design check: All 9 principles passed
- ✅ Post-design check: All 9 principles verified and passed
- ✅ Gate status: CLEARED FOR IMPLEMENTATION

**Agent Context Updated**:
- Added technologies to `CLAUDE.md`: Python 3.11+, TypeScript 5.x, Node.js 20+, Neon PostgreSQL

## Outcome

- ✅ Impact: Complete implementation plan with architecture, research, data model, API contracts, and deployment guide ready
- 🧪 Tests: No tests required for planning phase
- 📁 Files: Created plan.md, research.md, data-model.md, contracts/ (api-spec.yaml, README.md), quickstart.md; Updated CLAUDE.md
- 🔁 Next prompts: Run `/sp.tasks` to generate actionable, dependency-ordered implementation tasks
- 🧠 Reflection: Comprehensive planning completed with zero ambiguities. All constitutional principles verified. Architecture decisions well-researched with documented alternatives. Data model enforces user isolation via foreign keys and query filtering. API contracts formally specified in OpenAPI 3.1. Quickstart provides clear 20-30 min setup path. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully
- Graders run and results (PASS/FAIL): Constitution check PASSED (9/9 principles, both pre-design and post-design)
- Prompt variant (if applicable): Standard implementation planning with user-provided architecture decisions
- Next experiment (smallest change to try): Generate tasks with `/sp.tasks` and validate task breakdown aligns with user stories and architecture
