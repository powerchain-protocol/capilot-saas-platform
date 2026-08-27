# Canonical PowerChain Postman workspace links

The repository is linked to the PowerChain Postman workspace through `api/postman/index.yaml` and `api/postman/remote.json`. `index.yaml` is the canonical repository manifest; `remote.json` is consumed by sync tooling.

## Workspace

- Workspace ID: `55a50a8b-cdb7-46f5-807e-3494d0262565`
- Workspace URL: <https://crimson-crescent-8585.postman.co/workspace/55a50a8b-cdb7-46f5-807e-3494d0262565>

## Dataset

- Dataset ID: `6c7b04bd-20bf-45b8-8184-eba0156fa433`
- Workspace dataset URL: <https://www.getpostman.com/workspace/PowerChain~55a50a8b-cdb7-46f5-807e-3494d0262565/dataset/6c7b04bd-20bf-45b8-8184-eba0156fa433>

The Postman dataset is a cloud dataset. Postman CLI can address it directly by ID:

```bash
postman dataset get 6c7b04bd-20bf-45b8-8184-eba0156fa433 --json
postman dataset source list -d 6c7b04bd-20bf-45b8-8184-eba0156fa433 --json
postman dataset view list -d 6c7b04bd-20bf-45b8-8184-eba0156fa433 --json
```

Repository wrappers:

```bash
pnpm postman:dataset
pnpm postman:dataset:sources
pnpm postman:dataset:views
```

These commands require Postman CLI authentication or a CLI/API-key configuration supported by Postman. Never commit a Postman API key.

## Specification

- Specification ID: `1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9`
- File ID: `cc65a18c-43aa-41b0-8fee-bf8f6f18ebea`
- Workspace specification URL: <https://crimson-crescent-8585.postman.co/workspace/55a50a8b-cdb7-46f5-807e-3494d0262565/specification/1e9bfbeb-cf59-4af3-a51f-25dce5bbe9c9/file/cc65a18c-43aa-41b0-8fee-bf8f6f18ebea>

The repository-owned `api/openapi/openapi.yaml` remains the build-time source of truth so local/CI builds never depend on Postman network availability. The linked Postman spec is the collaboration/publishing target.

Use:

```bash
POSTMAN_API_KEY=... pnpm postman:spec:pull
POSTMAN_API_KEY=... pnpm postman:spec:push
```

`pull` writes `api/postman/remote-specification.snapshot.json` for review; it does **not** silently overwrite the repository OpenAPI. `push` resolves the configured Postman file ID to its current file path and updates that file from `api/openapi/openapi.yaml`.

## Safety

- `POSTMAN_API_KEY` must be kept in a shell, local secret manager, or CI secret store.
- Remote sync is explicit; `pnpm verify` validates IDs/configuration but performs no remote writes.
- Dataset mutation must use disposable test records/workspaces unless a run is intentionally targeting a non-production environment.
