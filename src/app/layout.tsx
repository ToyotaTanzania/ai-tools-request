import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karimjee Group · AI Tool Vetting & Approval',
  description: 'Internal platform for requesting, reviewing, and approving AI tools across Karimjee Group companies.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Karimjee Group · AI Tool Vetting & Approval',
    description: 'Internal platform for requesting, reviewing, and approving AI tools across Karimjee Group companies.',
    type: 'website',
    siteName: 'Karimjee Group',
  },
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
