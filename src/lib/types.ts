export type Role = 'employee' | 'it_head' | 'legal' | 'coo' | 'admin'

export type Stage = 'it_review' | 'legal_review' | 'coo_review' | 'approved' | 'rejected'

export type StageStatus = 'pending' | 'approved' | 'declined'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
}

export interface Request {
  id: string
  requester_id: string
  requester_email: string
  requester_name: string
  business_unit: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface RequestTool {
  id: string
  request_id: string
  tool_name: string
  vendor: string | null
  url: string | null
  business_use_case: string
  users_desc: string | null
  expected_count: number | null
  data_categories: string[]
  data_residency: string | null
  model_training: string | null
  training_opt_out: string | null
  integrations: string[]
  go_live_date: string | null
  dpo_aware: boolean
  stage: Stage
  final_status: string | null
  risk_tier: string | null
  it_status: StageStatus | null
  it_reason: string | null
  it_by: string | null
  it_at: string | null
  legal_status: StageStatus | null
  legal_reason: string | null
  legal_by: string | null
  legal_at: string | null
  coo_status: StageStatus | null
  coo_reason: string | null
  coo_by: string | null
  coo_at: string | null
  created_at: string
  updated_at: string
  requests?: Partial<Request>
}

export interface ToolAudit {
  id: string
  tool_id: string
  request_id: string
  actor_email: string
  actor_role: string
  action: string
  from_stage: string | null
  to_stage: string | null
  created_at: string
}

export interface NewToolInput {
  tool_name: string
  vendor: string
  url: string
  business_use_case: string
  users_desc: string
  expected_count: string
  data_categories: string[]
  data_residency: string
  model_training: string
  training_opt_out: string
  integrations: string[]
  go_live_date: string
  dpo_aware: boolean
}

export interface NewRequestInput {
  business_unit: string
  notes: string
  tools: NewToolInput[]
}
