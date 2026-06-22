'use client'

import React, { useState, useTransition } from 'react'
import { BUSINESS_UNITS } from '@/lib/constants'
import { submitRequest } from '@/actions/requests'
import { ToolBlock } from './ToolBlock'
import { Toast } from '@/components/shared/Toast'
import type { NewToolInput } from '@/lib/types'

function emptyTool(): NewToolInput {
  return {
    tool_name: '',
    vendor: '',
    url: '',
    business_use_case: '',
    users_desc: '',
    expected_count: '',
    data_categories: [],
    data_residency: '',
    model_training: '',
    training_opt_out: '',
    integrations: [],
    go_live_date: '',
    dpo_aware: false,
  }
}

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

export function NewRequestForm() {
  const [businessUnit, setBusinessUnit] = useState('')
  const [notes, setNotes] = useState('')
  const [tools, setTools] = useState<NewToolInput[]>([emptyTool()])
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [isPending, startTransition] = useTransition()

  function updateTool(index: number, updates: Partial<NewToolInput>) {
    setTools((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)))
  }

  function addTool() {
    setTools((prev) => [...prev, emptyTool()])
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!businessUnit) {
      setError('Please select a business unit.')
      return
    }

    for (const tool of tools) {
      if (!tool.tool_name.trim()) {
        setError('Tool name is required for all tools.')
        return
      }
      if (!tool.business_use_case.trim()) {
        setError('Business use case is required for all tools.')
        return
      }
    }

    startTransition(async () => {
      const result = await submitRequest({ business_unit: businessUnit, notes, tools })
      if (result?.error) {
        setError(result.error)
      } else {
        setToast('Request submitted successfully!')
        setBusinessUnit('')
        setNotes('')
        setTools([emptyTool()])
      }
    })
  }

  return (
    <>
      <div>
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
          <div
            style={{
              background: '#fff',
              border: '1px solid #dde3ec',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(20,43,81,.08)',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #dde3ec',
                fontWeight: 700,
                color: '#1c2230',
              }}
            >
              Request Details
            </div>
            <div style={{ padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Business unit *</label>
                <select
                  style={inputStyle}
                  value={businessUnit}
                  onChange={(e) => setBusinessUnit(e.target.value)}
                  required
                >
                  <option value="">Select your business unit…</option>
                  {BUSINESS_UNITS.map((cluster) => (
                    <optgroup key={cluster.cluster} label={cluster.cluster}>
                      {cluster.units.map((unit) => (
                        <option key={`${cluster.cluster}:${unit}`} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional context for reviewers…"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#fff',
              border: '1px solid #dde3ec',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(20,43,81,.08)',
              marginBottom: '18px',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid #dde3ec',
                fontWeight: 700,
                color: '#1c2230',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>AI Tools</span>
              <button
                type="button"
                onClick={addTool}
                style={{
                  background: '#fff',
                  color: '#1d3c6f',
                  border: '1px solid #dde3ec',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                + Add tool
              </button>
            </div>
            <div style={{ padding: '18px' }}>
              {tools.map((tool, i) => (
                <ToolBlock
                  key={i}
                  index={i}
                  tool={tool}
                  onChange={updateTool}
                  onRemove={removeTool}
                  canRemove={tools.length > 1}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
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
            {isPending ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
    </>
  )
}
