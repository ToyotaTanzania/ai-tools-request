import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { TabNav } from '@/components/layout/TabNav'
import type { Profile } from '@/lib/types'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .limit(1)
    .single()

  if (!profile) {
    // Fallback profile from auth data
    const fallbackProfile: Profile = {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email || '',
      role: 'employee',
    }

    return (
      <div>
        <Header profile={fallbackProfile} />
        <TabNav profile={fallbackProfile} />
        <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '26px 22px 60px' }}>
          {children}
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header profile={profile as Profile} />
      <TabNav profile={profile as Profile} />
      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '26px 22px 60px' }}>
        {children}
      </main>
    </div>
  )
}
