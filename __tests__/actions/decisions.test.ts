import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { decideToolAction } from '@/actions/decisions'
import { createClient } from '@/lib/supabase/server'

function makeMockSupabase(role = 'it_head') {
  const mockRpc = vi.fn().mockResolvedValue({ data: null, error: null })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-id', email: 'reviewer@karimjee.com' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role, id: 'user-id' }, error: null }),
    }),
    rpc: mockRpc,
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
  }
}

describe('decideToolAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when declining without reason', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await decideToolAction('tool-id', 'decline', '')
    expect(result?.error).toBe('Reason is required when declining.')
  })

  it('returns error when declining with whitespace-only reason', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await decideToolAction('tool-id', 'decline', '   ')
    expect(result?.error).toBe('Reason is required when declining.')
  })

  it('allows approving without reason', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await decideToolAction('tool-id', 'approve', '')
    // Should not error on missing reason for approval
    expect(result?.error).not.toBe('Reason is required when declining.')
  })

  it('returns error for insufficient permissions (employee role)', async () => {
    const mockSupabase = makeMockSupabase('employee')
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await decideToolAction('tool-id', 'approve', '')
    expect(result?.error).toBe('Insufficient permissions.')
  })
})
