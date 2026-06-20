import type { Role, Stage } from './types'

export const DATA_CATS: { value: string; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'internal', label: 'Internal' },
  { value: 'personal', label: 'Personal' },
  { value: 'customer_pii', label: 'Customer PII' },
  { value: 'employee', label: 'Employee Data' },
  { value: 'sensitive', label: 'Sensitive' },
]

export const INTEGS: { value: string; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'files', label: 'Files / Docs' },
  { value: 'databases', label: 'Databases' },
  { value: 'other', label: 'Other' },
]

export const ROLE_LABEL: Record<Role, string> = {
  employee: 'Employee',
  it_head: 'IT Head',
  legal: 'Legal',
  coo: 'COO',
  admin: 'Admin',
}

export const STAGE: Record<Stage, string> = {
  it_review: 'IT Review',
  legal_review: 'Legal Review',
  coo_review: 'COO Review',
  approved: 'Approved',
  rejected: 'Rejected',
}

export const STAGE_FOR_ROLE: Partial<Record<Role, Stage>> = {
  it_head: 'it_review',
  legal: 'legal_review',
  coo: 'coo_review',
  admin: 'it_review',
}

export const REVIEWER_ROLES: Role[] = ['it_head', 'legal', 'coo', 'admin']

export const BUSINESS_UNITS = [
  {
    cluster: 'Karimjee Group',
    units: [
      'Group Customer Engagement & Strategic Partnership',
      'Group Director\'s Office',
      'Group Facility Management',
      'Group Finance & Accounts',
      'Group Human Resources',
      'Group Information & Technology',
      'Group Internal Audit & Sys. Mngt',
      'Group Legal & Compliance',
      'Group Marketing',
      'Group Project Management',
      'Group Strategy',
      'Group Supply Chain',
      'Lubricants',
    ],
  },
  {
    cluster: 'Karimjee Mobility',
    units: [
      'Auto Inc. - Dar Kariakoo 1S Branch',
      'Auto Inc. - Dar Mikocheni 2S Branch',
      'Auto Inc. - Dar Samora 2S Branch',
      'Auto Inc. - Dar Tazara 2S Branch',
      'Auto Inc. - Dar Tegeta 2S Branch',
      'Auto Inc. - Dar Upanga 2S Branch',
      'Auto Inc. - Dar Victoria 2S Branch',
      'Auto Inc. Wholesale Parts',
      'Automark',
      'Group Finance & Accounts',
      'Mobility Support',
      'Motormart',
      'Toyota - Arusha 3S Branch',
      'Toyota - Bulyanhulu VMI 1S Branch',
      'Toyota - Dar North 2S Branch',
      'Toyota - Dar Pugu 3S Branch',
      'Toyota - GGM VMI 1S Branch',
      'Toyota - Kariakoo 1S Branch',
      'Toyota - Mbeya 2S Branch',
      'Toyota - North Mara VMI 1S Branch',
      'Toyota - Serengeti 2S Branch',
      'Toyota - Tanga 2S Branch',
      'Toyota New Vehicles',
      'Toyota OEM Wholesale Parts',
      'Yamaha',
    ],
  },
  {
    cluster: 'Karimjee Industrial',
    units: ['Bearings', 'Generators (KE)', 'Generators (TZ)', 'Generators (UG)', 'Logistics', 'Lubricants'],
  },
  {
    cluster: 'Karimjee Finance',
    units: [
      'Group Finance & Accounts',
      'Insurance',
      'Operating Lease (KE)',
      'Operating Lease (TZ)',
      'Operating Lease (UG)',
    ],
  },
  {
    cluster: 'Karimjee Real Estate & Hospitality',
    units: ['Commercial & Residential Real Estate', 'Hospitality', 'Investments'],
  },
  {
    cluster: 'Karimjee Family Office',
    units: ['Family Heritage Estates & Archive', 'Karimjee Foundation'],
  },
  {
    cluster: 'Karimjee Value Chain Limited',
    units: ['Toyota OEM Wholesale Parts'],
  },
]
