import React from 'react'
import type { RequestTool } from '@/lib/types'
import { PipelineTracker } from './PipelineTracker'
import { RiskBadge, StageBadge } from './Badge'
import { fmtDate, fmtDateTime } from '@/lib/utils'
import { DATA_CATS, INTEGS } from '@/lib/constants'

interface ToolCardProps {
  tool: RequestTool
  children?: React.ReactNode
}

function DataLabel({ value }: { value: string }) {
  const cat = DATA_CATS.find((c) => c.value === value)
  return <span>{cat ? cat.label : value}</span>
}

function IntegLabel({ value }: { value: string }) {
  const integ = INTEGS.find((i) => i.value === value)
  return <span>{integ ? integ.label : value}</span>
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <span className="text-muted font-semibold text-xs">{k}</span>
      <span className="text-sm">{v || '—'}</span>
    </>
  )
}

function DecisionNote({
  status,
  reason,
  by,
  at,
  label,
}: {
  status: string | null
  reason: string | null
  by: string | null
  at: string | null
  label: string
}) {
  if (!status || status === 'pending') return null
  const isApproved = status === 'approved'
  return (
    <div
      className={`mt-2 pl-3 py-2 pr-2 rounded-r-md text-xs border-l-[3px] bg-gray-50 ${
        isApproved ? 'border-ok' : 'border-bad'
      }`}
    >
      <span className="font-bold">{label}:</span>{' '}
      <span className={isApproved ? 'text-ok' : 'text-bad'}>{isApproved ? 'Approved' : 'Declined'}</span>
      {reason && <span> — {reason}</span>}
      {by && (
        <span className="text-muted ml-2">
          by {by} {at ? `· ${fmtDateTime(at)}` : ''}
        </span>
      )}
    </div>
  )
}

export function ToolCard({ tool, children }: ToolCardProps) {
  const req = tool.requests || {}

  return (
    <div className="bg-card border border-line rounded-card shadow-card mb-4">
      <div className="px-4 py-3 border-b border-line flex justify-between items-start flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-ink">{tool.tool_name}</h3>
            <RiskBadge tier={tool.risk_tier} />
            <StageBadge stage={tool.stage} />
          </div>
          {tool.vendor && <p className="text-muted text-xs mt-0.5">{tool.vendor}</p>}
        </div>
        <PipelineTracker tool={tool} />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm mb-3">
          {req.requester_name && (
            <KV k="Requested by" v={`${req.requester_name} (${req.requester_email})`} />
          )}
          {req.business_unit && <KV k="Business unit" v={req.business_unit} />}
          {req.created_at && <KV k="Submitted" v={fmtDate(req.created_at)} />}
          <KV
            k="URL"
            v={
              tool.url ? (
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                  {tool.url}
                </a>
              ) : null
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 border-t border-line pt-3">
          <KV k="Business use case" v={tool.business_use_case} />
          {tool.users_desc && <KV k="Users" v={`${tool.users_desc}${tool.expected_count ? ` (${tool.expected_count})` : ''}`} />}
          {tool.data_categories?.length > 0 && (
            <KV
              k="Data categories"
              v={
                <span className="flex flex-wrap gap-1">
                  {tool.data_categories.map((c) => (
                    <span key={c} className="bg-brand-light text-brand text-xs px-2 py-0.5 rounded-full">
                      <DataLabel value={c} />
                    </span>
                  ))}
                </span>
              }
            />
          )}
          {tool.data_residency && <KV k="Data residency" v={tool.data_residency} />}
          {tool.model_training && <KV k="Model training" v={tool.model_training} />}
          {tool.training_opt_out && <KV k="Training opt-out" v={tool.training_opt_out} />}
          {tool.integrations?.length > 0 && (
            <KV
              k="Integrations"
              v={
                <span className="flex flex-wrap gap-1">
                  {tool.integrations.map((i) => (
                    <span key={i} className="bg-gray-100 text-muted text-xs px-2 py-0.5 rounded-full">
                      <IntegLabel value={i} />
                    </span>
                  ))}
                </span>
              }
            />
          )}
          {tool.go_live_date && <KV k="Go-live date" v={fmtDate(tool.go_live_date)} />}
          <KV k="DPO aware" v={tool.dpo_aware ? 'Yes' : 'No'} />
        </div>

        <div className="mt-3 border-t border-line pt-3 space-y-1">
          <DecisionNote
            status={tool.it_status}
            reason={tool.it_reason}
            by={tool.it_by}
            at={tool.it_at}
            label="IT"
          />
          <DecisionNote
            status={tool.legal_status}
            reason={tool.legal_reason}
            by={tool.legal_by}
            at={tool.legal_at}
            label="Legal"
          />
          <DecisionNote
            status={tool.coo_status}
            reason={tool.coo_reason}
            by={tool.coo_by}
            at={tool.coo_at}
            label="COO"
          />
        </div>

        {children && <div className="mt-3 border-t border-line pt-3">{children}</div>}
      </div>
    </div>
  )
}
