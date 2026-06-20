import { describe, it, expect } from 'vitest'
import { STAGE_FOR_ROLE, DATA_CATS, ROLE_LABEL, BUSINESS_UNITS } from '@/lib/constants'

describe('STAGE_FOR_ROLE', () => {
  it('maps it_head to it_review', () => {
    expect(STAGE_FOR_ROLE['it_head']).toBe('it_review')
  })

  it('maps legal to legal_review', () => {
    expect(STAGE_FOR_ROLE['legal']).toBe('legal_review')
  })

  it('maps coo to coo_review', () => {
    expect(STAGE_FOR_ROLE['coo']).toBe('coo_review')
  })

  it('maps admin to it_review', () => {
    expect(STAGE_FOR_ROLE['admin']).toBe('it_review')
  })

  it('does not map employee', () => {
    expect(STAGE_FOR_ROLE['employee']).toBeUndefined()
  })
})

describe('DATA_CATS', () => {
  it('has correct labels', () => {
    const labels = DATA_CATS.map((c) => c.label)
    expect(labels).toContain('Public')
    expect(labels).toContain('Internal')
    expect(labels).toContain('Customer PII')
    expect(labels).toContain('Employee Data')
    expect(labels).toContain('Sensitive')
  })

  it('has correct values', () => {
    const values = DATA_CATS.map((c) => c.value)
    expect(values).toContain('public')
    expect(values).toContain('customer_pii')
    expect(values).toContain('personal')
    expect(values).toContain('employee')
    expect(values).toContain('sensitive')
  })
})

describe('ROLE_LABEL', () => {
  it('has correct label for employee', () => {
    expect(ROLE_LABEL['employee']).toBe('Employee')
  })

  it('has correct label for it_head', () => {
    expect(ROLE_LABEL['it_head']).toBe('IT Head')
  })

  it('has correct label for admin', () => {
    expect(ROLE_LABEL['admin']).toBe('Admin')
  })
})

describe('BUSINESS_UNITS', () => {
  it('has multiple clusters', () => {
    expect(BUSINESS_UNITS.length).toBeGreaterThan(1)
  })

  it('contains Karimjee Group cluster', () => {
    const kg = BUSINESS_UNITS.find((b) => b.cluster === 'Karimjee Group')
    expect(kg).toBeDefined()
    expect(kg?.units.length).toBeGreaterThan(0)
  })

  it('contains Karimjee Mobility cluster', () => {
    const km = BUSINESS_UNITS.find((b) => b.cluster === 'Karimjee Mobility')
    expect(km).toBeDefined()
  })
})
