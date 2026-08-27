# Swagger UI

The Fastify backend serves the canonical OpenAPI 3.1 HTTP contract from `api/openapi/openapi.yaml`.

- Swagger UI: `http://localhost:8000/docs`
- Swagger JSON: `http://localhost:8000/docs/json`
- API base: `http://localhost:8000/api/v1`
- WebSocket base: `ws://localhost:8000/ws/v1`

REST semantics are owned by OpenAPI. Realtime WebSocket semantics are owned separately by `api/asyncapi/asyncapi.yaml`; the split avoids pretending a WebSocket subscription is an ordinary HTTP request.

For runnable API examples use the Postman artifacts in `api/postman/`. For deterministic development without PostgreSQL/providers use `pnpm api:mock`.
