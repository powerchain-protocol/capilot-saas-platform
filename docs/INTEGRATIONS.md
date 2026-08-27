# Integrations

Integration adapters execute only on the backend.

## AI

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- deterministic representative fallback only when `ALLOW_DEMO_AI=true`

## Solana / Helius

- `SOLANA_RPC_URL`
- `HELIUS_RPC_URL`
- `HELIUS_API_KEY`

Resolution order: explicit Helius RPC → Helius API-key URL → explicit Solana RPC → development devnet fallback. Production does not silently invent an RPC endpoint.

## Pyth

- `PYTH_HERMES_URL`
- price requests use explicit feed IDs

## Birdeye

- `BIRDEYE_API_URL`
- `BIRDEYE_API_KEY`
- token addresses are validated before requests

## Explorers

Read-only explorer metadata lives in `apps/backend/src/data/explorers.ts` and frontend display metadata in `apps/frontend/data/explorers.ts`.
