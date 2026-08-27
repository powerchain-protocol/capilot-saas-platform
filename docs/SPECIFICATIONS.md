
# API specifications

## OpenAPI 3.1

Canonical HTTP contract:

```text
api/openapi/openapi.yaml
api/openapi/openapi.json
```

Swagger UI loads the YAML contract at backend `/docs`.

## AsyncAPI 3.0

Canonical WebSocket contract:

```text
api/asyncapi/asyncapi.yaml
```

The current realtime channel is `/ws/v1/chat/{id}` and carries `chat.message`, `chat.updated`, and `system.heartbeat` events.

## JSON Schema

Shared portable schemas are stored under `api/schemas/` for envelopes, realtime events, and repository flow manifests.

OpenAPI owns HTTP semantics. AsyncAPI owns WebSocket semantics. Runtime route source code remains authoritative only when it matches these checked-in contracts; drift should block release.

## Authentication contract

OpenAPI defines `components.securitySchemes.ApiKey` as header `X-Api-Key` and applies it globally. Workspace operations combine that scheme with `sessionCookie`. The realtime AsyncAPI surface uses the authenticated session because browser WebSocket APIs cannot attach arbitrary `X-Api-Key` headers.
