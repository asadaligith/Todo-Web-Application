/**
 * Reusable Card component with consistent styling and variants.
 * Supports mobile-first responsive design with proper spacing.
 */

import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/**
 * Card component for consistent container styling.
 *
 * @param variant - Visual style: default (shadow-sm), elevated (shadow-md), outlined (border)
 * @param padding - Internal spacing: none, sm (p-4), md (p-6), lg (p-8)
 * @param className - Additional Tailwind classes
 */
export default function Card({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg transition-shadow'

  const variantStyles = {
    default: 'shadow-sm hover:shadow-md',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border border-slate-200 hover:border-slate-300',
  }

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card Header - for consistent card title sections
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Title - for consistent card headings
 */
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  children: React.ReactNode
}

export function CardTitle({
  as: Component = 'h3',
  children,
  className = '',
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={`text-lg sm:text-xl font-semibold text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Card Description - for consistent card subtitles
 */
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function CardDescription({ children, className = '', ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-slate-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
}

/**
 * Card Content - for consistent card body sections
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

/**
 * Card Footer - for consistent card action sections
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  )
}
