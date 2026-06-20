# Karimjee Group — AI Tool Vetting & Approval System
### Administrator & Setup Guide

A working, Supabase-backed approval system implementing the *Tools Responsible Use Standard*. Employees submit one or more AI tools; each tool is routed **independently** through a three-stage pipeline:

**Group IT Head → Group Legal & Compliance → Group COO (final)**

Any reviewer can approve (advances to next stage) or decline (a reason is mandatory; the tool stops and is marked rejected). Each tool is tracked separately, so a single request can have some tools approved and others rejected.

---

## 1. What was built

**Backend — Supabase project `AI-Tool-Vetting`**
- Dedicated project (region eu-west-1), isolated from your other projects.
- Tables: `requests`, `request_tools` (the pipeline unit), `profiles`, `role_assignments`, `tool_audit`.
- Company-email authentication restricted to **@karimjee.com** (enforced at sign-up).
- Automatic role assignment by email and automatic **risk-tier classification** (Low / Medium / High) based on data categories and integrations, per Section 4 of the Standard.
- Row-Level Security on every table. All pipeline transitions go through one hardened, role-gated database function (`decide_tool`) — a user cannot approve out of turn or skip a stage even if they bypass the UI.
- Full audit trail of every submission and decision.

**Frontend — `karimjee-ai-tool-vetting.html`**
- Single, self-contained, Karimjee-branded file (color `#1d3c6f`).
- Login / sign-up, role-aware navigation, the streamlined intake form (multi-tool), reviewer queues with per-tool approve/decline + reason, a visual IT→Legal→COO pipeline tracker, and the group-wide AI Tool Registry with live stats.

---

## 2. Pre-configured accounts

Temporary passwords — **change these on first login** (and confirm the Legal/COO email addresses below).

| Role | Email | Temp password |
|---|---|---|
| Group IT Head (you) | `abdulaziz.raudha@karimjee.com` | `Karimjee#IT2026` |
| Group Legal & Compliance | `lucia.minde@karimjee.com` | `Karimjee#Legal2026` |
| Group COO | `amir.abdelazim@karimjee.com` | `Karimjee#COO2026` |
| Demo employee (testing) | `employee.demo@karimjee.com` | `Karimjee#Emp2026` |

> The Legal and COO emails were assumed from the `firstname.lastname@karimjee.com` pattern. If they differ, see §5 to correct them.

---

## 3. Running it

Open `karimjee-ai-tool-vetting.html` in any modern browser — it connects directly to the live Supabase backend. To roll out to staff, host the single file on any static host (SharePoint, internal web server, Netlify, Vercel, or Supabase Storage) and share the link.

**Quick test of the full pipeline:**
1. Sign in as the demo employee → **New Request** → add 1–2 tools → submit.
2. Sign in as IT Head → **My Review Queue** → approve one, decline one (with a reason).
3. Sign in as Legal → approve the advanced tool.
4. Sign in as COO → issue the final decision.
5. As any reviewer → **AI Tool Registry** to see the full trail.

---

## 4. One auth setting to decide (for new employees)

The pre-created accounts work immediately. For **new employees signing themselves up**, Supabase defaults to requiring email confirmation, and the built-in email sender is rate-limited. Choose one:

- **Fastest (internal pilot):** Supabase Dashboard → *Authentication → Providers → Email* → turn **"Confirm email" OFF**. New @karimjee.com staff can then sign up and log in instantly.
- **Production-grade (recommended):** Dashboard → *Authentication → Emails / SMTP* → configure your Microsoft 365 / corporate SMTP so confirmation and reset emails come from Karimjee. Keep confirmation ON.

Also recommended: *Authentication → Policies* → enable **Leaked Password Protection** (HaveIBeenPwned check).

---

## 5. Common admin tasks (run in Supabase → SQL Editor)

**Correct a reviewer's email / add a reviewer** (role auto-applies when they sign up):
```sql
insert into public.role_assignments(email, role, full_name)
values ('correct.email@karimjee.com','legal','Lucia Minde')
on conflict (email) do update set role=excluded.role, full_name=excluded.full_name;
```
Roles: `employee`, `it_head`, `legal`, `coo`, `admin`.

**Change an existing user's role immediately:**
```sql
update public.profiles set role='coo' where email='someone@karimjee.com';
```

**Project reference:** `wkjonqeezxtjbqvlzggh` · URL `https://wkjonqeezxtjbqvlzggh.supabase.co`

---

## 6. Email notifications (approval workflow)

Notifications are sent automatically by a secured Supabase **Edge Function** (`notify-approval`) via your Office 365 relay (`smtp.office365.com:587`, `no-reply@karimjee.com`). The trigger points:

| Event | Email goes to |
|---|---|
| Employee submits a request | Group IT Head — one digest listing all tools in the request |
| Group IT **approves** a tool | Group Legal & Compliance |
| Group Legal **approves** a tool | Group COO |
| Group COO issues final decision | Requester (approved / declined + reason) |
| Any reviewer **declines** a tool | Requester (with the decline reason) |

Recipients are resolved live from the `profiles` table by role, so they always match whoever currently holds the IT Head / Legal / COO roles (see §5). All emails are Karimjee-branded.

**One prerequisite to confirm — Office 365 SMTP AUTH.** Microsoft disables SMTP AUTH (basic authentication) by default on many tenants. For sending to work, SMTP AUTH must be **enabled for the `no-reply@karimjee.com` mailbox**:
Microsoft 365 Admin → Users → `no-reply@karimjee.com` → Mail → *Manage email apps* → tick **Authenticated SMTP**. (Org-wide it's under Exchange Admin → Settings → Mail flow.) If it's disabled, sends fail with `535 5.7.139`.

**To test:** sign in as the demo employee, submit a request — the IT Head should receive the notification within a minute. If nothing arrives, check Supabase → Edge Functions → `notify-approval` → Logs for the exact SMTP error.

**Securing the SMTP password (recommended).** The password is currently embedded in the function. To move it out of source: Supabase Dashboard → Edge Functions → *Manage secrets* → add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`. The function already prefers these environment values over the embedded fallback. Rotating this password periodically is advised.

---

## 7. Security posture (summary)

- Authentication limited to verified @karimjee.com identities.
- Least-privilege RLS: employees see only their own requests; reviewers see the queue; no one can edit decisions directly.
- Stage integrity enforced server-side — the IT→Legal→COO order cannot be bypassed.
- Immutable audit log (`tool_audit`) for governance and TDPA evidence.
- Decline reasons are mandatory and recorded against the responsible reviewer.
