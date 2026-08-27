
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

The collection includes Credits and Tokens folders. Credits contains snapshot, ledger, deterministic quote, and non-transferable receipt requests. Set `apiKey` in the selected environment; it is inherited through collection-level API-key authentication.

## Contract coverage

Run `pnpm check:api-dx` to verify the `X-Api-Key` OpenAPI security contract, unique operation IDs, public API hosts, and Postman coverage for every `/v1` HTTP operation.
## PowerChain cloud workspace

The project is explicitly linked to the PowerChain Postman workspace configuration in `api/postman/remote.json`:

- Workspace: `55a50a8b-cdb7-46f5-807e-3494d0262565`
- Dataset: `6c7b04bd-20bf-45b8-8184-eba0156fa433`
- Specification: `1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9`
- Specification file: `cc65a18c-43aa-41b0-8fee-bf8f6f18ebea`

Use `pnpm postman:dataset` with Postman CLI for the cloud dataset. Use `POSTMAN_API_KEY=... pnpm postman:spec:pull` to create a review snapshot, or `POSTMAN_API_KEY=... pnpm postman:spec:push` to explicitly publish the repository OpenAPI to the linked specification. Remote writes are never part of the default build or verify path.

