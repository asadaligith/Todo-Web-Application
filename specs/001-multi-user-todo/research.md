# Research: Multi-User Todo Web Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-03
**Phase**: Phase 0 - Technology Research and Best Practices

## Overview

This document captures research findings for implementing a full-stack multi-user Todo application using Next.js 16+, FastAPI, Neon PostgreSQL, and Better Auth.

## Technology Decisions

### 1. Frontend Framework: Next.js 16+ with App Router

**Decision**: Use Next.js 16+ with App Router for the frontend application.

**Rationale**:
- App Router provides server-side rendering (SSR) and static site generation (SSG) out of the box
- Built-in API routes for Better Auth integration
- React Server Components reduce client-side JavaScript bundle size
- File-based routing simplifies navigation structure
- Automatic code splitting and optimization
- Strong TypeScript support for type safety
- Excellent developer experience with Fast Refresh
- Production-ready with Vercel deployment integration

**Alternatives Considered**:
- **Create React App (CRA)**: Simpler setup but lacks SSR, requires additional routing library, deprecated by React team
- **Vite + React**: Faster dev server but requires manual setup for routing, SSR, and build optimization
- **Remix**: Strong SSR capabilities but smaller ecosystem and less mature than Next.js

**Best Practices**:
- Use App Router route groups `(auth)` and `(dashboard)` to organize related routes
- Implement middleware for authentication checks on protected routes
- Use React Server Components by default, only add `'use client'` when needed for interactivity
- Implement loading states with `loading.tsx` files
- Handle errors with `error.tsx` boundary files
- Use `generateMetadata` for SEO-friendly meta tags

### 2. Backend Framework: FastAPI (Python)

**Decision**: Use FastAPI for the RESTful API backend.

**Rationale**:
- Automatic OpenAPI documentation generation (Swagger UI)
- Built-in request/response validation using Pydantic models
- Async support for high performance (ASGI)
- Type hints enable better IDE support and fewer runtime errors
- Dependency injection system simplifies testing and modularity
- Excellent performance comparable to Node.js frameworks
- Large ecosystem of Python libraries
- Easy integration with SQLModel for database operations

**Alternatives Considered**:
- **Django + DRF**: More batteries-included but heavier, ORM (Django ORM) less flexible than SQLModel
- **Flask**: Lighter but requires more manual setup, lacks async support and automatic validation
- **Express.js (Node)**: Good performance but less type safety, callback-based patterns more error-prone

**Best Practices**:
- Use APIRouter to organize endpoints by resource (auth, tasks)
- Implement dependency injection for database sessions and current user
- Use Pydantic models for request/response validation
- Create custom exception handlers for consistent error responses
- Implement middleware for CORS, JWT validation, and request logging
- Use async/await for all database operations
- Structure: Separate models, services (business logic), and API routes (controllers)

### 3. Database: Neon Serverless PostgreSQL

**Decision**: Use Neon Serverless PostgreSQL for data persistence.

**Rationale**:
- Serverless architecture with automatic scaling and connection pooling
- PostgreSQL compatibility ensures ACID transactions and data integrity
- Generous free tier suitable for development and small production deployments
- Branching feature enables database versioning (useful for testing migrations)
- Built-in connection pooling reduces overhead
- Low latency and high availability
- Easy integration with ORMs like SQLModel

**Alternatives Considered**:
- **Supabase**: Similar serverless Postgres, but includes additional features (auth, storage) we don't need, potentially overkill
- **AWS RDS Aurora Serverless**: More expensive, slower cold starts, over-engineered for this use case
- **MongoDB Atlas**: NoSQL approach lacks strong schema validation and ACID guarantees needed for user isolation

**Best Practices**:
- Use connection pooling (pgbouncer is built-in with Neon)
- Store DATABASE_URL in environment variables, never hardcode
- Use database migrations (Alembic) to version schema changes
- Implement database indexes on frequently queried columns (user_id, created_at)
- Use foreign key constraints to enforce referential integrity
- Enable SSL connections in production

### 4. ORM: SQLModel

**Decision**: Use SQLModel for database modeling and queries.

**Rationale**:
- Combines SQLAlchemy (mature ORM) with Pydantic (validation)
- Single model definition serves as both DB schema and API validation
- Type hints enable IDE autocomplete and type checking
- Async support via SQLAlchemy 2.0
- Compatible with Alembic for migrations
- Reduces code duplication (one model for DB + API)
- Created by FastAPI author, excellent integration

**Alternatives Considered**:
- **SQLAlchemy alone**: Requires separate Pydantic models for validation, more boilerplate
- **Tortoise ORM**: Newer, less mature, smaller community
- **Raw SQL**: More control but error-prone, no type safety, harder to maintain

**Best Practices**:
- Define models with type hints for all fields
- Use `Field()` for constraints (max_length, nullable, default values)
- Implement `__repr__` methods for debugging
- Use relationships to define foreign keys (one-to-many: User → Tasks)
- Separate DB models from API schemas when response needs differ from DB structure
- Use sessions with context managers for automatic commit/rollback

### 5. Authentication: Better Auth

**Decision**: Use Better Auth for JWT-based authentication on the frontend.

