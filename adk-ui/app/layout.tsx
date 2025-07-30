import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google ADK UI',
  description: 'A Next.js interface for communicating with Google ADK Server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
