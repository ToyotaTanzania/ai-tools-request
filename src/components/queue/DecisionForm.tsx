'use client'

import React, { useState, useTransition } from 'react'
import { decideToolAction } from '@/actions/decisions'
import { Toast } from '@/components/shared/Toast'

interface DecisionFormProps {
  toolId: string
  onDecision?: () => void
}

export function DecisionForm({ toolId, onDecision }: DecisionFormProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [isPending, startTransition] = useTransition()
  const [decided, setDecided] = useState(false)

  function decide(decision: 'approve' | 'decline') {
    setError('')
    if (decision === 'decline' && !reason.trim()) {
      setError('Please provide a reason when declining.')
      return
    }

    startTransition(async () => {
      const result = await decideToolAction(toolId, decision, reason)
      if (result?.error) {
        setError(result.error)
      } else {
        setDecided(true)
        setToast(decision === 'approve' ? 'Tool approved.' : 'Tool declined.')
        onDecision?.()
      }
    })
  }

  if (decided) {
    return (
      <>
        <div style={{ color: '#1f7a44', fontSize: '13px', fontWeight: 600 }}>Decision recorded.</div>
        {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
      </>
    )
  }

  return (
    <>
      <div>
        {error && (
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '6px',
              fontSize: '12.5px',
              marginBottom: '8px',
              background: '#fbe9e8',
              color: '#b3261e',
            }}
          >
            {error}
          </div>
        )}
        <div style={{ marginBottom: '8px' }}>
          <label
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#5c6678',
              display: 'block',
              marginBottom: '5px',
            }}
          >
            Decision notes (required for decline)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add notes or reason…"
            disabled={isPending}
            style={{
              fontFamily: 'inherit',
              fontSize: '14px',
              width: '100%',
              padding: '9px 11px',
              border: '1px solid #dde3ec',
              borderRadius: '8px',
              background: '#fff',
              color: '#1c2230',
              resize: 'vertical',
              minHeight: '60px',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => decide('approve')}
            disabled={isPending}
            style={{
              background: '#1f7a44',
              color: '#fff',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isPending ? '…' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => decide('decline')}
            disabled={isPending}
            style={{
              background: '#b3261e',
              color: '#fff',
              padding: '8px 14px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isPending ? '…' : 'Decline'}
          </button>
        </div>
      </div>
      {toast && <Toast message={toast} onDismiss={() => setToast('')} />}
    </>
  )
}
