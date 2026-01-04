/**
 * Loading skeleton components for better perceived performance.
 * Provides visual feedback while content is loading.
 */

import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

/**
 * Base Skeleton component for loading states.
 *
 * @param variant - Shape: text (rounded), circular (circle), rectangular (square)
 * @param width - Width in px or Tailwind class
 * @param height - Height in px or Tailwind class
 * @param animation - Animation style: pulse (default), wave, none
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-slate-200'

  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]',
    none: '',
  }

  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
      aria-hidden="true"
      {...props}
    />
  )
}

/**
 * Skeleton for task card loading state
 */
export function TaskSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Checkbox skeleton */}
        <Skeleton variant="rectangular" width={20} height={20} className="mt-1 flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-grow min-w-0 space-y-2">
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Skeleton variant="rectangular" width={36} height={36} />
          <Skeleton variant="rectangular" width={36} height={36} />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for stat card loading state
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton variant="text" className="h-4 w-24 mb-3" />
      <Skeleton variant="text" className="h-8 w-16" />
    </div>
  )
}

/**
 * Skeleton for form loading state
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton variant="text" className="h-4 w-24 mb-2" />
        <Skeleton variant="rectangular" className="h-11 w-full" />
      </div>
      <div>
        <Skeleton variant="text" className="h-4 w-32 mb-2" />
        <Skeleton variant="rectangular" className="h-24 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rectangular" className="h-11 flex-1" />
        <Skeleton variant="rectangular" className="h-11 flex-1" />
      </div>
    </div>
  )
}

/**
 * Skeleton for task list loading state
 */
export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TaskSkeleton key={index} />
      ))}
    </div>
  )
}
