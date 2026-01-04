"use client"

import { Task } from "@/types/task"
import TaskItem from "./TaskItem"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete?: (taskId: string, isCompleted: boolean) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
  emptyMessage?: string
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  emptyMessage = "No tasks yet. Create your first task!",
}: TaskListProps) {
  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  // Separate active and completed tasks
  const activeTasks = tasks.filter((task) => !task.isCompleted)
  const completedTasks = tasks.filter((task) => task.isCompleted)

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          <span className="font-medium">{tasks.length}</span> total tasks
          {completedTasks.length > 0 && (
            <>
              {" "}
              • <span className="font-medium">{completedTasks.length}</span> completed
            </>
          )}
        </div>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Active Tasks ({activeTasks.length})
          </h3>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
