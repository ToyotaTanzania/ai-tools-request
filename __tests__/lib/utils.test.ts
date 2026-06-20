import { describe, it, expect } from 'vitest'
import { fmtDate, fmtDateTime } from '@/lib/utils'

describe('fmtDate', () => {
  it('returns — for null', () => {
    expect(fmtDate(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(fmtDate(undefined)).toBe('—')
  })

  it('returns — for empty string', () => {
    expect(fmtDate('')).toBe('—')
  })

  it('returns — for invalid date', () => {
    expect(fmtDate('not-a-date')).toBe('—')
  })

  it('formats a valid date string', () => {
    const result = fmtDate('2024-01-15')
    expect(result).toContain('Jan')
    expect(result).toContain('2024')
  })

  it('formats an ISO datetime string', () => {
    const result = fmtDate('2024-06-20T10:30:00Z')
    expect(result).toContain('2024')
  })
})

describe('fmtDateTime', () => {
  it('returns — for null', () => {
    expect(fmtDateTime(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(fmtDateTime(undefined)).toBe('—')
  })

  it('returns — for empty string', () => {
    expect(fmtDateTime('')).toBe('—')
  })

  it('returns — for invalid date', () => {
    expect(fmtDateTime('invalid')).toBe('—')
  })

  it('formats a valid ISO datetime', () => {
    const result = fmtDateTime('2024-01-15T14:30:00Z')
    expect(result).toContain('2024')
    expect(result).toContain('Jan')
  })
})
