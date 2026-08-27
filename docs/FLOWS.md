
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

## Persisted Copilot chat and PWRC billing

```mermaid
sequenceDiagram
  participant C as Client
  participant API as Chat API
  participant DB as Store
  participant AI as AI provider
  participant WS as WebSocket hub
  C->>API: POST /chat/{id}/messages
  API->>DB: persist user message
  API->>DB: persist canonical 10,000 PWRC quote + SHA-256 hash
  API->>DB: atomic reserve available → reserved
  alt insufficient credits
    API-->>C: HTTP 402 INSUFFICIENT_CREDITS
  else reserved
    API->>AI: governed analysis request
    alt provider/generation failure
      API->>DB: release reservation + compensating ledger entry
      API-->>C: provider error
    else completed response
      AI-->>API: analysis + suggested actions
      API->>DB: atomic assistant message + reserved → spent + settlement ledger + receipt
      API->>WS: chat.message
      API->>WS: chat.receipt
      API-->>C: persisted response + quote + non-transferable receipt
    end
  end
```

The quote is persisted before reservation. Settlement happens only after generation completes and is committed together with the delivered assistant message. The receipt proves quote hash + reservation + response + settlement linkage but is not transferable tokenized value.

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

## Credits and token metadata

`GET /v1/credits` returns the authenticated PWRC usage-credit account and pricing version. `GET /v1/credits/ledger` returns append-oriented movements, `GET /v1/credits/quotes` returns deterministic quote evidence, and `GET /v1/credits/receipts` returns non-transferable settlement receipts. `GET /v1/tokens` and `GET /v1/tokens/pwrc` expose public token metadata only; they never return wallet secrets or signing material.
