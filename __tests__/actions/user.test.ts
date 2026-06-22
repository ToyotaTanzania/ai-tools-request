import { describe, it, expect, afterAll } from 'vitest'
import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const TEST_USER = {
  email: 'feisal.ali@karimjee.com',
  full_name: 'Feisal Ali',
  role: 'employee' as const,
  password: 'Karimjee2026',
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SECRET_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

describe('User management — create and delete', () => {
  let createdUserId: string | null = null

  it('creates user in auth and profiles table', async () => {
    const admin = getAdminClient()

    const { data, error } = await admin.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
      user_metadata: { full_name: TEST_USER.full_name },
    })

    expect(error).toBeNull()
    expect(data?.user).toBeDefined()
    expect(data?.user?.email).toBe(TEST_USER.email)

    createdUserId = data!.user!.id

    const { error: profileError } = await admin
      .from('profiles')
      .upsert({
        id: createdUserId,
        email: TEST_USER.email,
        full_name: TEST_USER.full_name,
        role: TEST_USER.role,
      })

    expect(profileError).toBeNull()

    const { data: profile, error: fetchError } = await admin
      .from('profiles')
      .select('*')
      .eq('id', createdUserId)
      .single()

    expect(fetchError).toBeNull()
    expect(profile?.email).toBe(TEST_USER.email)
    expect(profile?.full_name).toBe(TEST_USER.full_name)
    expect(profile?.role).toBe(TEST_USER.role)
  })

  it('removes user from auth and profiles table', async () => {
    expect(createdUserId).not.toBeNull()

    const admin = getAdminClient()

    const { error: deleteError } = await admin.auth.admin.deleteUser(createdUserId!)
    expect(deleteError).toBeNull()

    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('id', createdUserId!)
      .maybeSingle()

    expect(profile).toBeNull()
  })

  afterAll(async () => {
    // Safety cleanup if test failed mid-way
    if (createdUserId) {
      const admin = getAdminClient()
      await admin.auth.admin.deleteUser(createdUserId)
    }
  })
})
