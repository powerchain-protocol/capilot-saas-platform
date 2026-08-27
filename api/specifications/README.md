
# API specifications

PowerChain Copilot keeps protocol contracts separate from implementation:

- `../openapi/openapi.yaml` — canonical OpenAPI 3.1 HTTP contract.
- `../openapi/openapi.json` — machine-equivalent JSON mirror.
- `../asyncapi/asyncapi.yaml` — WebSocket event contract.
- `../schemas/api-envelope.schema.json` — success/error envelope.
- `../schemas/chat-event.schema.json` — realtime event envelope.
- `../schemas/api-flow.schema.json` — repository flow-manifest schema.

HTTP business logic lives in `apps/backend/src/api/v1/`; realtime implementation lives in `apps/backend/src/ws/`.

## Versioned API host

The public OpenAPI surface uses `/v1` on `api.capilot.powerchain.energy`; the application gateway can expose the same surface on `capilot.powerchain.app`. Internal frontend transport remains `/api/v1` for same-origin proxying.
