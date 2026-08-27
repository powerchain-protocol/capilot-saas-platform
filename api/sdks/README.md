
# PowerChain SDKs

## TypeScript

The first-party reference client lives at:

```text
packages/sdk-typescript/
```

Package name: `@powerchain/copilot-sdk`  
Canonical API: `/api/v1`  
Canonical version: `1.0.0`

The SDK uses `fetch`, preserves the `{ ok, data | error }` envelope contract, converts API errors to `PowerChainSdkError`, and includes a typed browser WebSocket helper.

The current authentication model is signed HttpOnly cookie sessions. Browser use is therefore the primary authenticated SDK path. A Node process can call public endpoints directly, but it should not attempt to read HttpOnly browser cookies; server-to-server credentials require a separate future auth contract.

## Authentication

The TypeScript SDK accepts `apiKey` and defaults to `https://api.capilot.powerchain.energy`. SDK operations use `/v1`. Session-authenticated methods preserve cookie credentials when the runtime supports them.
