# PowerChain Copilot API v1

## Local endpoints

- REST base: `http://localhost:8000/api/v1`
- Swagger UI: `http://localhost:8000/docs`
- Swagger JSON: `http://localhost:8000/docs/json`
- WebSocket base: `ws://localhost:8000/ws/v1`

Canonical contract: `api/openapi/openapi.yaml`

Postman collection: `api/postman/PowerChain-Copilot.postman_collection.json`

## Route groups

```text
GET    /api/v1/health
POST   /api/v1/auth/sign-in
POST   /api/v1/auth/register
POST   /api/v1/auth/demo
POST   /api/v1/auth/sign-out
GET    /api/v1/sessions/current
GET    /api/v1/sessions
DELETE /api/v1/sessions/:id
GET    /api/v1/security/session
GET    /api/v1/dashboard
GET    /api/v1/assets
GET    /api/v1/approvals
POST   /api/v1/approvals/:id
POST   /api/v1/ai/generate
GET    /api/v1/chat
POST   /api/v1/chat
GET    /api/v1/chat/:id
POST   /api/v1/chat/:id/messages
GET    /api/v1/messages/:id
GET    /api/v1/copilot
POST   /api/v1/copilot
PATCH  /api/v1/profile
GET    /api/v1/services
GET    /api/v1/market/price
GET    /api/v1/network/solana
POST   /api/v1/contact
GET    /api/v1/credits
GET    /api/v1/credits/ledger
GET    /api/v1/credits/quotes
GET    /api/v1/credits/receipts
GET    /api/v1/tokens
GET    /api/v1/tokens/pwrc
WS     /ws/v1/chat/:id
```

## Envelope

Success:

```json
{ "ok": true, "data": {} }
```

Failure:

```json
{
  "ok": false,
  "error": {
    "message": "Sign in required.",
    "code": "UNAUTHENTICATED",
    "requestId": "..."
  }
}
```

## Browser client

Frontend code should import from:

```ts
import { powerChainApi } from "@/lib/powerchain";
```

Do not scatter literal API URLs through components.

## WebSocket events

```json
{
  "type": "chat.message",
  "chatId": "cht_...",
  "payload": { "id": "msg_...", "role": "assistant", "content": "..." },
  "timestamp": "2026-08-27T00:00:00.000Z"
}
```

Supported event types include `chat.message`, `chat.receipt`, `chat.updated`, and `system.heartbeat`. `chat.receipt` is emitted only after the response message and PWRC settlement are durably committed.


## Developer artifacts

- Postman guide: `docs/POSTMAN.md`
- Postman environments/datasets: `api/postman/`
- Local mock server: `api/mocks/`
- OpenAPI/AsyncAPI/JSON Schemas: `api/openapi/`, `api/asyncapi/`, `api/schemas/`
- TypeScript SDK: `packages/sdk-typescript/`
- API lifecycle flows: `docs/FLOWS.md`

## API authentication and URLs

The external v1 surface is available at `https://api.capilot.powerchain.energy/v1` with the app-gateway fallback `https://capilot.powerchain.app/v1`. Requests require `X-Api-Key`. User/workspace endpoints also require the signed `pc_session` HttpOnly cookie. The Next.js frontend uses same-origin `/api/v1` and injects the server-side key in its proxy; the key is never exposed through `NEXT_PUBLIC_*`.

Use `pnpm api:key:hash -- <key>` to create the SHA-256 value stored in `POWERCHAIN_API_KEY_HASHES`.

## Completed-response billing

`POST /v1/chat/{id}/messages` and `POST /v1/copilot` enforce the 10,000 PWRC completed-response lifecycle. The server persists the canonical quote before reservation, uses atomic account updates, and settles the delivered assistant message in the same persistence transaction as the settlement ledger/receipt.

- `402 INSUFFICIENT_CREDITS` means no AI generation was started.
- Provider/generation failure releases a reservation.
- Successful responses expose `X-PowerChain-Quote-Id`, `X-PowerChain-Quote-Hash`, and `X-PowerChain-Receipt-Id`.
- `GET /v1/credits/quotes` exposes deterministic quote evidence.
- `GET /v1/credits/receipts` exposes non-transferable settlement receipts.


## AI preview vs billed chat

`POST /v1/ai/generate` is an optional development/diagnostic preview endpoint. Keep `ALLOW_UNBILLED_AI_PREVIEW=false` in production. Customer-facing completed Copilot responses use `/v1/chat/:id/messages`, which persists the request, creates and hashes a quote, reserves PWRC, generates the response, and atomically settles the delivered message with a non-transferable receipt.
