
# Postman workspace artifacts

This directory is the repository-owned Postman source for PowerChain Copilot API v1.

## Linked PowerChain workspace

This repository is linked to the supplied PowerChain Postman dataset and Spec Hub specification. The canonical human-readable manifest is [`index.yaml`](./index.yaml); machine sync configuration lives in [`remote.json`](./remote.json), with operational guidance in [`REMOTE.md`](./REMOTE.md). Local OpenAPI remains the deterministic build source; Postman is the collaboration/publishing target.

```bash
pnpm postman:remote
pnpm postman:remote:verify
pnpm postman:dataset
POSTMAN_API_KEY=... pnpm postman:spec:pull
POSTMAN_API_KEY=... pnpm postman:spec:push
```

Canonical Postman specification URL:

<https://crimson-crescent-8585.postman.co/workspace/55a50a8b-cdb7-46f5-807e-3494d0262565/specification/1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9/file/cc65a18c-43aa-41b0-8fee-bf8f6f18ebea>

## Import order

1. Import `PowerChain-Copilot.postman_collection.json`.
2. Import one environment from `environments/`.
3. For a live local backend, select **PowerChain Copilot — Local**.
4. For deterministic mock responses, run `pnpm api:mock` and select **PowerChain Copilot — Local Mock**.
5. Use Collection Runner with a JSON or CSV file from `datasets/`.

The collection stores the `pc_session` HttpOnly cookie in Postman's cookie jar automatically. It also captures `sessionId`, `chatId`, `messageId`, and `approvalId` when responses provide them.

## Datasets

- `smoke.json` / `smoke.csv` — minimal happy-path values.
- `chat-scenarios.json` / `.csv` — renewable-infrastructure prompt coverage.
- `approval-actions.json` — explicit governed mutation cases.
- `market-prices.json` — Pyth/Birdeye/auto provider cases; replace placeholder feed IDs before live execution.
- `registration.json` — non-production account creation examples.
- `credits.json` — deterministic quote/receipt expectations for PWRC completed-response billing.

Never point mutation datasets at a production workspace unless the records and approvals are explicitly disposable test data.

## Native Postman mock server

The collection includes representative example responses for core requests, so it can also be used as the source for a Postman-hosted Mock Server. The repository additionally provides a local zero-dependency mock server under `api/mocks/` for offline/local development.

## Flow recipes

`flows/*.flow.json` are portable PowerChain scenario manifests that describe request ordering, captured variables, and expected status codes. They are intentionally **not** presented as proprietary Postman Flows export files because that export format is not treated as a stable repository contract.

## X-Api-Key

The collection is authenticated at collection scope with `X-Api-Key: {{apiKey}}`. Store the real value only in your local Postman environment/secret store. Do not commit populated environment secrets. Requests use `/v1`; the mock server also accepts this namespace.
