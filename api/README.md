
# PowerChain Copilot API workspace

Portable API developer-experience artifacts for canonical release `1.0.0`.

```text
api/
├── DESCRIPTION.md
├── openapi/
│   ├── openapi.yaml
│   └── openapi.json
├── asyncapi/
│   └── asyncapi.yaml
├── postman/
│   ├── PowerChain-Copilot.postman_collection.json
│   ├── environments/
│   ├── datasets/
│   └── flows/
├── mocks/
│   ├── server.mjs
│   └── fixtures/
├── schemas/
├── sdks/
├── specifications/
├── swagger/
└── schema.sql
```

- OpenAPI 3.1 is the HTTP contract.
- AsyncAPI 3.0 is the WebSocket contract.
- Postman includes environments, runner datasets, tests, example responses, and portable flow recipes.
- `api/mocks` supplies a deterministic local mock server (`pnpm api:mock`).
- `packages/sdk-typescript` is the first-party typed TypeScript reference SDK.
- Executable PostgreSQL migrations remain owned by `apps/backend/src/storage/migrations/`.

Runtime implementation lives in `apps/backend/src/api/v1/`. The Next.js frontend exposes only a thin same-origin `/api/v1/*` proxy and consumes the backend through `apps/frontend/lib/powerchain/`.

## Public v1 surface

- Primary: `https://api.capilot.powerchain.energy/v1`
- App gateway fallback: `https://capilot.powerchain.app/v1`
- Local backend: `http://localhost:8000/v1`
- Same-origin frontend proxy: `/api/v1`

The canonical OpenAPI security scheme is `ApiKey`, transmitted as `X-Api-Key`. Authenticated workspace operations additionally require `pc_session`. Swagger UI reads `api/openapi/openapi.yaml`; Postman uses the same `/v1` routes.

## Credit evidence

Executable credit migrations are `0002_credits.sql` and `0003_credit_quotes_receipts.sql`. The schema snapshot includes account, append-oriented ledger, deterministic quote, and non-transferable receipt tables.
