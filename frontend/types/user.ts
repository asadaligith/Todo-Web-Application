/**
 * User-related TypeScript type definitions matching backend API contracts.
 */

export interface User {
  id: string
  email: string
  createdAt: string // ISO 8601 datetime string
  updatedAt: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface AuthError {
  error: string
  message: string
  details?: Array<{
    field: string
    message: string
  }>
}
