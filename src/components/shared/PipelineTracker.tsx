import React from 'react'
import type { RequestTool } from '@/lib/types'

type DotState = 'done' | 'cur' | 'rej' | 'default'

interface PipelineTrackerProps {
  tool: Pick<
    RequestTool,
    'stage' | 'it_status' | 'legal_status' | 'coo_status' | 'final_status'
  >
}

const STEPS = [
  { label: 'IT', stage: 'it_review', statusKey: 'it_status' as const },
  { label: 'Legal', stage: 'legal_review', statusKey: 'legal_status' as const },
  { label: 'COO', stage: 'coo_review', statusKey: 'coo_status' as const },
]

export function computePipelineDots(
  tool: Pick<RequestTool, 'stage' | 'it_status' | 'legal_status' | 'coo_status' | 'final_status'>
): DotState[] {
  const { stage, it_status, legal_status, coo_status, final_status } = tool

  if (final_status === 'approved' || stage === 'approved') {
    return ['done', 'done', 'done']
  }

  if (stage === 'rejected' || final_status === 'rejected') {
    const dots: DotState[] = ['done', 'done', 'done']
    if (it_status === 'declined') {
      dots[0] = 'rej'
      dots[1] = 'default'
      dots[2] = 'default'
    } else if (legal_status === 'declined') {
      dots[0] = 'done'
      dots[1] = 'rej'
      dots[2] = 'default'
    } else if (coo_status === 'declined') {
      dots[0] = 'done'
      dots[1] = 'done'
      dots[2] = 'rej'
    }
    return dots
  }

  const stageIndex = STEPS.findIndex((s) => s.stage === stage)

  return STEPS.map((_, i) => {
    if (i < stageIndex) return 'done'
    if (i === stageIndex) return 'cur'
    return 'default'
  })
}

const dotClasses: Record<DotState, string> = {
  done: 'bg-ok text-white',
  cur: 'bg-brand text-white shadow-[0_0_0_4px_#e9eef6]',
  rej: 'bg-bad text-white',
  default: 'bg-gray-200 text-muted',
}

export function PipelineTracker({ tool }: PipelineTrackerProps) {
  const dots = computePipelineDots(tool)

  return (
    <div className="flex items-center gap-0 my-1">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.stage}>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <div
              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold ${dotClasses[dots[i]]}`}
            >
              {dots[i] === 'done' ? '✓' : dots[i] === 'rej' ? '✕' : i + 1}
            </div>
            <span>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-[34px] h-0.5 ${dots[i] === 'done' ? 'bg-ok' : 'bg-line'}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
