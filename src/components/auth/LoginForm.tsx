'use client'

import React, { useState, useTransition } from 'react'
import { signIn, signUp } from '@/actions/auth'

export function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    if (!email.toLowerCase().endsWith('@karimjee.com')) {
      setError('Only @karimjee.com email addresses are allowed.')
      return
    }

    startTransition(async () => {
      const result = mode === 'signin' ? await signIn(formData) : await signUp(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1d3c6f 0%, #102849 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,.3)',
          width: '100%',
          maxWidth: '420px',
          padding: '38px 34px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '6px' }}>
          <img
            src="/karimjee-logo.svg"
            alt="Karimjee — Est 1825"
            style={{ display: 'block', width: '260px', maxWidth: '82%', margin: '0 auto 10px' }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            letterSpacing: '.2em',
            fontSize: '11.5px',
            color: '#184377',
            fontWeight: 700,
            margin: '0 0 4px',
          }}
        >
          AI&nbsp;TOOL&nbsp;VETTING&nbsp;&amp;&nbsp;APPROVAL
        </div>
        <p style={{ color: '#5c6678', fontSize: '13px', margin: '14px 0 22px', textAlign: 'center' }}>
          {mode === 'signin'
            ? 'Sign in with your Karimjee company email to request or review AI tools.'
            : 'Create your account to get started.'}
        </p>

        {error && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              margin: '6px 0 14px',
              background: '#eef1f5',
              color: '#5c6678',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: '#5c6678',
                  display: 'block',
                  marginBottom: '5px',
                }}
              >
                Full name
              </label>
              <input
                name="full_name"
                type="text"
                placeholder="e.g. Jane Mwaka"
                autoComplete="name"
                required
                style={{
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  width: '100%',
                  padding: '9px 11px',
                  border: '1px solid #dde3ec',
                  borderRadius: '8px',
                  background: '#fff',
                  color: '#1c2230',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#5c6678',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              Company email
            </label>
            <input
              name="email"
              type="email"
              placeholder="firstname.lastname@karimjee.com"
              autoComplete="username"
              required
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #dde3ec',
                borderRadius: '8px',
                background: '#fff',
                color: '#1c2230',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#5c6678',
                display: 'block',
                marginBottom: '5px',
              }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                width: '100%',
                padding: '9px 11px',
                border: '1px solid #dde3ec',
                borderRadius: '8px',
                background: '#fff',
                color: '#1c2230',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: '100%',
              background: isPending ? '#8a9bb8' : '#1d3c6f',
              color: '#fff',
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isPending ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '13px', marginTop: '16px', color: '#5c6678' }}>
          {mode === 'signin' ? (
            <>
              New employee?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMode('signup')
                  setError('')
                }}
                style={{ cursor: 'pointer', fontWeight: 600, color: '#1d3c6f' }}
              >
                Create an account
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMode('signin')
                  setError('')
                }}
                style={{ cursor: 'pointer', fontWeight: 600, color: '#1d3c6f' }}
              >
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
