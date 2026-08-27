# PowerChain Copilot SaaS Architecture

## Request path

```text
Browser / PWA
  ↓
Next.js App Router
  ↓
Authenticated route / API handler
  ↓
Signed HttpOnly session
  ↓
Workspace + role authorization
  ↓
Repository layer
  ├─ Supabase/PostgreSQL (production)
  └─ local JSON store (development only)
```

## Copilot path

```text
User message
  ↓
POST /api/copilot
  ↓
Session + workspace scope
  ↓
Persist user message
  ↓
Load workspace assets
  ↓
Managed AI adapter when configured
  └─ deterministic demo adapter otherwise
  ↓
Persist assistant message
  ↓
Append activity record
  ↓
Return structured actions
```

Copilot never changes approval state. Approval writes exist only in the Approval Center API and require an authorized role.

## Approval path

```text
Pending approval
  ↓
User selects Approve / Request changes
  ↓
POST /api/approvals/:id
  ↓
Session validation
  ↓
Role gate: owner | admin | operator
  ↓
Workspace-scoped mutation
  ↓
Activity append
```

## Production fail-closed configuration

Production mutations require:

- `SESSION_SECRET` of at least 32 characters
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Without durable persistence, production mutations fail rather than silently using an ephemeral filesystem.
