"use client"

import { Task } from "@/types/task"
import { formatDistanceToNow } from "date-fns"

interface TaskItemProps {
  task: Task
  onToggleComplete?: (taskId: string, isCompleted: boolean) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
}

/**
 * Enhanced TaskItem component with:
 * - Improved mobile layout (stacked on small screens)
 * - Larger touch targets (min 44x44px)
 * - Better visual hierarchy
 * - Smooth animations and transitions
 */
export default function TaskItem({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const handleToggle = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id, !task.isCompleted)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(task.id)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id)
    }
  }

  // Format timestamp to human-readable format
  const formattedDate = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : ""

  return (
    <div
      className={`
        bg-white border border-slate-200 rounded-lg p-3 sm:p-4
        shadow-sm hover:shadow-md transition-all duration-200
        ${task.isCompleted ? "opacity-70" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox - enhanced touch target */}
        <div className="flex-shrink-0 mt-0.5 sm:mt-1">
          <button
            onClick={handleToggle}
            className="
              w-6 h-6 sm:w-5 sm:h-5 rounded border-2
              border-slate-300 flex items-center justify-center
              hover:border-blue-500 active:border-blue-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
              min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0
              -m-2 sm:m-0
            "
            aria-label={
              task.isCompleted ? "Mark as incomplete" : "Mark as complete"
            }
          >
            {task.isCompleted && (
              <svg
                className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Task Content */}
        <div className="flex-grow min-w-0">
          <h3
            className={`
              text-base sm:text-lg font-medium text-slate-900 mb-1
              break-words
              ${task.isCompleted ? "line-through text-slate-500" : ""}
            `}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`
                text-sm sm:text-base text-slate-600 mb-2
                whitespace-pre-wrap break-words
                line-clamp-3 sm:line-clamp-none
                ${task.isCompleted ? "line-through" : ""}
              `}
            >
              {task.description}
            </p>
          )}

          {/* Mobile: metadata on separate line */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
            {formattedDate && (
              <>
                <time dateTime={task.createdAt} className="flex-shrink-0">
                  {formattedDate}
                </time>
                <span aria-hidden="true" className="hidden sm:inline">•</span>
              </>
            )}
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${task.isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-700"
                }
              `}
            >
              {task.isCompleted ? "Completed" : "Active"}
            </span>
          </div>
        </div>

        {/* Action Buttons - improved touch targets and mobile layout */}
        <div className="flex-shrink-0 flex sm:flex-row flex-col items-start sm:items-center gap-1 sm:gap-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="
                p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50
                active:bg-blue-100
                rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                min-w-[44px] min-h-[44px]
                flex items-center justify-center
              "
              aria-label="Edit task"
              title="Edit task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="
                p-2 text-slate-600 hover:text-red-600 hover:bg-red-50
                active:bg-red-100
                rounded-lg transition-colors
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                min-w-[44px] min-h-[44px]
                flex items-center justify-center
              "
              aria-label="Delete task"
              title="Delete task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
