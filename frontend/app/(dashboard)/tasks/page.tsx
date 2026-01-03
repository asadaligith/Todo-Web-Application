/**
 * Tasks page - displays user's todo list.
 * Currently shows empty state (will be populated in Phase 4).
 */

'use client'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal todo list
          </p>
        </div>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          disabled
        >
          + Add Task
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          className="mx-auto h-24 w-24 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <h3 className="mt-6 text-lg font-medium text-gray-900">
          No tasks yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by creating your first task!
        </p>
        <p className="mt-4 text-xs text-gray-400">
          (Task creation will be enabled in the next phase)
        </p>
      </div>

      {/* Stats Card (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Total Tasks</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Completed</div>
          <div className="mt-2 text-3xl font-bold text-green-600">0</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-gray-600">Pending</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">0</div>
        </div>
      </div>
    </div>
  )
}
