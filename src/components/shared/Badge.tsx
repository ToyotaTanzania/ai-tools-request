import React from 'react'

type BadgeVariant = 'it' | 'legal' | 'coo' | 'approved' | 'rejected' | 'low' | 'medium' | 'high' | 'pending'

interface BadgeProps {
  variant: BadgeVariant
  label: string
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  it:       { background: '#e7ecf4', color: '#1d3c6f' },
  legal:    { background: '#dfe6f1', color: '#184377' },
  coo:      { background: '#1d3c6f', color: '#fff' },
  approved: { background: '#1d3c6f', color: '#fff' },
  rejected: { background: '#eef1f5', color: '#5c6678', border: '1px solid #cdd3dd' },
  low:      { background: '#eef1f5', color: '#5c6678' },
  medium:   { background: '#dfe6f1', color: '#184377' },
  high:     { background: '#1d3c6f', color: '#fff' },
  pending:  { background: '#eef1f5', color: '#5c6678' },
}

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11.5px',
        fontWeight: 700,
        letterSpacing: '.02em',
        ...variantStyles[variant],
      }}
    >
      {label}
    </span>
  )
}

export function RiskBadge({ tier }: { tier: string | null }) {
  if (!tier) return null
  const v = tier.toLowerCase() as BadgeVariant
  const label = tier.charAt(0).toUpperCase() + tier.slice(1)
  return <Badge variant={v in variantStyles ? v : 'pending'} label={label} />
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
