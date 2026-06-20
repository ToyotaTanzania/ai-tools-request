'use server'

import { createClient } from '@/lib/supabase/server'
import type { RequestTool } from '@/lib/types'

export async function getRegistry(): Promise<{ data: RequestTool[] | null; error: string | null }> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'Not authenticated.' }

  const { data, error } = await supabase
    .from('request_tools')
    .select('*, requests(requester_name, requester_email, business_unit, created_at)')
    .order('updated_at', { ascending: false })

  if (error) return { data: null, error: error.message }

  return { data: data as RequestTool[], error: null }
}
