import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { RegistryTable } from '@/components/registry/RegistryTable'
import { REVIEWER_ROLES } from '@/lib/constants'
import type { Role } from '@/lib/types'

export default async function RegistryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
    .single()

  const role = profile?.role as Role
  if (!role || !REVIEWER_ROLES.includes(role)) {
    redirect('/requests/new')
  }

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '22px', color: '#1d3c6f', margin: 0 }}>AI Tool Registry</h2>
        <p style={{ color: '#5c6678', margin: '4px 0 0', fontSize: '13.5px' }}>
          Group-wide view of all AI tools submitted for vetting.
        </p>
      </div>
      <Suspense fallback={<div style={{ color: '#5c6678', padding: '20px' }}>Loading registry…</div>}>
        <RegistryTable />
      </Suspense>
    </div>
  )
}