**Rationale**:
- Modern authentication library built specifically for Next.js App Router
- Supports multiple providers (email/password, OAuth) - flexible for future expansion
- Built-in JWT token generation and management
- TypeScript-first with excellent type safety
- Session management with secure HTTP-only cookies
- CSRF protection built-in
- Easy integration with Next.js API routes
- Active development and community support

**Alternatives Considered**:
- **NextAuth.js**: More mature but heavier, complex configuration, not optimized for App Router
- **Clerk**: Hosted service, vendor lock-in, additional cost, unnecessary for simple use case
- **Auth0**: External service, added latency, cost concerns, overkill for requirements

**Best Practices**:
- Store JWT secret in environment variables (`BETTER_AUTH_SECRET`)
- Use HTTP-only cookies to prevent XSS attacks
- Implement token expiration (24 hours as specified)
- Validate tokens on backend with shared secret
- Use middleware to protect routes requiring authentication
- Implement proper sign-out to clear tokens

### 6. JWT Verification on Backend

**Decision**: Implement custom JWT verification middleware in FastAPI using python-jose.

**Rationale**:
- Frontend (Better Auth) issues JWT tokens on successful login
- Backend must validate tokens on every protected endpoint
- Shared JWT_SECRET between frontend and backend enables verification
- python-jose is lightweight and well-maintained for JWT operations
- Middleware approach ensures consistent validation across all routes

**Alternatives Considered**:
- **OAuth2 with third-party provider**: Adds complexity, external dependency, not needed for simple auth
- **Session-based auth**: Requires server-side session storage, breaks stateless REST principles

**Best Practices**:
- Extract JWT from Authorization header (`Bearer <token>`)
- Verify token signature using shared secret
- Check token expiration claim (`exp`)
- Extract user ID from token claims for authorization
- Return 401 Unauthorized for invalid/expired tokens
- Return 403 Forbidden for valid tokens with insufficient permissions
- Use dependency injection to inject current user into route handlers

### 7. Styling: Tailwind CSS 4.x

**Decision**: Use Tailwind CSS for UI styling and responsive design.

**Rationale**:
- Utility-first approach enables rapid UI development
- Built-in responsive design utilities (mobile-first)
- Excellent dark mode support (useful for future enhancement)
- Tree-shaking removes unused styles, small production bundle
- Consistent design system via theme configuration
- No naming conflicts (no CSS class naming decisions)
- Strong community and component libraries (shadcn/ui compatible)

**Alternatives Considered**:
- **CSS Modules**: More verbose, requires naming decisions, less rapid development
- **Styled Components**: Runtime overhead, less optimal for SSR
- **Bootstrap**: Opinionated design, harder to customize, larger bundle

**Best Practices**:
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Extract common component styles to custom classes or components
- Configure theme in `tailwind.config.ts` for consistent colors, spacing
- Use semantic color names (primary, secondary, danger) not literal colors
- Ensure WCAG AA color contrast ratios
- Use `@apply` directive sparingly (prefer utility classes)

### 8. Password Hashing: passlib with bcrypt

**Decision**: Use passlib library with bcrypt algorithm for password hashing.

**Rationale**:
- bcrypt is industry-standard for password hashing
- Configurable work factor (cost) to stay ahead of hardware improvements
- Automatically generates and stores salt with hash
- passlib provides simple API: `hash()`, `verify()`
- Resistant to rainbow table and brute-force attacks
- Recommended by OWASP for password storage

**Alternatives Considered**:
- **Argon2**: Newer, slightly more secure, but less widely supported and tested
- **PBKDF2**: Older standard, less resistant to GPU attacks than bcrypt
- **scrypt**: Good alternative but less ecosystem support

**Best Practices**:
- Use bcrypt with rounds=12 minimum (balance security vs performance)
- Never log or expose password hashes
- Hash passwords before storing in database
- Use constant-time comparison to prevent timing attacks
- Consider password strength requirements (min 8 chars, letters + numbers per spec)

### 9. API Versioning

**Decision**: Implement API versioning with `/api/v1/` prefix.

**Rationale**:
- Enables future breaking changes without disrupting existing clients
- Clear contract between frontend and backend
- Industry best practice for RESTful APIs
- Easier to maintain backward compatibility

**Best Practices**:
- Start with `/api/v1/`
- Only increment major version for breaking changes
- Document version differences in API contract
- Consider deprecation warnings before removing old versions

### 10. Testing Strategy

**Decision**: Multi-layered testing approach.

**Backend Testing**:
- **Unit tests**: pytest for services and utilities (business logic)
- **Integration tests**: pytest with test database for API endpoints
- **Contract tests**: Validate API responses match OpenAPI specification

**Frontend Testing**:
- **Unit tests**: Jest + React Testing Library for components
- **Integration tests**: Test form submissions and API interactions
- **E2E tests**: Playwright for critical user journeys (register, login, CRUD tasks)

**Rationale**:
- Layered testing catches different classes of bugs
- Unit tests are fast and isolate logic
- Integration tests validate component interactions
- E2E tests validate complete user workflows
- Contract tests ensure frontend-backend compatibility

