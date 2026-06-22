import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UsersManagement } from '@/components/users/UsersManagement'

const ADMIN_EMAIL = 'abdulaziz.raudha@karimjee.com'

export default async function UsersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) redirect('/requests/new')

  return (
    <div>
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '22px', color: '#1d3c6f', margin: 0 }}>User Management</h2>
        <p style={{ color: '#5c6678', margin: '4px 0 0', fontSize: '13.5px' }}>
          Register new users, update roles, and manage system access.
        </p>
      </div>
      <UsersManagement />
    </div>
  )
}
