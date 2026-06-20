import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karimjee Group · AI Tool Vetting & Approval',
  description: 'AI tool vetting and approval platform for Karimjee Group',
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
