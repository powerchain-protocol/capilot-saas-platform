# Provider Integrations

PowerChain keeps external provider access behind server-side adapters. API keys are never shipped to client components.

## Pyth

`lib/pyth.ts` reads configurable Hermes price feeds. Configure:

```text
PYTH_HERMES_URL=
PYTH_DEFAULT_FEED_ID=
PYTH_SOL_USD_FEED_ID=
```

No feed ID is invented by the application. A deployment must explicitly configure the feed it trusts.

## Birdeye

`lib/birdeye.ts` provides optional Solana token price lookup with:

```text
BIRDEYE_API_URL=
BIRDEYE_API_KEY=
```

## Helius

`lib/helius.ts` uses either a complete server RPC URL or a Helius API key:

```text
HELIUS_RPC_URL=
HELIUS_API_KEY=
```

## Solana RPC

`lib/rpc.ts` uses `SOLANA_RPC_URL`, then `HELIUS_RPC_URL`. A public devnet fallback is permitted only outside production. Production fails closed when no RPC is configured.

## Cache and timeout boundary

Provider reads use the shared in-memory TTL cache in `lib/cache.ts` for short-lived request de-duplication and a six-second default provider timeout. This cache is not a durable source of truth.
