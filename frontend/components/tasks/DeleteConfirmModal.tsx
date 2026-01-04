"use client"

import { useEffect, useRef } from "react"
import { Task } from "@/types/task"

interface DeleteConfirmModalProps {
  isOpen: boolean
  task: Task | null
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  task,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onCancel])

  // Focus confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen || !task) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="delete-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Icon */}
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="mt-4 text-center">
            <h3
              id="delete-modal-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Delete Task
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>

            {/* Task Preview */}
            <div className="bg-gray-50 rounded-md p-3 text-left mb-6">
              <p className="text-sm font-medium text-gray-900 truncate">
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              ref={confirmButtonRef}
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
