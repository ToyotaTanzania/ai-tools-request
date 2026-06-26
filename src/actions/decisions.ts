'use server'

import { createClient } from '@/lib/supabase/server'
import { STAGE_FOR_ROLE, REVIEWER_ROLES } from '@/lib/constants'
import { notifyDecision } from '@/lib/notify'
import type { RequestTool, Role, Stage } from '@/lib/types'

export async function getQueue(): Promise<{ data: RequestTool[] | null; error: string | null }> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
    .single()

  const role = profile?.role as Role
  if (!role || !REVIEWER_ROLES.includes(role)) {
    return { data: null, error: 'Insufficient permissions.' }
  }

  const stage = STAGE_FOR_ROLE[role] as Stage

  const { data, error } = await supabase
    .from('request_tools')
    .select('*, requests!inner(requester_name, requester_email, business_unit, created_at, notes)')
    .eq('stage', stage)
    .order('created_at', { ascending: true })

  if (error) return { data: null, error: error.message }

  return { data: data as RequestTool[], error: null }
}

export async function getQueueCount(): Promise<number> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
    .single()

  const role = profile?.role as Role
  if (!role || !REVIEWER_ROLES.includes(role)) return 0

  const stage = STAGE_FOR_ROLE[role] as Stage

  const { count } = await supabase
    .from('request_tools')
    .select('*', { count: 'exact', head: true })
    .eq('stage', stage)

  return count || 0
}

export async function decideToolAction(
  toolId: string,
  decision: 'approve' | 'decline',
  reason: string
): Promise<{ success?: boolean; error?: string }> {
  if (decision === 'decline' && !reason?.trim()) {
    return { error: 'Reason is required when declining.' }
  }

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single()

  const role = profile?.role as Role
  if (!role || !REVIEWER_ROLES.includes(role)) {
    return { error: 'Insufficient permissions.' }
  }

  const { error } = await supabase.rpc('decide_tool', {
    p_tool_id: toolId,
    p_decision: decision,
    p_reason: reason || null,
  })

  if (error) return { error: error.message }

  notifyDecision(toolId).catch(() => {})

  return { success: true }
}
