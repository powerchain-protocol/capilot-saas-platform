
# PowerChain Copilot mock API

The mock server is a deterministic, non-authoritative development surface. It exists for UI work, SDK integration, Postman runs, and failure-state testing without a database or provider credentials.

Run from the repository root:

```bash
pnpm api:mock
```

Default URL: `http://127.0.0.1:8010`

Select the Postman environment **PowerChain Copilot — Local Mock**.

## Safety boundary

Mock responses are representative only. They are not telemetry, meter evidence, price truth, transaction confirmation, wallet state, approval evidence, or settlement proof. Production code must not silently switch to this server.

Fixtures live in `fixtures/` and use obvious fixed IDs. The server sets `x-powerchain-mock: true` on every JSON response.
