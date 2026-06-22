'use client'

import React, { useTransition } from 'react'
import { signOut } from '@/actions/auth'
import type { Profile } from '@/lib/types'
import { ROLE_LABEL } from '@/lib/constants'

interface HeaderProps {
  profile: Profile
}

export function Header({ profile }: HeaderProps) {
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <header
      style={{
        background: '#1d3c6f',
        color: '#fff',
        padding: '0 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '58px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        boxShadow: '0 1px 3px rgba(20,43,81,.08),0 8px 24px rgba(20,43,81,.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img
          src="/karimjee-logo-white.svg"
          alt="Karimjee"
          style={{ height: '40px', display: 'block', objectFit: 'contain' }}
        />
        <span
          style={{
            fontSize: '10.5px',
            letterSpacing: '.16em',
            color: 'rgba(255,255,255,.72)',
            fontWeight: 700,
            borderLeft: '1px solid rgba(255,255,255,.32)',
            paddingLeft: '14px',
          }}
        >
          AI TOOL VETTING
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px' }}>
        <span>{profile.full_name}</span>
        <span
          style={{
            background: 'rgba(255,255,255,.16)',
            padding: '4px 11px',
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '12px',
          }}
        >
          {ROLE_LABEL[profile.role] || profile.role}
        </span>
        <button
          onClick={handleSignOut}
          disabled={isPending}
          style={{
            background: 'rgba(255,255,255,.14)',
            color: '#fff',
            padding: '7px 13px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </header>
  )
}
