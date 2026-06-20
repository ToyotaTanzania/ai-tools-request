import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QueueList } from '@/components/queue/QueueList'
import { REVIEWER_ROLES } from '@/lib/constants'
import type { Role } from '@/lib/types'

export default async function QueuePage() {
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
        <h2 style={{ fontSize: '22px', color: '#1d3c6f', margin: 0 }}>My Review Queue</h2>
        <p style={{ color: '#5c6678', margin: '4px 0 0', fontSize: '13.5px' }}>
          Review and decide on AI tool submissions awaiting your approval.
        </p>
      </div>
      <Suspense fallback={<div style={{ color: '#5c6678', padding: '20px' }}>Loading queue…</div>}>
        <QueueList />
      </Suspense>
    </div>
  )
}
