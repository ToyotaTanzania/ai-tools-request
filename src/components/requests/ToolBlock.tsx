'use client'

import React from 'react'
import { DATA_CATS, INTEGS, BUSINESS_UNITS } from '@/lib/constants'
import type { NewToolInput } from '@/lib/types'

interface ToolBlockProps {
  index: number
  tool: NewToolInput
  onChange: (index: number, updates: Partial<NewToolInput>) => void
  onRemove: (index: number) => void
  canRemove: boolean
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

export function ToolBlock({ index, tool, onChange, onRemove, canRemove }: ToolBlockProps) {
  function toggle(field: 'data_categories' | 'integrations', value: string) {
    const arr = tool[field] as string[]
    if (arr.includes(value)) {
      onChange(index, { [field]: arr.filter((v) => v !== value) })
    } else {
      onChange(index, { [field]: [...arr, value] })
    }
  }

  return (
    <div
      style={{
        border: '1px solid #dde3ec',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '14px',
        position: 'relative',
        background: '#fcfdff',
      }}
    >
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#eef1f5',
            color: '#5c6678',
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ×
        </button>
      )}

      <div
        style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#184377',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}
      >
        Tool #{index + 1}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div>
          <label style={labelStyle}>Tool name *</label>
          <input
            style={inputStyle}
            value={tool.tool_name}
            onChange={(e) => onChange(index, { tool_name: e.target.value })}
            placeholder="e.g. ChatGPT"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Vendor</label>
          <input
            style={inputStyle}
            value={tool.vendor}
            onChange={(e) => onChange(index, { vendor: e.target.value })}
            placeholder="e.g. OpenAI"
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>URL</label>
          <input
            style={inputStyle}
            value={tool.url}
            onChange={(e) => onChange(index, { url: e.target.value })}
            placeholder="https://"
            type="url"
          />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Business use case *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
            value={tool.business_use_case}
            onChange={(e) => onChange(index, { business_use_case: e.target.value })}
            placeholder="Describe how this tool will be used..."
            required
          />
        </div>
        <div>
          <label style={labelStyle}>Users description</label>
          <input
            style={inputStyle}
            value={tool.users_desc}
            onChange={(e) => onChange(index, { users_desc: e.target.value })}
            placeholder="e.g. Finance team"
          />
        </div>
        <div>
          <label style={labelStyle}>Expected user count</label>
          <input
            style={inputStyle}
            type="number"
            min="0"
            value={tool.expected_count}
            onChange={(e) => onChange(index, { expected_count: e.target.value })}
            placeholder="e.g. 10"
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Data categories</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {DATA_CATS.map((cat) => {
              const on = tool.data_categories.includes(cat.value)
              return (
                <label
                  key={cat.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    border: `1px solid ${on ? '#1d3c6f' : '#dde3ec'}`,
                    borderRadius: '8px',
                    padding: '7px 11px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: on ? '#e7ecf4' : '#fff',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle('data_categories', cat.value)}
                    style={{ width: 'auto' }}
                  />
                  {cat.label}
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Data residency</label>
          <select
            style={inputStyle}
            value={tool.data_residency}
            onChange={(e) => onChange(index, { data_residency: e.target.value })}
          >
            <option value="">Select…</option>
            <option value="Tanzania">Tanzania</option>
            <option value="USA">USA</option>
            <option value="EU">EU</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Model training</label>
          <select
            style={inputStyle}
            value={tool.model_training}
            onChange={(e) => onChange(index, { model_training: e.target.value })}
          >
            <option value="">Select…</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Training opt-out</label>
          <select
            style={inputStyle}
            value={tool.training_opt_out}
            onChange={(e) => onChange(index, { training_opt_out: e.target.value })}
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="na">N/A</option>
          </select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Integrations</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {INTEGS.map((integ) => {
              const on = tool.integrations.includes(integ.value)
              return (
                <label
                  key={integ.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    border: `1px solid ${on ? '#1d3c6f' : '#dde3ec'}`,
                    borderRadius: '8px',
                    padding: '7px 11px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: on ? '#e7ecf4' : '#fff',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle('integrations', integ.value)}
                    style={{ width: 'auto' }}
                  />
                  {integ.label}
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Go-live date</label>
          <input
            style={inputStyle}
            type="date"
            value={tool.go_live_date}
            onChange={(e) => onChange(index, { go_live_date: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
          <input
            type="checkbox"
            id={`dpo_${index}`}
            checked={tool.dpo_aware}
            onChange={(e) => onChange(index, { dpo_aware: e.target.checked })}
            style={{ width: 'auto' }}
          />
          <label htmlFor={`dpo_${index}`} style={{ ...labelStyle, margin: 0 }}>
            DPO is aware of this tool
          </label>
        </div>
      </div>
    </div>
  )
}
