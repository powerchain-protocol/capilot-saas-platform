
# API flows

## Authentication and session

```mermaid
sequenceDiagram
  participant C as Client
  participant API as API v1
  participant DB as PostgreSQL
  C->>API: POST /auth/sign-in
  API->>DB: verify user + workspace membership
  API->>DB: persist revocable session
  API-->>C: Set-Cookie pc_session (HttpOnly)
  C->>API: GET /sessions/current
  API->>DB: resolve session/user/workspace
  API-->>C: session context
```

`rememberMe=true` creates a persistent session cookie; ordinary sessions remain non-persistent. Sign-out/revocation invalidates the persisted session, not only the browser cookie.

## Persisted Copilot chat

```mermaid
sequenceDiagram
  participant C as Client
  participant API as Chat API
  participant DB as Store
  participant AI as AI provider
  participant WS as WebSocket hub
  C->>API: POST /chat
  API->>DB: create chat
  API-->>C: chat id + slug
  C->>API: POST /chat/{id}/messages
  API->>DB: persist user message
  API->>WS: chat.message
  API->>AI: governed analysis request
  AI-->>API: analysis + suggested actions
  API->>DB: persist assistant message
  API->>WS: chat.message
  API-->>C: persisted response
```

Suggested actions are UI navigation/action proposals. They are not proof that an approval or execution occurred.

## Governed approval

```mermaid
sequenceDiagram
  participant U as Authorized user
  participant API as Approval API
  participant DB as Store
  U->>API: GET /approvals
  API-->>U: pending queue
  U->>API: POST /approvals/{id} {action}
  API->>API: verify session + role + origin
  API->>DB: update approval + append activity
  API-->>U: updated approval
```

Only `owner`, `admin`, and `operator` roles may mutate approval state in v1.

## WebSocket fallback

1. Client fetches the chat over HTTP.
2. Client opens `/ws/v1/chat/{id}` with the same authenticated browser session.
3. On disconnect/error, client stops treating realtime as current.
4. Client polls/refetches the HTTP chat endpoint.
5. Client reconciles persisted message IDs; it does not synthesize missing events.

## Market and network adapters

Market and Solana endpoints call server-side providers. Missing keys, provider failures, stale responses, or RPC errors are surfaced as failures/degraded status. No client should convert provider failure into fabricated price or network truth.
