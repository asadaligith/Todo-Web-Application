/**
 * Task service for API calls related to task operations.
 */

import apiClient from "./api-client"
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from "@/types/task"

const API_V1_PREFIX = "/api/v1"

/**
 * Transform backend snake_case response to frontend camelCase.
 */
function transformTaskFromAPI(apiTask: any): Task {
  return {
    id: apiTask.id,
    userId: apiTask.user_id,
    title: apiTask.title,
    description: apiTask.description,
    isCompleted: apiTask.is_completed,
    createdAt: apiTask.created_at,
    updatedAt: apiTask.updated_at,
  }
}

/**
 * Create a new task for the authenticated user.
 *
 * @param taskData - Task creation data (title and optional description)
 * @returns Created task
 * @throws Error if creation fails
 */
export async function createTask(taskData: CreateTaskRequest): Promise<Task> {
  try {
    const response = await apiClient.post<TaskResponse>(
      `${API_V1_PREFIX}/tasks`,
      taskData
    )
    return transformTaskFromAPI(response.data)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create task. Please try again."
    )
  }
}

/**
 * Get all tasks for the authenticated user.
 *
 * @param skip - Number of tasks to skip (pagination)
 * @param limit - Maximum number of tasks to return
 * @returns List of user's tasks
 * @throws Error if retrieval fails
 */
export async function getTasks(
  skip: number = 0,
  limit: number = 100
): Promise<Task[]> {
  try {
    const response = await apiClient.get<TaskResponse[]>(
      `${API_V1_PREFIX}/tasks`,
      {
        params: { skip, limit },
      }
    )
    return response.data.map(transformTaskFromAPI)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch tasks. Please try again."
    )
  }
}

/**
 * Get a specific task by ID.
 *
 * @param taskId - Task UUID
 * @returns Task details
 * @throws Error if retrieval fails or task not found
 */
export async function getTaskById(taskId: string): Promise<Task> {
  try {
    const response = await apiClient.get<TaskResponse>(
      `${API_V1_PREFIX}/tasks/${taskId}`
    )
    return transformTaskFromAPI(response.data)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch task. Please try again."
    )
  }
}

/**
 * Update an existing task (partial updates allowed).
 *
 * @param taskId - Task UUID
 * @param taskData - Task update data
 * @returns Updated task
 * @throws Error if update fails
 */
export async function updateTask(
  taskId: string,
  taskData: UpdateTaskRequest
): Promise<Task> {
  try {
    const response = await apiClient.put<TaskResponse>(
      `${API_V1_PREFIX}/tasks/${taskId}`,
      taskData
    )
    return transformTaskFromAPI(response.data)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update task. Please try again."
    )
  }
}

/**
 * Delete a task permanently.
 *
 * @param taskId - Task UUID
 * @throws Error if deletion fails
 */
export async function deleteTask(taskId: string): Promise<void> {
  try {
    await apiClient.delete(`${API_V1_PREFIX}/tasks/${taskId}`)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete task. Please try again."
    )
  }
}

/**
 * Toggle task completion status.
 *
 * @param taskId - Task UUID
 * @param isCompleted - New completion status
 * @returns Updated task
 */
export async function toggleTaskCompletion(
  taskId: string,
  isCompleted: boolean
): Promise<Task> {
  return updateTask(taskId, { isCompleted })
}
