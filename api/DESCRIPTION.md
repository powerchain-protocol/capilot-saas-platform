
# PowerChain Copilot API description

PowerChain Copilot API v1 is the authoritative backend boundary for the SaaS product. It exposes renewable-asset state, session identity, governed approvals, persisted Copilot conversations, service/provider health, market/network adapters, and contact intake.

## Contract principles

- **Versioned namespace:** external clients use `/v1`; the web application uses the same-origin `/api/v1` compatibility gateway.
- **Consistent envelopes:** successful calls return `{ "ok": true, "data": ... }`; failures return `{ "ok": false, "error": ... }`.
- **Cookie sessions:** browser authentication is backed by signed, HttpOnly, revocable session cookies.
- **Opaque identities:** user, workspace, session, chat, message, asset, and approval records use opaque prefixed IDs; readable slugs are secondary lookup/navigation aids.
- **Human-governed mutation:** approval actions require an allowed role and explicit mutation request.
- **AI is non-executing:** AI output is analysis and never implies approval, dispatch, wallet signature, treasury movement, or settlement.
- **Provider truth is bounded:** Pyth/Birdeye/Solana/Helius adapters can fail and never fabricate live provider state.
- **Realtime is optional:** WebSockets accelerate chat updates; HTTP remains the authoritative fallback.
- **Deterministic billing:** completed chat responses persist a canonical PWRC quote/hash before reservation and return non-transferable settlement evidence after atomic response settlement.

See `docs/API.md` for endpoint use, `docs/FLOWS.md` for lifecycle sequences, and `docs/SPECIFICATIONS.md` for machine contracts.

## Client authentication

API clients send `X-Api-Key`. The backend stores only configured SHA-256 hashes (`POWERCHAIN_API_KEY_HASHES`) and compares digests in constant time. Browser code does not receive the key: the Next.js `/api/v1` proxy injects the server-only `POWERCHAIN_API_KEY`.

## Billing boundary

Production clients should use persisted chat for completed Copilot responses. The standalone AI preview endpoint is a development diagnostic and is disabled in production unless an operator explicitly enables `ALLOW_UNBILLED_AI_PREVIEW`.
