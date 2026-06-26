import { createAdminClient } from '@/lib/supabase/admin'
import { sendMail } from '@/lib/email'

function submissionDigest(
  requesterName: string,
  businessUnit: string,
  tools: Array<{ tool_name: string; vendor: string | null; business_use_case: string }>
): string {
  const rows = tools
    .map(
      (t, i) => `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:8px 12px">${i + 1}</td>
        <td style="padding:8px 12px"><strong>${t.tool_name}</strong></td>
        <td style="padding:8px 12px">${t.vendor || '—'}</td>
        <td style="padding:8px 12px">${t.business_use_case}</td>
      </tr>`
    )
    .join('')

  return `
    <p>A new AI tool request has been submitted and requires your review.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#f1f5f9">
        <td style="padding:8px 12px;font-weight:bold">Submitted by</td>
        <td style="padding:8px 12px">${requesterName}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-weight:bold">Business Unit</td>
        <td style="padding:8px 12px">${businessUnit}</td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#1d4ed8;color:#fff">
          <th style="padding:10px 12px;text-align:left">#</th>
          <th style="padding:10px 12px;text-align:left">Tool</th>
          <th style="padding:10px 12px;text-align:left">Vendor</th>
          <th style="padding:10px 12px;text-align:left">Business Use Case</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p>Please log in to the <strong>AI Tool Vetting Portal</strong> to approve or decline each tool.</p>`
}

function approvalForwardHtml(toolName: string, completedStage: string, requesterName: string): string {
  return `
    <p>An AI tool request has passed <strong>${completedStage}</strong> and requires your review.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#f1f5f9">
        <td style="padding:8px 12px;font-weight:bold">Tool</td>
        <td style="padding:8px 12px">${toolName}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-weight:bold">Requested by</td>
        <td style="padding:8px 12px">${requesterName}</td>
      </tr>
    </table>
    <p>Please log in to the <strong>AI Tool Vetting Portal</strong> to complete your review.</p>`
}

function approvedHtml(toolName: string, requesterName: string): string {
  return `
    <p>Dear ${requesterName},</p>
    <p>Your AI tool request has been <strong style="color:#16a34a">approved</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#f0fdf4">
        <td style="padding:8px 12px;font-weight:bold">Tool</td>
        <td style="padding:8px 12px">${toolName}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-weight:bold">Status</td>
        <td style="padding:8px 12px;color:#16a34a"><strong>Approved</strong></td>
      </tr>
    </table>
    <p>The tool has successfully passed all three review stages (IT, Legal &amp; Compliance, COO) and is approved for use within Karimjee Group.</p>`
}

function rejectedHtml(toolName: string, requesterName: string, stageLabel: string, reason: string): string {
  return `
    <p>Dear ${requesterName},</p>
    <p>Your AI tool request has been <strong style="color:#dc2626">declined</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr style="background:#fef2f2">
        <td style="padding:8px 12px;font-weight:bold">Tool</td>
        <td style="padding:8px 12px">${toolName}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;font-weight:bold">Declined at</td>
        <td style="padding:8px 12px">${stageLabel}</td>
      </tr>
      <tr style="background:#fef2f2">
        <td style="padding:8px 12px;font-weight:bold">Reason</td>
        <td style="padding:8px 12px">${reason}</td>
      </tr>
    </table>
    <p>If you have questions regarding this decision, please contact the reviewing team or your line manager.</p>`
}

export async function notifySubmission(requestId: string): Promise<void> {
  const supabase = createAdminClient()

  const { data: request } = await supabase
    .from('requests')
    .select('requester_name, business_unit')
    .eq('id', requestId)
    .single()

  const { data: tools } = await supabase
    .from('request_tools')
    .select('tool_name, vendor, business_use_case')
    .eq('request_id', requestId)

  const { data: itHeads } = await supabase
    .from('profiles')
    .select('email')
    .eq('role', 'it_head')

  if (!request || !tools?.length || !itHeads?.length) return

  await sendMail(
    itHeads.map((p) => p.email),
    `[Action Required] New AI Tool Request from ${request.requester_name}`,
    submissionDigest(request.requester_name, request.business_unit, tools)
  )
}

export async function notifyDecision(toolId: string): Promise<void> {
  const supabase = createAdminClient()

  const { data: tool } = await supabase
    .from('request_tools')
    .select('tool_name, stage, it_reason, legal_reason, coo_reason, requests!inner(requester_email, requester_name)')
    .eq('id', toolId)
    .single()

  if (!tool) return

  const req = tool.requests as unknown as { requester_email: string; requester_name: string }

  switch (tool.stage) {
    case 'legal_review': {
      const { data: legalUsers } = await supabase.from('profiles').select('email').eq('role', 'legal')
      if (legalUsers?.length) {
        await sendMail(
          legalUsers.map((p) => p.email),
          `[Action Required] IT Approved — Legal Review Needed: ${tool.tool_name}`,
          approvalForwardHtml(tool.tool_name, 'IT Review', req.requester_name)
        )
      }
      break
    }
    case 'coo_review': {
      const { data: cooUsers } = await supabase.from('profiles').select('email').eq('role', 'coo')
      if (cooUsers?.length) {
        await sendMail(
          cooUsers.map((p) => p.email),
          `[Action Required] Legal Approved — COO Review Needed: ${tool.tool_name}`,
          approvalForwardHtml(tool.tool_name, 'Legal & Compliance Review', req.requester_name)
        )
      }
      break
    }
    case 'approved': {
      await sendMail(
        [req.requester_email],
        `[Approved] Your AI Tool Request: ${tool.tool_name}`,
        approvedHtml(tool.tool_name, req.requester_name)
      )
      break
    }
    case 'rejected': {
      const reason = tool.coo_reason || tool.legal_reason || tool.it_reason || 'No reason provided.'
      const stageLabel = tool.coo_reason
        ? 'COO Review'
        : tool.legal_reason
          ? 'Legal & Compliance Review'
          : 'IT Review'
      await sendMail(
        [req.requester_email],
        `[Declined] Your AI Tool Request: ${tool.tool_name}`,
        rejectedHtml(tool.tool_name, req.requester_name, stageLabel, reason)
      )
      break
    }
  }
}
