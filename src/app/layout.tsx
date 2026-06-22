import type { Metadata } from 'next'
import { Red_Hat_Display, Red_Hat_Text } from 'next/font/google'
import './globals.css'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const redHatText = Red_Hat_Text({
  subsets: ['latin'],
  variable: '--font-text',
  display: 'swap',
})

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
    <html lang="en" className={`${redHatDisplay.variable} ${redHatText.variable}`}>
      <body>{children}</body>
    </html>
  )
}
