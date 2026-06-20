'use client'

import React, { useState, useTransition } from 'react'
import { signIn, signUp } from '@/actions/auth'

const LOGIN_LOGO_B64 =
  'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMzUwIDEwODAiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6ICMxODQzNzc7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzkzOWJhMTsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBmaWxsOiAjMTYxNjE2OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8Zz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY3Ny42LDQ4My4yczAsMCwwLDB0MCwwIi8+CiAgICA8bGluZSBjbGFzcz0iY2xzLTEiIHgxPSI2MTQuNyIgeTE9IjM4OS40IiB4Mj0iNjE1LjUiIHkyPSIzODkuNCIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjQ2LjUsMzUyLjdoMHMwLDAsMCwwTTY0Ni40LDM1Mi42aDBzMCwwLDAsMGgwWk02NDYuNCwzNTIuNmgwbC0uMi0uMnYuMloiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTcyMS4yLDU2OC45YzAsLjItLjIuMy0uMi41LDAsLjIsMCwwLC4yLS41WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjc1LjksNDk3LjdzMCwwLC4xLDBjMCwwLC4xLDAsLjEsMGgtLjNaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik02MzEuMSw1NjkuNGMwLS4xLS4xLS4zLS4yLS40LjIuNS4zLjcuMi40WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNzU1LjQsMzUxLjVjLTMxLjQtNTQuNy03OS4zLTY4LjYtNzkuMy02OC42LDAsMC00OCwxMy45LTc5LjQsNjguNi0zMS40LDU0LjgtMzMuOSw5NC4xLTMzLjIsMTIxLjguNiwyNy43LDkuOSw3Ny42LDUwLjQsMTA3LjYsMTkuMSwxNC4yLDQyLjUsMjAuOCw2Mi4yLDIwLjhzNDMtNi42LDYyLjEtMjAuOGM0MC41LTMwLDQ5LjgtNzkuOSw1MC40LTEwNy42LjYtMjcuNy0xLjgtNjcuMS0zMy4yLTEyMS44Wk03MzAuNSwzNjYuNWMxNi45LS4zLDIwLjIsMTMuMiwyMC4zLDE3LjMuMywxMS4zLTEwLjgsMTcuMi0xNS4xLDE3LjgtOC45LDEuMi0xNS41LDMtMjEuMyw3LjUtNS43LDQuNC05LjMsMTMuNy0xMCwxOS41LS40LDMuNy0uOCw5LjcsMS4yLDE2LjUsMS42LDUuMSw2LjQsMTYuNiw2LDI5LjktLjQsMTAuNi02LjcsMTkuMy0xMi42LDI0LTYuNSw1LjItNS43LDkuNS01LjksOC45LTIuMy05LjItMTIuOS0xMy4yLTEyLjktMTMuMiwwLDAsMi44LS4yLDQuNy0xLDIuNy0xLjIsNi45LTQuMSw5LjctOS4xLDMuMS01LjMsNC40LTExLjYsNC42LTE3LjQuMy0xMi42LTQuOC0yMy41LTcuOS0zMi4xLTMuMS04LjYtNC4zLTIwLjYtNC4zLTI3LjRzNC4zLTIxLjksMTQuOC0zMC4xYzExLjctOS40LDI0LTExLDI4LjYtMTEuMVpNNjkyLDUyMS41Yy0uMyw4LjctNC41LDE0LTcuMywxNi40LTYuNSw1LjYtOC40LDEwLjktOC42LDEwLjlzLTEuNy01LTguNy0xMC45Yy0yLjgtMi41LTYuOS03LjctNy4zLTE2LjQtLjYtMTcuMywxNC42LTIzLjIsMTUuOS0yMy43LDEuMy41LDE2LjUsNi41LDE1LjksMjMuN1pNNjQxLjQsMzQ1LjVjMi0yLjEsOS43LTQsMTYuNC0uNywzLjgsMS45LDYuOCw2LjUsNy43LDguMywyLjMsNC41LDEuOCw5LjYsMi4zLDkuMy41LS4zLDEuMy00LjMsMS4yLTUuOC0uMi0zLjQtLjktOC45LTQuMS0xNC0yLjUtNC01LjEtOC44LTQuOS0xNy43LjQtMTguMywxNi4xLTIzLjUsMTYuMS0yMy41LDAsMCwxNS43LDUuMiwxNi4xLDIzLjUuMiw4LjktMi40LDEzLjYtNSwxNy43LTMuMiw1LjEtMy45LDEwLjYtNC4xLDE0LDAsMS42LjcsNS42LDEuMiw1LjguNS4zLDAtNC45LDIuMy05LjMuOS0xLjgsMy44LTYuNCw3LjYtOC4zLDYuNy0zLjMsMTQuMy0xLjQsMTYuNC43LDQuMiw0LjMsNi42LDE0LjUtMy41LDI0LTIuMiwyLTExLjMsNy40LTE2LjQsMTQuMy02LjMsOC41LTgsMjAuNC03LjksMjYuOS4yLDYuNC45LDE3LjksNCwyNi44LDMuMyw5LjQsNy40LDE2LjcsNy40LDI3LjdzLTMsMjUuOC0xOC4xLDI1LjhoLS4zYy0xNS4xLDAtMTguMi0xOS41LTE4LjItMjUuOCwwLTExLDQuMS0xOC4zLDcuNC0yNy43LDMuMS04LjksMy44LTIwLjMsNC0yNi44LjItNi41LTEuNi0xOC40LTcuOC0yNi45LTUuMS02LjktMTQuMy0xMi4yLTE2LjQtMTQuMy0xMC4xLTkuNS03LjctMTkuNy0zLjUtMjRaTTYyMS42LDM2Ni41YzQuNywwLDE2LjksMS43LDI4LjYsMTEuMSwxMC41LDguMywxNC44LDIzLjMsMTQuOCwzMC4xcy0xLjIsMTguOC00LjMsMjcuNGMtMy4xLDguNi04LjIsMTkuNS03LjksMzIuMS4yLDUuOSwxLjUsMTIuMSw0LjYsMTcuNCwyLjgsNC45LDcsNy45LDkuNyw5LjEsMS44LjgsNC42LDEsNC42LDEsMCwwLTEwLjYsNC0xMi45LDEzLjItLjEuNi42LTMuNy01LjgtOC45LTUuOS00LjgtMTIuMi0xMy40LTEyLjYtMjQtLjQtMTMuMyw0LjQtMjQuOCw2LTI5LjksMi4xLTYuOCwxLjctMTIuOCwxLjItMTYuNS0uNy01LjgtNC40LTE1LjItMTAtMTkuNS01LjgtNC41LTEyLjMtNi4zLTIxLjMtNy41LTQuMy0uNi0xNS40LTYuNS0xNS4xLTE3LjguMS00LDMuNC0xNy41LDIwLjMtMTcuM1pNNTg2LjcsNDU1LjRjMS40LTMuOCwyLjUtOCwyLjgtMTkuNSwwLTIuOCwyLTIxLjEsMTUuMS0yNi45LDQuNy0yLjEsMTMuMS00LjUsMjUsMS4xLDguNCw0LDEwLjUsMTAuMSwxMS44LDEzLjQsMiw1LjMsMS43LDEyLjIuNywxNy42LTEuNCw2LjktNC41LDE0LjktNS40LDIyLjEtLjIsMi4xLS41LDkuNy0uNSw5LjctLjQtMS0yLjctNy40LTEwLjgtMTAuOS00LjUtMi0xMS0xLjMtMTYuOC00LjEtNi44LTMuMy0zLjEtMTMuMS40LTE1LjksNy4xLTUuOCwxNC44LTIuMiwxNy43LS41LDIuMiwxLjIsNC43LDQuMSw1LjIsNS4yLS40LTEuMS0xLjctNS40LTMtNy4zLTIuMS0zLjItNS02LjgtMTMuMy03LjEtMy42LS4yLTkuNywwLTEzLjcsOS40LTEuMSwyLjQtMiwxMy4zLTUuOCwxNy45LTMuOCw0LjctOC43LDguNy0xNS42LDUuNy0uNy0uMyw0LjctNiw2LjItMTBaTTYwNC45LDUxNmMtMywyLjMtOC42LDMtMTIuNywxLjItMy42LTEuNi05LjYtOC45LTkuOC0xOC41LS4zLTkuNyw0LTIzLjcsMTIuNS0yOS41LDEwLTYuOCwyMS43LTUuNywyNy44LTMuMyw1LjYsMi4zLDExLjMsOC44LDEzLDE0LDEuOSw1LjgsMy45LDkuMyw3LDE0LDMuMiw0LjcsOC4zLDcuNiwxMS40LDE0LDEuNSwyLjksMS43LDEyLjMsMS4xLDEwLjctLjYtMS42LTkuNS03LjgtMTIuNi04LjYtMi45LS43LTEwLTEuOC0xOS4xLjEtMi44LjYtNi40LS4xLTguNC0yLjEtMi0yLTMuNC03LjgtNC4xLTkuNy0xLjYtNC4xLTUuMS04LjUtMTAtOC45LTQuMS0uNS02LjksMS4xLTguMywyLjgtMi4xLDIuNy0yLDYuOC0xLjEsNS42LjktMS4zLDIuNi00LjQsNi44LTQuMywzLjUsMCw3LjcsMi4xLDEwLDguNCwxLjIsMy4zLDEuNCwxMC41LTMuNiwxNC4yWk02MzAuOSw1NjljLTEuMS0xLjgtNi42LTUuOS0xMS4xLTkuOS00LjktNC4zLTkuNS0xMS41LTkuNi0yMC44LS4xLTcuNCwyLjQtMTUuNSw5LTIwLjUsNC4xLTIuOSwxMy01LjgsMjAuMy0zLjksMTIsMywxOC4yLDE1LjcsMTkuNywxNy44LDAsMCwxLjUsMS45LjYsMS4zLS45LS42LTkuNS0uNS0xMi45LjYtNC45LDEuNC0xMC4xLDUuMy0xMi42LDkuMS03LjMsMTEuMS00LjIsMjMuNy0zLjMsMjYuM1oiLz4KICA8L2c+Cjwvc3ZnPg=='

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
        background: 'linear-gradient(135deg, #1d3c6f 0%, #142b51 100%)',
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
            src={`data:image/svg+xml;base64,${LOGIN_LOGO_B64}`}
            alt="Karimjee — Est 1825"
            style={{ display: 'block', width: '240px', maxWidth: '78%', margin: '0 auto 10px' }}
          />
        </div>
        <div
          style={{
            textAlign: 'center',
            letterSpacing: '.2em',
            fontSize: '11.5px',
            color: '#c9a14a',
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
              background: '#fbe9e8',
              color: '#b3261e',
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
