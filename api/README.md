# PowerChain Copilot API

This directory contains API artifacts shared by the monorepo:

- `openapi/openapi.yaml` — canonical OpenAPI 3.1 contract.
- `postman/PowerChain-Copilot.postman_collection.json` — importable Postman collection.
- `swagger/README.md` — local Swagger UI instructions.
- `schema.sql` — canonical PostgreSQL schema snapshot; executable migration lives under `apps/backend/src/storage/migrations/`.

Runtime implementation lives in `apps/backend/src/api/v1/`. The Next.js frontend only exposes a thin same-origin HTTP proxy at `/api/v1/*`; business logic is not duplicated in the frontend.
