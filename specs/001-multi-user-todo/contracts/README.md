# API Contracts: Multi-User Todo Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-03
**API Version**: v1

## Overview

This directory contains the RESTful API contract specifications for the multi-user Todo application. The API follows REST principles, uses JWT authentication, and enforces strict user isolation.

## API Specification

- **Format**: OpenAPI 3.1.0
- **File**: [api-spec.yaml](./api-spec.yaml)
- **Base URL**: `/api/v1`
- **Authentication**: Bearer JWT token

## Quick Reference

### Base URL

- **Local Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.yourdomain.com/api/v1`

### Authentication

All endpoints except `/auth/register` and `/auth/login` require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints Summary

### Authentication Endpoints

| Method | Endpoint          | Description                | Auth Required |
|--------|-------------------|----------------------------|---------------|
| POST   | /auth/register    | Create new user account    | No            |
| POST   | /auth/login       | Login and get JWT token    | No            |

### Task Endpoints

| Method | Endpoint          | Description                     | Auth Required |
|--------|-------------------|---------------------------------|---------------|
| GET    | /tasks            | Get all tasks for current user  | Yes           |
| POST   | /tasks            | Create a new task               | Yes           |
| GET    | /tasks/{taskId}   | Get a specific task             | Yes           |
| PUT    | /tasks/{taskId}   | Update a task                   | Yes           |
| DELETE | /tasks/{taskId}   | Delete a task                   | Yes           |

## Request/Response Examples

### 1. Register New User

**Request**:
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2026-01-03T10:30:00Z",
  "updatedAt": "2026-01-03T10:30:00Z"
}
```

**Error Response** (409 Conflict - Email already exists):
```json
{
  "error": "ConflictError",
  "message": "An account with this email already exists"
}
```

---

### 2. Login

**Request**:
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwiZXhwIjoxNzM1OTkyNjAwfQ.signature",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "createdAt": "2026-01-03T10:30:00Z",
    "updatedAt": "2026-01-03T10:30:00Z"
  }
}
```

**Error Response** (401 Unauthorized - Invalid credentials):
```json
{
  "error": "AuthenticationError",
  "message": "Invalid email or password"
}
```

---

### 3. Create Task

**Request**:
```http
POST /api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and vegetables"
}
```

**Response** (201 Created):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and vegetables",
  "isCompleted": false,
  "createdAt": "2026-01-03T10:35:00Z",
  "updatedAt": "2026-01-03T10:35:00Z"
}
```

**Error Response** (400 Bad Request - Validation error):
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "details": {
    "title": "Title is required and must not be empty"
  }
}
```

---

### 4. Get All Tasks

**Request**:
```http
GET /api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, and vegetables",
      "isCompleted": false,
      "createdAt": "2026-01-03T10:35:00Z",
      "updatedAt": "2026-01-03T10:35:00Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Finish project report",
      "description": null,
      "isCompleted": true,
      "createdAt": "2026-01-02T14:20:00Z",
      "updatedAt": "2026-01-03T09:15:00Z"
    }
  ],
  "total": 2
}
```

---

### 5. Get Specific Task

**Request**:
```http
GET /api/v1/tasks/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and vegetables",
  "isCompleted": false,
  "createdAt": "2026-01-03T10:35:00Z",
  "updatedAt": "2026-01-03T10:35:00Z"
}
```

**Error Response** (403 Forbidden - Task belongs to another user):
```json
{
  "error": "ForbiddenError",
  "message": "You do not have permission to access this task"
}
```

**Error Response** (404 Not Found):
```json
{
  "error": "NotFoundError",
  "message": "Task not found"
}
```

---

### 6. Update Task

**Request**:
```http
PUT /api/v1/tasks/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Buy groceries and cook dinner",
  "isCompleted": true
}
```

**Response** (200 OK):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries and cook dinner",
  "description": "Milk, eggs, bread, and vegetables",
  "isCompleted": true,
  "createdAt": "2026-01-03T10:35:00Z",
  "updatedAt": "2026-01-03T11:45:00Z"
}
```

**Note**: Only provided fields are updated. In this example, `description` was not changed.

---

### 7. Delete Task

**Request**:
```http
DELETE /api/v1/tasks/660e8400-e29b-41d4-a716-446655440001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (204 No Content):
```
(empty response body)
```

**Error Response** (403 Forbidden - Task belongs to another user):
```json
{
  "error": "ForbiddenError",
  "message": "You do not have permission to access this task"
}
```

## HTTP Status Codes

### Success Codes

- **200 OK**: Request succeeded (GET, PUT)
- **201 Created**: Resource created successfully (POST)
- **204 No Content**: Resource deleted successfully (DELETE)

### Client Error Codes

- **400 Bad Request**: Validation error (invalid input)
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid token but insufficient permissions (e.g., trying to access another user's task)
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource conflict (e.g., email already registered)

### Server Error Codes

- **500 Internal Server Error**: Unexpected server error

## Error Response Format

All error responses follow this consistent format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": {
    "field": "Field-specific error message"
  }
}
```

- `error`: Machine-readable error type (e.g., `ValidationError`, `AuthenticationError`)
- `message`: Human-readable error description
- `details`: (Optional) Additional context, such as field-level validation errors

## Security & Authorization

### Authentication

1. **Register** a new account via `/auth/register`
2. **Login** via `/auth/login` to receive a JWT token
3. **Include token** in the `Authorization: Bearer <token>` header for all protected endpoints

### User Isolation

- All task endpoints automatically filter by the authenticated user's ID (extracted from JWT)
- Users can ONLY access their own tasks
- Attempting to access another user's task returns `403 Forbidden`

### Token Expiration

- JWT tokens expire after **24 hours** (86400 seconds)
- Frontend should handle token expiration and prompt re-login
- Expired tokens return `401 Unauthorized`

## Validation Rules

### User Registration

- **Email**: Must be valid email format, max 255 characters, unique
- **Password**: Min 8 characters, max 128 characters, must contain both letters and numbers

### Task Creation/Update

- **Title**: Required, min 1 non-whitespace character, max 200 characters
- **Description**: Optional, max 2000 characters if provided
- **isCompleted**: Boolean (true or false)

## Rate Limiting

(To be implemented in production)

- **Auth endpoints** (`/auth/register`, `/auth/login`): 5 requests per minute per IP
- **Task endpoints**: 100 requests per minute per authenticated user

## CORS Configuration

Allowed origins (configured in backend):

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Testing the API

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

**Create Task** (replace `<TOKEN>` with actual JWT):
```bash
curl -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Test description"}'
```

### Using Swagger UI

Once the backend is running, access the interactive API documentation:

```
http://localhost:8000/docs
```

Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Schema validation
- Authentication token management

## Versioning

- Current version: **v1**
- API version is included in the URL: `/api/v1/...`
- Breaking changes will increment the major version (e.g., `/api/v2/...`)
- Backward compatibility will be maintained within the same major version

## Change Log

### Version 1.0.0 (2026-01-03)

- Initial API contract
- Authentication endpoints (register, login)
- Task CRUD endpoints (create, read, update, delete)
- JWT-based authentication
- User isolation enforcement

## References

- **OpenAPI Specification**: [api-spec.yaml](./api-spec.yaml)
- **Data Model**: [../data-model.md](../data-model.md)
- **Feature Specification**: [../spec.md](../spec.md)
- **Implementation Plan**: [../plan.md](../plan.md)
