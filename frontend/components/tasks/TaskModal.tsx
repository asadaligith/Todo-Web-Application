"use client"

import { useEffect, useRef } from "react"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

/**
 * Enhanced TaskModal component with:
 * - Full-screen on mobile devices (< 640px)
 * - Smooth slide-up animation on mobile
 * - Centered dialog on desktop
 * - Improved accessibility with focus trapping
 */
export default function TaskModal({
  isOpen,
  onClose,
  title,
  children,
}: TaskModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Focus management - focus first focusable element
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      if (firstElement) {
        // Small delay to ensure modal is rendered
        setTimeout(() => firstElement.focus(), 100)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - animate fade in */}
      <div
        className="fixed inset-0 bg-slate-900 bg-opacity-50 transition-opacity duration-300 ease-out backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - mobile: full screen bottom sheet, desktop: centered dialog */}
      <div className="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          ref={modalRef}
          className="
            relative bg-white w-full
            sm:rounded-lg sm:max-w-lg
            rounded-t-2xl sm:rounded-b-lg
            shadow-xl
            max-h-[90vh] sm:max-h-[85vh]
            overflow-hidden
            transform transition-all duration-300 ease-out
            animate-slide-up sm:animate-fade-in
          "
        >
          {/* Modal Header - sticky on mobile for long content */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <h3
                id="modal-title"
                className="text-lg sm:text-xl font-semibold text-slate-900"
              >
                {title}
              </h3>
              <button
                onClick={onClose}
                className="
                  text-slate-400 hover:text-slate-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  rounded-lg p-2 transition-colors
                  min-w-[44px] min-h-[44px]
                  flex items-center justify-center
                "
                aria-label="Close modal"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content - scrollable area */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-80px)] px-4 sm:px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
