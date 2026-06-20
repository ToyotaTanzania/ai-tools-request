import React from 'react'

type BadgeVariant = 'it' | 'legal' | 'coo' | 'approved' | 'rejected' | 'low' | 'medium' | 'high' | 'pending'

interface BadgeProps {
  variant: BadgeVariant
  label: string
}

const variantClasses: Record<BadgeVariant, string> = {
  it: 'bg-brand-light text-brand',
  legal: 'bg-purple-100 text-purple-700',
  coo: 'bg-warnbg text-warn',
  approved: 'bg-okbg text-ok',
  rejected: 'bg-badbg text-bad',
  low: 'bg-okbg text-ok',
  medium: 'bg-warnbg text-warn',
  high: 'bg-badbg text-bad',
  pending: 'bg-gray-100 text-gray-600',
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}

export function RiskBadge({ tier }: { tier: string | null }) {
  if (!tier) return null
  const v = tier.toLowerCase() as BadgeVariant
  const label = tier.charAt(0).toUpperCase() + tier.slice(1)
  return <Badge variant={v in variantClasses ? v : 'pending'} label={label} />
}

export function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    it_review: { variant: 'it', label: 'IT Review' },
    legal_review: { variant: 'legal', label: 'Legal Review' },
    coo_review: { variant: 'coo', label: 'COO Review' },
    approved: { variant: 'approved', label: 'Approved' },
    rejected: { variant: 'rejected', label: 'Rejected' },
  }
  const s = map[stage] || { variant: 'pending' as BadgeVariant, label: stage }
  return <Badge variant={s.variant} label={s.label} />
}
