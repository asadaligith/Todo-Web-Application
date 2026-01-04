/**
 * Tasks page - displays user's todo list with full CRUD operations.
 * Phase 4: Create and View Personal Tasks
 */

"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task"
import { createTask, getTasks, toggleTaskCompletion, deleteTask, updateTask } from "@/lib/services/taskService"
import TaskList from "@/components/tasks/TaskList"
import TaskForm from "@/components/tasks/TaskForm"
import TaskEditForm from "@/components/tasks/TaskEditForm"
import TaskModal from "@/components/tasks/TaskModal"
import DeleteConfirmModal from "@/components/tasks/DeleteConfirmModal"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const fetchedTasks = await getTasks()
      setTasks(fetchedTasks)
    } catch (err: any) {
      toast.error(err.message || "Failed to load tasks")
      console.error("Error fetching tasks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      setIsSubmitting(true)
      const newTask = await createTask(taskData)

      // Optimistic UI update - add new task to the beginning
      setTasks((prevTasks) => [newTask, ...prevTasks])

      // Close modal and show success message
      setIsCreateModalOpen(false)
      toast.success("Task created successfully!")
    } catch (err: any) {
      console.error("Error creating task:", err)
      toast.error(err.message || "Failed to create task")
      throw err // Re-throw to let TaskForm handle the error display
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted } : task
      )
    )

    try {
      await toggleTaskCompletion(taskId, isCompleted)
      toast.success(isCompleted ? "Task marked as complete" : "Task marked as active")
    } catch (err: any) {
      console.error("Error toggling task completion:", err)

      // Rollback on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
        )
      )

      toast.error(err.message || "Failed to update task")
    }
  }

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setEditingTask(task)
      setIsEditModalOpen(true)
    }
  }

  const handleUpdateTask = async (taskId: string, taskData: UpdateTaskRequest) => {
    try {
      setIsSubmitting(true)
      const updatedTask = await updateTask(taskId, taskData)

      // Optimistic UI update - update task in list
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      )

      // Close modal and show success message
      setIsEditModalOpen(false)
      setEditingTask(null)
      toast.success("Task updated successfully!")
    } catch (err: any) {
      console.error("Error updating task:", err)
      toast.error(err.message || "Failed to update task")
      throw err // Re-throw to let TaskEditForm handle the error display
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setDeletingTask(task)
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingTask) return

    const taskId = deletingTask.id
    const taskToDelete = deletingTask

    // Close modal and clear deleting task
    setIsDeleteModalOpen(false)

    // Optimistic UI update
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))

    try {
      setIsDeleting(true)
      await deleteTask(taskId)
      setDeletingTask(null)
      toast.success("Task deleted successfully")
    } catch (err: any) {
      console.error("Error deleting task:", err)

      // Rollback on error
      setTasks((prevTasks) => [taskToDelete, ...prevTasks])
      toast.error(err.message || "Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  // Calculate stats
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.isCompleted).length
  const pendingTasks = totalTasks - completedTasks

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Your Tasks</h2>
          <p className="text-sm text-slate-600 mt-0.5 sm:mt-1">
            Manage your personal todo list
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="
            w-full sm:w-auto
            px-4 py-2.5 bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 active:bg-blue-800
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-all duration-200
            font-medium text-base
            min-h-[44px]
            flex items-center justify-center gap-2
          "
          aria-label="Add new task"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add Task</span>
        </button>
      </div>

      {/* Stats Cards - mobile optimized grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <div className="text-xs sm:text-sm font-medium text-slate-600">Total</div>
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-slate-900">{totalTasks}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <div className="text-xs sm:text-sm font-medium text-slate-600">Done</div>
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-green-600">{completedTasks}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
          <div className="text-xs sm:text-sm font-medium text-slate-600">Active</div>
          <div className="mt-1 sm:mt-2 text-xl sm:text-3xl font-bold text-blue-600">{pendingTasks}</div>
        </div>
      </div>

      {/* Task List - mobile optimized */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-blue-600 border-t-transparent"></div>
            <span className="text-sm sm:text-base text-slate-600">Loading tasks...</span>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </TaskModal>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingTask(null)
          }}
          title="Edit Task"
        >
          <TaskEditForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => {
              setIsEditModalOpen(false)
              setEditingTask(null)
            }}
            isSubmitting={isSubmitting}
          />
        </TaskModal>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={deletingTask}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setDeletingTask(null)
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}
