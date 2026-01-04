"use client"

import { useState } from "react"
import { CreateTaskRequest } from "@/types/task"

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskRequest) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export default function TaskForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

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
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      })

      // Reset form on success
      setTitle("")
      setDescription("")
      setError("")
    } catch (err: any) {
      setError(err.message || "Failed to create task")
    }
  }

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
          htmlFor="task-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          maxLength={200}
          required
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-describedby="title-help"
        />
        <p id="title-help" className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters
        </p>
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)..."
          maxLength={2000}
          rows={4}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
          aria-describedby="description-help"
        />
        <p id="description-help" className="mt-1 text-xs text-gray-500">
          {description.length}/2000 characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  )
}
