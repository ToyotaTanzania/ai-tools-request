'use server'

import { createClient } from '@/lib/supabase/server'
import { notifySubmission } from '@/lib/notify'
import type { NewRequestInput, RequestTool } from '@/lib/types'

export async function submitRequest(input: NewRequestInput) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  // Validate required fields
  if (!input.business_unit) {
    return { error: 'Business unit is required.' }
  }

  if (!input.tools || input.tools.length === 0) {
    return { error: 'At least one tool is required.' }
  }

  for (const tool of input.tools) {
    if (!tool.tool_name?.trim()) {
      return { error: 'Tool name is required for all tools.' }
    }
    if (!tool.business_use_case?.trim()) {
      return { error: 'Business use case is required for all tools.' }
    }
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single()

  const requesterName = profile?.full_name || user.email || ''
  const requesterEmail = profile?.email || user.email || ''

  // Insert request
  const { data: request, error: reqError } = await supabase
    .from('requests')
    .insert({
      requester_id: user.id,
      requester_email: requesterEmail,
      requester_name: requesterName,
      business_unit: input.business_unit,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (reqError || !request) {
    return { error: reqError?.message || 'Failed to create request.' }
  }

  // Insert tools
  const toolRows = input.tools.map((tool) => ({
    request_id: request.id,
    tool_name: tool.tool_name.trim(),
    vendor: tool.vendor?.trim() || null,
    url: tool.url?.trim() || null,
    business_use_case: tool.business_use_case.trim(),
    users_desc: tool.users_desc?.trim() || null,
    expected_count: tool.expected_count ? parseInt(tool.expected_count) : null,
    data_categories: tool.data_categories || [],
    data_residency: tool.data_residency || null,
    model_training: tool.model_training || null,
    training_opt_out: tool.training_opt_out || null,
    integrations: tool.integrations || [],
    go_live_date: tool.go_live_date || null,
    dpo_aware: tool.dpo_aware || false,
    stage: 'it_review',
  }))

  const { data: tools, error: toolsError } = await supabase
    .from('request_tools')
    .insert(toolRows)
    .select()

  if (toolsError || !tools) {
    return { error: toolsError?.message || 'Failed to create tools.' }
  }

  // Insert audit entries
  const auditRows = tools.map((tool) => ({
    tool_id: tool.id,
    request_id: request.id,
    actor_email: requesterEmail,
    actor_role: profile?.role || 'employee',
    action: 'submitted',
    from_stage: null,
    to_stage: 'it_review',
  }))

  await supabase.from('tool_audit').insert(auditRows)

  notifySubmission(request.id).catch(() => {})

  return { success: true, requestId: request.id }
}

export async function getMyRequests(): Promise<{ data: RequestTool[] | null; error: string | null }> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: 'Not authenticated.' }
  }

  const { data, error } = await supabase
    .from('request_tools')
    .select('*, requests!inner(requester_id, business_unit, created_at, notes)')
    .eq('requests.requester_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as RequestTool[], error: null }
}
