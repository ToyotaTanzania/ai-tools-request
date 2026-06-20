# Karimjee Group — AI Tool Vetting & Approval

A Next.js 14 application implementing the **Tools Responsible Use Standard** for Karimjee Group. Employees submit AI tools for approval; each tool is independently routed through a three-stage pipeline:

**Group IT Head → Group Legal & Compliance → Group COO (final)**

Any reviewer can approve (advances to the next stage) or decline (reason mandatory; tool stops and is marked rejected). Each tool is tracked separately — a single request can have some tools approved and others rejected.

---

## Features

- **Multi-tool requests** — submit one or more AI tools per request, each vetted independently
- **Role-based access** — employee, it_head, legal, coo, admin
- **Pipeline tracker** — visual IT → Legal → COO progress per tool
- **Review queues** — role-gated queues with live badge counts
- **AI Tool Registry** — group-wide record with stats (total, in pipeline, approved, rejected)
- **Automatic risk classification** — Low / Medium / High based on data categories and integrations
- **Email notifications** — via Supabase Edge Function (`notify-approval`) on every pipeline event
- **Immutable audit trail** — every submission and decision logged to `tool_audit`
- **@karimjee.com only** — domain enforced at sign-up (client + server)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database & Auth | Supabase (direct client, no ORM) |
| SSR Auth | `@supabase/ssr` with cookie-based sessions |
| Testing | Vitest + Testing Library |

---

## Architecture

```
src/
├── actions/          # Server Actions (auth, requests, decisions, registry)
├── app/
│   ├── (auth)/login  # Login / sign-up page
│   └── (dashboard)/  # Authenticated shell
│       ├── requests/new   # Submit new AI tool request
│       ├── requests/      # My submitted requests
│       ├── queue/         # Review queue (reviewers only)
│       └── registry/      # Group-wide AI tool registry (reviewers only)
├── components/
│   ├── auth/         # LoginForm (client)
│   ├── layout/       # Header, TabNav (client)
│   ├── requests/     # NewRequestForm, ToolBlock, MyRequestsList
│   ├── queue/        # QueueList, DecisionForm
│   ├── registry/     # RegistryTable, StatsRow
│   └── shared/       # PipelineTracker, ToolCard, Badge, Toast
├── lib/
│   ├── supabase/
│   │   ├── server.ts  # createServerClient (Server Components & Actions)
│   │   └── client.ts  # createBrowserClient (auth only)
│   ├── constants.ts   # DATA_CATS, INTEGS, ROLE_LABEL, STAGE, BUSINESS_UNITS
│   ├── types.ts       # Profile, Request, RequestTool, ToolAudit
│   └── utils.ts       # fmtDate, fmtDateTime
└── middleware.ts      # Route protection + session refresh
```

**Key principle:** Server Components fetch data directly. Client Components call Server Actions only — no Supabase credentials exposed to the browser.

---

## Database (Supabase project `AI-Tool-Vetting`)

| Table | Purpose |
|---|---|
| `profiles` | User profile + role |
| `role_assignments` | Pre-assigned roles by email |
| `requests` | Parent request (one per submission) |
| `request_tools` | Pipeline unit — one row per tool |
| `tool_audit` | Immutable decision log |

**RPC:** `decide_tool(p_tool_id, p_decision, p_reason)` — server-side function enforcing stage order and RLS. Cannot be bypassed from the UI.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the schema described in `SETUP-GUIDE.md`

### Install

```bash
npm install
```

### Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Run

```bash
npm run dev      # development server → http://localhost:3000
npm run build    # production build
npm run start    # start production server
npm test         # run test suite (54 tests)
```

---

## Roles & Permissions

| Role | New Request | My Requests | Review Queue | Registry |
|---|---|---|---|---|
| `employee` | ✓ | ✓ | — | — |
| `it_head` | ✓ | ✓ | IT stage | ✓ |
| `legal` | ✓ | ✓ | Legal stage | ✓ |
| `coo` | ✓ | ✓ | COO stage | ✓ |
| `admin` | ✓ | ✓ | All stages | ✓ |

---

## Pre-configured Accounts

> Change passwords on first login.

| Role | Email | Temp password |
|---|---|---|
| Group IT Head | `abdulaziz.raudha@karimjee.com` | `Karimjee#IT2026` |
| Group Legal & Compliance | `lucia.minde@karimjee.com` | `Karimjee#Legal2026` |
| Group COO | `amir.abdelazim@karimjee.com` | `Karimjee#COO2026` |
| Demo employee | `employee.demo@karimjee.com` | `Karimjee#Emp2026` |

---

## Testing the Full Pipeline

1. Sign in as `employee.demo` → **New Request** → add 1–2 tools → submit
2. Sign in as IT Head → **My Review Queue** → approve one, decline one (reason required)
3. Sign in as Legal → approve the advanced tool
4. Sign in as COO → issue final decision
5. As any reviewer → **AI Tool Registry** to see the full trail

---

## Security

- Authentication restricted to `@karimjee.com` emails (enforced server-side)
- Row-Level Security on every table — employees see only their own requests
- Stage integrity enforced by the `decide_tool` database function — order cannot be bypassed
- All pipeline transitions audited in `tool_audit`
- Decline reasons mandatory and recorded against the responsible reviewer
- No Supabase service credentials exposed to the client

---

## Setup & Admin

See [`SETUP-GUIDE.md`](./SETUP-~1.MD) for:
- Supabase project configuration
- Email confirmation settings
- Office 365 SMTP setup for notifications
- SQL snippets for role management
