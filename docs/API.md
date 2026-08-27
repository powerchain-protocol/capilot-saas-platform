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

Supported event types currently include `chat.message`, `chat.updated`, and `system.heartbeat`.


## Developer artifacts

- Postman guide: `docs/POSTMAN.md`
- Postman environments/datasets: `api/postman/`
- Local mock server: `api/mocks/`
- OpenAPI/AsyncAPI/JSON Schemas: `api/openapi/`, `api/asyncapi/`, `api/schemas/`
- TypeScript SDK: `packages/sdk-typescript/`
- API lifecycle flows: `docs/FLOWS.md`
