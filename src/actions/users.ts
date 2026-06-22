'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile, Role } from '@/lib/types'

const ADMIN_EMAIL = 'abdulaziz.raudha@karimjee.com'

async function assertAdmin() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function listUsers(): Promise<{ data: Profile[] | null; error: string | null }> {
  try {
    await assertAdmin()
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) return { data: null, error: error.message }
    return { data: data as Profile[], error: null }
  } catch (e: unknown) {
    return { data: null, error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function createUser(input: {
  email: string
  full_name: string
  role: Role
  password: string
}): Promise<{ error: string | null }> {
  'use server'
  try {
    await assertAdmin()

    if (!input.email.toLowerCase().endsWith('@karimjee.com')) {
      return { error: 'Only @karimjee.com email addresses are allowed.' }
    }

    if (!input.full_name.trim()) {
      return { error: 'Full name is required.' }
    }

    if (input.password.length < 8) {
      return { error: 'Password must be at least 8 characters.' }
    }

    const admin = createAdminClient()

    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.full_name.trim() },
    })

    if (authError || !authUser?.user) {
      return { error: authError?.message || 'Failed to create user.' }
    }

    const { error: profileError } = await admin
      .from('profiles')
      .upsert({
        id: authUser.user.id,
        email: input.email.trim().toLowerCase(),
        full_name: input.full_name.trim(),
        role: input.role,
      })

    if (profileError) {
      await admin.auth.admin.deleteUser(authUser.user.id)
      return { error: profileError.message }
    }

    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateUser(input: {
  id: string
  full_name: string
  role: Role
}): Promise<{ error: string | null }> {
  try {
    await assertAdmin()

    if (!input.full_name.trim()) {
      return { error: 'Full name is required.' }
    }

    const admin = createAdminClient()

    const { error } = await admin
      .from('profiles')
      .update({ full_name: input.full_name.trim(), role: input.role })
      .eq('id', input.id)

    if (error) return { error: error.message }
    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteUser(id: string): Promise<{ error: string | null }> {
  try {
    await assertAdmin()
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(id)
    if (error) return { error: error.message }
    return { error: null }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}
