
# @powerchain/copilot-sdk

First-party typed TypeScript client for PowerChain Copilot API v1.

See `docs/SDK.md` for usage and authentication boundaries. External API clients authenticate with `X-Api-Key`; user/workspace operations additionally use the signed HttpOnly session cookie. The default SDK base URL is `https://api.capilot.powerchain.energy` and the versioned surface is `/v1`.