**Best Practices**:
- Test user isolation thoroughly (cannot access other users' tasks)
- Test authentication flows (register, login, token expiration)
- Test validation (empty titles, character limits)
- Use test fixtures for consistent test data
- Run tests in CI/CD pipeline before deployment
- Maintain >80% code coverage for critical paths

## Integration Architecture

### Authentication Flow

1. **Registration**:
   - User submits email + password via frontend form
   - Frontend validates input, sends POST to `/api/v1/auth/register` (FastAPI)
   - Backend hashes password with bcrypt, stores in DB
   - Returns success response
   - Frontend redirects to login

2. **Login**:
   - User submits email + password via frontend form
   - Better Auth generates JWT token with user ID claim
   - Token stored in HTTP-only cookie
   - Frontend redirects to dashboard

3. **Authenticated Requests**:
   - Frontend includes JWT in Authorization header: `Bearer <token>`
   - Backend middleware extracts token, verifies signature with shared secret
   - Middleware extracts user ID from claims, injects into request context
   - Route handlers use user ID to filter database queries

4. **Logout**:
   - Frontend clears JWT cookie
   - Redirects to login page

### Data Flow: Task Operations

1. **Create Task**:
   - User fills form → Frontend validates → POST `/api/v1/tasks` with JWT
   - Backend validates token → Extracts user ID → Creates task with owner=user_id
   - Returns created task → Frontend updates UI

2. **Read Tasks**:
   - Frontend sends GET `/api/v1/tasks` with JWT
   - Backend validates token → Filters `SELECT * FROM tasks WHERE user_id = <current_user>`
   - Returns only current user's tasks → Frontend displays list

3. **Update Task**:
   - User edits task → Frontend sends PUT `/api/v1/tasks/{id}` with JWT
   - Backend validates token → Checks task ownership → Updates if authorized
   - Returns updated task → Frontend updates UI

4. **Delete Task**:
   - User confirms deletion → Frontend sends DELETE `/api/v1/tasks/{id}` with JWT
   - Backend validates token → Checks task ownership → Deletes if authorized
   - Returns success → Frontend removes from UI

## Environment Configuration

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Authentication
JWT_SECRET=<shared-secret-between-frontend-and-backend>
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# API
API_V1_PREFIX=/api/v1
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Server
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=<shared-secret-between-frontend-and-backend>
BETTER_AUTH_URL=http://localhost:3000
```

## Security Considerations

### Backend Security

- **JWT Validation**: Verify signature, expiration on every request
- **User Isolation**: Filter all queries by `user_id` from JWT claims
- **Password Storage**: Use bcrypt with rounds=12
- **SQL Injection**: Prevented by SQLModel parameterized queries
- **Rate Limiting**: Implement on `/register` and `/login` to prevent brute force
- **CORS**: Whitelist only frontend origin
- **HTTPS**: Enforce in production
- **Environment Variables**: Never commit secrets to version control

### Frontend Security

- **XSS Prevention**: React escapes content by default, validate user inputs
- **CSRF Protection**: Better Auth provides built-in CSRF tokens
- **Token Storage**: HTTP-only cookies prevent JavaScript access
- **Input Validation**: Client-side validation for UX, server-side for security
- **Error Messages**: Don't expose sensitive info in errors
- **Content Security Policy**: Configure in `next.config.ts`

## Performance Optimizations

### Backend

- Use async database operations to avoid blocking
- Implement database connection pooling (Neon built-in)
- Add indexes on `user_id`, `created_at` columns
- Use pagination for large task lists (limit/offset)
- Enable gzip compression for responses

### Frontend

- Use React Server Components to reduce client-side JavaScript
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Use SWR or React Query for client-side caching
- Implement optimistic UI updates for better perceived performance
- Lazy load task list items for large lists

## Deployment Strategy

### Backend Deployment (Render)

- Deploy as containerized application (Dockerfile)
- Set environment variables in platform dashboard
- Enable auto-scaling based on CPU/memory
- Configure health check endpoint (`/health`)
- Set up logging and monitoring

### Frontend Deployment (Vercel)

- Connect GitHub repo for automatic deployments
- Set environment variables in Vercel dashboard
- Enable preview deployments for pull requests
- Configure custom domain with SSL
- Use Vercel Analytics for performance monitoring

### Database (Neon)

- Create production database separate from development
- Enable automatic backups
- Set up read replicas if needed for scale
- Monitor connection pool usage
- Use database branching for testing migrations

## Summary

This research establishes a solid technical foundation for building a secure, scalable, and maintainable multi-user Todo application. The selected technologies (Next.js, FastAPI, Neon, Better Auth) work together to enforce the constitutional principles while providing excellent developer experience and production readiness.

**Key Takeaways**:
- Monorepo structure with clear frontend/backend separation
- JWT-based authentication with shared secret for stateless API
- User isolation enforced at database query level
- Type safety across the stack (TypeScript + Python type hints)
- Industry best practices for security (bcrypt, JWT validation, HTTPS)
- Scalable serverless architecture with Neon PostgreSQL
- Comprehensive testing strategy for quality assurance

All decisions align with constitutional principles and specification requirements.
