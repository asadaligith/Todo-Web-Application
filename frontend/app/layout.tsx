/**
 * Root layout for the application.
 */

import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A secure multi-user todo application with task management',
  keywords: ['todo', 'task management', 'productivity'],
  authors: [{ name: 'Todo App Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
