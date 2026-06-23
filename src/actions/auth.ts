'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function isKarimjeeEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@karimjee.com')
}

export async function signIn(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (!isKarimjeeEmail(email)) {
    return { error: 'Only @karimjee.com email addresses are allowed.' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/requests/new')
}

export async function signUp(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const fullName = (formData.get('full_name') as string)?.trim()

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' }
  }

  if (!isKarimjeeEmail(email)) {
    return { error: 'Only @karimjee.com email addresses are allowed.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Sign in immediately after sign up
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { error: signInError.message }
  }

  redirect('/requests/new')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
