import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase server module
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

import { submitRequest } from '@/actions/requests'
import { createClient } from '@/lib/supabase/server'

function makeMockSupabase(overrides: Record<string, unknown> = {}) {
  const mockSingle = vi.fn().mockResolvedValue({ data: { id: 'user-id', email: 'test@karimjee.com' }, error: null })
  const mockInsert = vi.fn().mockReturnThis()
  const mockSelect = vi.fn().mockReturnThis()

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-id', email: 'test@karimjee.com' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      eq: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: mockSingle,
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
    ...overrides,
  }
}

describe('submitRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error when business_unit is missing', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await submitRequest({
      business_unit: '',
      notes: '',
      tools: [
        {
          tool_name: 'ChatGPT',
          vendor: 'OpenAI',
          url: '',
          business_use_case: 'Writing help',
          users_desc: '',
          expected_count: '',
          data_categories: [],
          data_residency: '',
          model_training: '',
          training_opt_out: '',
          integrations: [],
          go_live_date: '',
          dpo_aware: false,
        },
      ],
    })

    expect(result?.error).toBe('Business unit is required.')
  })

  it('returns error when tools array is empty', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await submitRequest({
      business_unit: 'Group IT',
      notes: '',
      tools: [],
    })

    expect(result?.error).toBe('At least one tool is required.')
  })

  it('returns error when tool_name is missing', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await submitRequest({
      business_unit: 'Group IT',
      notes: '',
      tools: [
        {
          tool_name: '',
          vendor: '',
          url: '',
          business_use_case: 'Some use case',
          users_desc: '',
          expected_count: '',
          data_categories: [],
          data_residency: '',
          model_training: '',
          training_opt_out: '',
          integrations: [],
          go_live_date: '',
          dpo_aware: false,
        },
      ],
    })

    expect(result?.error).toBe('Tool name is required for all tools.')
  })

  it('returns error when business_use_case is missing', async () => {
    const mockSupabase = makeMockSupabase()
    vi.mocked(createClient).mockReturnValue(mockSupabase as unknown as ReturnType<typeof createClient>)

    const result = await submitRequest({
      business_unit: 'Group IT',
      notes: '',
      tools: [
        {
          tool_name: 'ChatGPT',
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
        },
      ],
    })

    expect(result?.error).toBe('Business use case is required for all tools.')
  })
})
