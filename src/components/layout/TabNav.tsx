'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Profile } from '@/lib/types'
import { REVIEWER_ROLES } from '@/lib/constants'
import { getQueueCount } from '@/actions/decisions'

const SUPER_ADMIN_EMAIL = 'abdulaziz.raudha@karimjee.com'

interface TabNavProps {
  profile: Profile
}

export function TabNav({ profile }: TabNavProps) {
  const pathname = usePathname()
  const [queueCount, setQueueCount] = useState(0)
  const isReviewer = REVIEWER_ROLES.includes(profile.role)
  const isSuperAdmin = profile.email?.toLowerCase() === SUPER_ADMIN_EMAIL

  useEffect(() => {
    if (isReviewer) {
      getQueueCount().then(setQueueCount).catch(() => {})
    }
  }, [isReviewer])

  const tabs = [
    { href: '/requests/new', label: 'New Request', show: true },
    { href: '/requests', label: 'My Requests', show: true },
    { href: '/queue', label: 'My Review Queue', show: isReviewer, badge: queueCount },
    { href: '/registry', label: 'AI Tool Registry', show: isReviewer },
    { href: '/users', label: 'User Management', show: isSuperAdmin },
  ]

  return (
    <nav
      style={{
        background: '#fff',
        borderBottom: '1px solid #dde3ec',
        padding: '0 22px',
        display: 'flex',
        gap: '4px',
        position: 'sticky',
        top: '58px',
        zIndex: 19,
        overflowX: 'auto',
      }}
    >
      {tabs
        .filter((t) => t.show)
        .map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/')
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                background: 'none',
                color: isActive ? '#1d3c6f' : '#5c6678',
                padding: '14px 16px',
                borderBottom: isActive ? '3px solid #1d3c6f' : '3px solid transparent',
                borderRadius: 0,
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
              {tab.badge ? (
                <span
                  style={{
                    background: '#184377',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '1px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </Link>
          )
        })}
    </nav>
  )
}
