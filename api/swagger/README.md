# Swagger UI

The backend serves the canonical OpenAPI 3.1 contract from `../openapi/openapi.yaml`.

- Swagger UI: `http://localhost:8000/docs`
- Swagger JSON: `http://localhost:8000/docs/json`
- API base: `http://localhost:8000/api/v1`
- WebSocket base: `ws://localhost:8000/ws/v1`

The OpenAPI file is the source of truth for REST endpoint documentation. WebSocket behavior is documented in the `/ws/v1/chat/{id}` path description and `docs/API.md`.
