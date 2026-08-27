# Environments and networks

PowerChain Copilot exposes two explicit runtime profiles. The profile controls safe defaults only; secrets and provider credentials remain deployment configuration.

## Development

```dotenv
NODE_ENV=development
POWERCHAIN_ENV=development
SOLANA_CLUSTER=devnet
SUI_NETWORK=devnet
```

Development permits representative/demo AI when explicitly enabled and defaults Solana reads to public devnet if no RPC provider is configured.

Use:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

## Mainnet

```dotenv
NODE_ENV=production
POWERCHAIN_ENV=mainnet
SOLANA_CLUSTER=mainnet-beta
SUI_NETWORK=mainnet
```

Mainnet is fail-closed:

- PostgreSQL is required.
- a strong session secret is required.
- API-key hashes are required when API-key protection is enabled.
- memory persistence fallback is disabled.
- deterministic/demo AI is disabled.
- Solana public devnet fallback is disabled.
- mainnet requires an explicit Solana RPC or Helius configuration.

Use the templates:

```bash
cp apps/backend/.env.mainnet.example apps/backend/.env
cp apps/frontend/.env.mainnet.example apps/frontend/.env.local
```

Never commit populated mainnet environment files.

## Sanitized profile API

Authenticated clients can read the active non-secret profile:

```text
GET /v1/network/profile
```

The response contains only the environment name, Solana cluster, Sui network, production flag, and whether representative data is allowed. RPC URLs, API keys, database URLs, and wallet secrets are never returned.
