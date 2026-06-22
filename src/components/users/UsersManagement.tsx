'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { listUsers, createUser, updateUser, deleteUser } from '@/actions/users'
import { ROLE_LABEL } from '@/lib/constants'
import type { Profile, Role } from '@/lib/types'

const ROLES: Role[] = ['employee', 'it_head', 'legal', 'coo', 'admin']

const inputStyle: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '14px',
  width: '100%',
  padding: '9px 11px',
  border: '1px solid #dde3ec',
  borderRadius: '8px',
  background: '#fff',
  color: '#1c2230',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: '12.5px',
  fontWeight: 600,
  color: '#5c6678',
  display: 'block',
  marginBottom: '5px',
}

const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  employee: { bg: '#f0f4ff', color: '#1d3c6f' },
  it_head: { bg: '#fff3e0', color: '#b45309' },
  legal: { bg: '#f0fdf4', color: '#166534' },
  coo: { bg: '#fdf2f8', color: '#86198f' },
  admin: { bg: '#fef2f2', color: '#991b1b' },
}

interface FormState {
  email: string
  full_name: string
  role: Role
  password: string
}

function emptyForm(): FormState {
  return { email: '', full_name: '', role: 'employee', password: '' }
}

export function UsersManagement() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [formError, setFormError] = useState('')
  const [toast, setToast] = useState('')
  const [isPending, startTransition] = useTransition()

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  async function load() {
    setLoading(true)
    const { data, error } = await listUsers()
    if (error) setError(error)
    else setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  function startEdit(user: Profile) {
    setEditId(user.id)
    setForm({ email: user.email, full_name: user.full_name, role: user.role, password: '' })
    setFormError('')
    setShowCreate(false)
  }

  function cancelEdit() {
    setEditId(null)
    setForm(emptyForm())
    setFormError('')
  }

  function startCreate() {
    setShowCreate(true)
    setEditId(null)
    setForm(emptyForm())
    setFormError('')
  }

  function cancelCreate() {
    setShowCreate(false)
    setForm(emptyForm())
    setFormError('')
  }

  function handleSubmitCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    startTransition(async () => {
      const result = await createUser(form)
      if (result.error) {
        setFormError(result.error)
      } else {
        showToast('User created successfully.')
        setShowCreate(false)
        setForm(emptyForm())
        await load()
      }
    })
  }

  function handleSubmitEdit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!editId) return
    startTransition(async () => {
      const result = await updateUser({ id: editId, full_name: form.full_name, role: form.role })
      if (result.error) {
        setFormError(result.error)
      } else {
        showToast('User updated successfully.')
        setEditId(null)
        setForm(emptyForm())
        await load()
      }
    })
  }

  function handleDelete(user: Profile) {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteUser(user.id)
      if (result.error) {
        setError(result.error)
      } else {
        showToast('User deleted.')
        await load()
      }
    })
  }

  const roleCounts = ROLES.reduce(
    (acc, r) => {
      acc[r] = users.filter((u) => u.role === r).length
      return acc
    },
    {} as Record<Role, number>
  )

  if (loading) {
    return <div style={{ color: '#5c6678', padding: '20px' }}>Loading users…</div>
  }

  if (error) {
    return (
      <div
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '16px',
          color: '#991b1b',
          fontSize: '14px',
        }}
      >
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1d3c6f',
            color: '#fff',
            padding: '13px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 4px 16px rgba(20,43,81,.18)',
          }}
        >
          {toast}
        </div>
      )}

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: '#f6f8fc',
            border: '1px solid #dde3ec',
            borderRadius: '10px',
            padding: '14px 20px',
            minWidth: '110px',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1d3c6f' }}>{users.length}</div>
          <div style={{ fontSize: '12px', color: '#5c6678', marginTop: '2px' }}>Total Users</div>
        </div>
        {ROLES.filter((r) => roleCounts[r] > 0).map((r) => (
          <div
            key={r}
            style={{
              background: ROLE_COLORS[r].bg,
              border: `1px solid ${ROLE_COLORS[r].bg}`,
              borderRadius: '10px',
              padding: '14px 20px',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '22px', fontWeight: 700, color: ROLE_COLORS[r].color }}>
              {roleCounts[r]}
            </div>
            <div style={{ fontSize: '12px', color: ROLE_COLORS[r].color, marginTop: '2px', opacity: 0.8 }}>
              {ROLE_LABEL[r]}
            </div>
          </div>
        ))}
      </div>

      {/* Create User Button */}
      {!showCreate && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={startCreate}
            style={{
              background: '#1d3c6f',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            + Add New User
          </button>
        </div>
      )}

      {/* Create User Form */}
      {showCreate && (
        <div
          style={{
            background: '#f6f8fc',
            border: '1px solid #dde3ec',
            borderRadius: '12px',
            padding: '22px',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1d3c6f', margin: '0 0 18px' }}>
            Add New User
          </h3>
          <form onSubmit={handleSubmitCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  style={inputStyle}
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane.smith@karimjee.com"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Role *</label>
                <select
                  style={inputStyle}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Temporary Password *</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  required
                />
              </div>
            </div>
            {formError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginTop: '14px',
                }}
              >
                {formError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="submit"
                disabled={isPending}
                style={{
                  background: '#1d3c6f',
                  color: '#fff',
                  padding: '9px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: isPending ? 'wait' : 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {isPending ? 'Creating…' : 'Create User'}
              </button>
              <button
                type="button"
                onClick={cancelCreate}
                style={{
                  background: '#fff',
                  color: '#5c6678',
                  padding: '9px 18px',
                  border: '1px solid #dde3ec',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #dde3ec',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5c6678', fontSize: '14px' }}>
            No users found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f6f8fc', borderBottom: '1px solid #dde3ec' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#5c6678', letterSpacing: '.04em' }}>
                  NAME
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#5c6678', letterSpacing: '.04em' }}>
                  EMAIL
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#5c6678', letterSpacing: '.04em' }}>
                  ROLE
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#5c6678', letterSpacing: '.04em' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <React.Fragment key={user.id}>
                  <tr
                    style={{
                      borderBottom: idx < users.length - 1 ? '1px solid #f0f3f7' : 'none',
                      background: editId === user.id ? '#f6f8fc' : '#fff',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#1c2230' }}>
                      {user.full_name}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13.5px', color: '#5c6678' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: ROLE_COLORS[user.role]?.bg || '#f0f4ff',
                          color: ROLE_COLORS[user.role]?.color || '#1d3c6f',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {ROLE_LABEL[user.role] || user.role}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(user)}
                          style={{
                            background: '#f0f4ff',
                            color: '#1d3c6f',
                            padding: '6px 14px',
                            border: 'none',
                            borderRadius: '7px',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isPending}
                          style={{
                            background: '#fef2f2',
                            color: '#991b1b',
                            padding: '6px 14px',
                            border: 'none',
                            borderRadius: '7px',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: isPending ? 'wait' : 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Inline Edit Row */}
                  {editId === user.id && (
                    <tr style={{ background: '#f6f8fc', borderBottom: idx < users.length - 1 ? '1px solid #dde3ec' : 'none' }}>
                      <td colSpan={4} style={{ padding: '16px' }}>
                        <form onSubmit={handleSubmitEdit}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={labelStyle}>Full Name *</label>
                              <input
                                style={inputStyle}
                                value={form.full_name}
                                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <label style={labelStyle}>Role *</label>
                              <select
                                style={inputStyle}
                                value={form.role}
                                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                              >
                                {ROLES.map((r) => (
                                  <option key={r} value={r}>
                                    {ROLE_LABEL[r]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {formError && (
                            <div
                              style={{
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                color: '#991b1b',
                                fontSize: '13px',
                                marginTop: '12px',
                              }}
                            >
                              {formError}
                            </div>
                          )}
                          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                            <button
                              type="submit"
                              disabled={isPending}
                              style={{
                                background: '#1d3c6f',
                                color: '#fff',
                                padding: '8px 18px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: isPending ? 'wait' : 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              {isPending ? 'Saving…' : 'Save Changes'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              style={{
                                background: '#fff',
                                color: '#5c6678',
                                padding: '8px 16px',
                                border: '1px solid #dde3ec',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info note */}
      <div
        style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: '#f0f4ff',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#1d3c6f',
          border: '1px solid #dde3ec',
        }}
      >
        <strong>Note:</strong> Registered users can log in and submit AI tool requests via the{' '}
        <strong>New Request</strong> tab. Roles control which review queues they can access.
      </div>
    </div>
  )
}
