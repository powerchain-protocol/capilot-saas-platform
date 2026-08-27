
# Postman guide

Import the collection at `api/postman/PowerChain-Copilot.postman_collection.json` and one environment from `api/postman/environments/`.

## Recommended local smoke flow

1. Start backend: `pnpm dev:backend`.
2. Select **PowerChain Copilot — Local**.
3. Run **Auth → Open demo workspace**; Postman keeps the `pc_session` cookie.
4. Run **Sessions → Current session**.
5. Run **AI and Chat → Create chat**; the test script captures `chatId`.
6. Run **AI and Chat → Send chat message**; the test script captures `messageId`.
7. Run **AI and Chat → Get message**.

For deterministic mock-only work use `pnpm api:mock` and the **Local Mock** environment.

## Collection Runner

Use a dataset from `api/postman/datasets/`. Dataset fields override collection/environment variables for that iteration. Mutation scenarios should be limited to disposable workspaces.

## Request IDs

The collection adds an `X-Request-Id` per run. Backend responses expose `X-Request-Id`, and failure envelopes may include `error.requestId` for diagnostics.

## API key

Set the `apiKey` secret environment variable. The collection applies it as `X-Api-Key` at collection scope. Production uses `https://api.capilot.powerchain.energy/v1`; the app gateway is `https://capilot.powerchain.app/v1`.

## Credits and token metadata requests

The collection now includes Credits and Tokens folders. Set `apiKey` in the selected environment; it is inherited through collection-level API-key authentication.
