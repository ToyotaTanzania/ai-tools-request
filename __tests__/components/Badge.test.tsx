import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge, RiskBadge, StageBadge } from '@/components/shared/Badge'

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge variant="approved" label="Approved" />)
    expect(screen.getByText('Approved')).toBeTruthy()
  })

  it('renders with different variants', () => {
    render(<Badge variant="rejected" label="Rejected" />)
    expect(screen.getByText('Rejected')).toBeTruthy()
  })
})

describe('RiskBadge', () => {
  it('renders null for null tier', () => {
    const { container } = render(<RiskBadge tier={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders low risk badge', () => {
    render(<RiskBadge tier="low" />)
    expect(screen.getByText('Low')).toBeTruthy()
  })

  it('renders high risk badge', () => {
    render(<RiskBadge tier="high" />)
    expect(screen.getByText('High')).toBeTruthy()
  })
})

describe('StageBadge', () => {
  it('renders IT Review for it_review stage', () => {
    render(<StageBadge stage="it_review" />)
    expect(screen.getByText('IT Review')).toBeTruthy()
  })

  it('renders Legal Review for legal_review stage', () => {
    render(<StageBadge stage="legal_review" />)
    expect(screen.getByText('Legal Review')).toBeTruthy()
  })

  it('renders Approved for approved stage', () => {
    render(<StageBadge stage="approved" />)
    expect(screen.getByText('Approved')).toBeTruthy()
  })

  it('renders Rejected for rejected stage', () => {
    render(<StageBadge stage="rejected" />)
    expect(screen.getByText('Rejected')).toBeTruthy()
  })
})
