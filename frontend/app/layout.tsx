/**
 * Root layout for the application.
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Todo App - Manage Your Tasks',
  description: 'A secure multi-user todo application with task management',
  keywords: ['todo', 'task management', 'productivity'],
  authors: [{ name: 'Todo App Team' }],
  viewport: 'width=device-width, initial-scale=1',
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
