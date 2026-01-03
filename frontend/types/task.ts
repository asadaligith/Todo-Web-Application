/**
 * Task-related TypeScript type definitions matching backend API contracts.
 */

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string // ISO 8601 datetime string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  isCompleted?: boolean
}

export interface TaskResponse {
  id: string
  userId: string
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskListResponse {
  tasks: Task[]
  total: number
}

export interface TaskError {
  error: string
  message: string
  details?: Array<{
    field: string
    message: string
  }>
}
