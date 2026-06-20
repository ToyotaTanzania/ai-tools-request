import { describe, it, expect } from 'vitest'
import { computePipelineDots } from '@/components/shared/PipelineTracker'
import type { RequestTool } from '@/lib/types'

type PipelineTool = Pick<RequestTool, 'stage' | 'it_status' | 'legal_status' | 'coo_status' | 'final_status'>

describe('computePipelineDots', () => {
  it('returns all done when final_status is approved', () => {
    const tool: PipelineTool = {
      stage: 'approved',
      it_status: 'approved',
      legal_status: 'approved',
      coo_status: 'approved',
      final_status: 'approved',
    }
    expect(computePipelineDots(tool)).toEqual(['done', 'done', 'done'])
  })

  it('returns cur at it_review stage', () => {
    const tool: PipelineTool = {
      stage: 'it_review',
      it_status: null,
      legal_status: null,
      coo_status: null,
      final_status: null,
    }
    expect(computePipelineDots(tool)).toEqual(['cur', 'default', 'default'])
  })

  it('returns done + cur at legal_review stage', () => {
    const tool: PipelineTool = {
      stage: 'legal_review',
      it_status: 'approved',
      legal_status: null,
      coo_status: null,
      final_status: null,
    }
    expect(computePipelineDots(tool)).toEqual(['done', 'cur', 'default'])
  })

  it('returns done + done + cur at coo_review stage', () => {
    const tool: PipelineTool = {
      stage: 'coo_review',
      it_status: 'approved',
      legal_status: 'approved',
      coo_status: null,
      final_status: null,
    }
    expect(computePipelineDots(tool)).toEqual(['done', 'done', 'cur'])
  })

  it('returns rej at dot 0 when it_status is declined', () => {
    const tool: PipelineTool = {
      stage: 'rejected',
      it_status: 'declined',
      legal_status: null,
      coo_status: null,
      final_status: 'rejected',
    }
    const dots = computePipelineDots(tool)
    expect(dots[0]).toBe('rej')
    expect(dots[1]).toBe('default')
    expect(dots[2]).toBe('default')
  })

  it('returns rej at dot 1 when legal_status is declined', () => {
    const tool: PipelineTool = {
      stage: 'rejected',
      it_status: 'approved',
      legal_status: 'declined',
      coo_status: null,
      final_status: 'rejected',
    }
    const dots = computePipelineDots(tool)
    expect(dots[0]).toBe('done')
    expect(dots[1]).toBe('rej')
    expect(dots[2]).toBe('default')
  })

  it('returns rej at dot 2 when coo_status is declined', () => {
    const tool: PipelineTool = {
      stage: 'rejected',
      it_status: 'approved',
      legal_status: 'approved',
      coo_status: 'declined',
      final_status: 'rejected',
    }
    const dots = computePipelineDots(tool)
    expect(dots[0]).toBe('done')
    expect(dots[1]).toBe('done')
    expect(dots[2]).toBe('rej')
  })
})
