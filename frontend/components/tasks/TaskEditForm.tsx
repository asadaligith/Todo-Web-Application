"use client"

import { useState, useEffect } from "react"
import { Task, UpdateTaskRequest } from "@/types/task"

interface TaskEditFormProps {
  task: Task
  onSubmit: (taskId: string, taskData: UpdateTaskRequest) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export default function TaskEditForm({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || "")
  const [error, setError] = useState("")

  // Update form when task prop changes
  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || "")
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate title
    if (!title.trim()) {
      setError("Task title cannot be empty")
      return
    }

    if (title.length > 200) {
      setError("Task title cannot exceed 200 characters")
      return
    }

    if (description && description.length > 2000) {
      setError("Task description cannot exceed 2000 characters")
      return
    }

    try {
      await onSubmit(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      })
    } catch (err: any) {
      setError(err.message || "Failed to update task")
    }
  }

  const hasChanges =
    title.trim() !== task.title ||
    (description.trim() || null) !== task.description

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <label
          htmlFor="edit-task-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="edit-task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          maxLength={200}
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-describedby="edit-title-help"
        />
        <p id="edit-title-help" className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters
        </p>
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="edit-task-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="edit-task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)..."
          maxLength={2000}
          rows={4}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          aria-describedby="edit-description-help"
        />
        <p id="edit-description-help" className="mt-1 text-xs text-gray-500">
          {description.length}/2000 characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !hasChanges}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {!hasChanges && !error && (
        <p className="text-xs text-gray-500 text-center">
          No changes to save
        </p>
      )}
    </form>
  )
}
