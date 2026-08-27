
# PowerChain Copilot API description

PowerChain Copilot API v1 is the authoritative backend boundary for the SaaS product. It exposes renewable-asset state, session identity, governed approvals, persisted Copilot conversations, service/provider health, market/network adapters, and contact intake.

## Contract principles

- **Versioned namespace:** all HTTP application endpoints live below `/api/v1`.
- **Consistent envelopes:** successful calls return `{ "ok": true, "data": ... }`; failures return `{ "ok": false, "error": ... }`.
- **Cookie sessions:** browser authentication is backed by signed, HttpOnly, revocable session cookies.
- **Opaque identities:** user, workspace, session, chat, message, asset, and approval records use opaque prefixed IDs; readable slugs are secondary lookup/navigation aids.
- **Human-governed mutation:** approval actions require an allowed role and explicit mutation request.
- **AI is non-executing:** AI output is analysis and never implies approval, dispatch, wallet signature, treasury movement, or settlement.
- **Provider truth is bounded:** Pyth/Birdeye/Solana/Helius adapters can fail and never fabricate live provider state.
- **Realtime is optional:** WebSockets accelerate chat updates; HTTP remains the authoritative fallback.

See `docs/API.md` for endpoint use, `docs/FLOWS.md` for lifecycle sequences, and `docs/SPECIFICATIONS.md` for machine contracts.
