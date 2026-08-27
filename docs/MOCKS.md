
# API mocks

PowerChain ships two mock paths:

1. **Postman examples** embedded in the API collection for Postman-hosted Mock Servers.
2. **Local mock server** at `api/mocks/server.mjs` for deterministic development without external services.

The local mock API starts on port `8010` and reads fixtures from `api/mocks/fixtures/`.

Mocks must always remain visibly non-authoritative. They must not be used to claim live renewable generation, meter evidence, prices, provider availability, signatures, transaction finality, approval status, or settlement completion.
