import React from 'react'
import type { RequestTool } from '@/lib/types'

interface StatsRowProps {
  tools: RequestTool[]
}

export function StatsRow({ tools }: StatsRowProps) {
  const total = tools.length
  const inPipeline = tools.filter((t) => !t.final_status).length
  const approved = tools.filter((t) => t.final_status === 'approved').length
  const rejected = tools.filter((t) => t.final_status === 'rejected').length

  const stats = [
    { n: total, l: 'Total Tools' },
    { n: inPipeline, l: 'In Pipeline' },
    { n: approved, l: 'Approved' },
    { n: rejected, l: 'Rejected' },
  ]

  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
      {stats.map((s) => (
        <div
          key={s.l}
          style={{
            flex: 1,
            minWidth: '130px',
            background: '#fff',
            border: '1px solid #dde3ec',
            borderRadius: '10px',
            padding: '14px 16px',
            boxShadow: '0 1px 3px rgba(20,43,81,.08)',
          }}
        >
          <div style={{ fontSize: '26px', fontWeight: 750, color: '#1d3c6f' }}>{s.n}</div>
          <div
            style={{
              fontSize: '12px',
              color: '#5c6678',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
            }}
          >
            {s.l}
          </div>
        </div>
      ))}
    </div>
  )
}
