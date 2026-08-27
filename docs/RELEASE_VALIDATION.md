# Release validation — PowerChain Copilot 1.0.0

Validated in the artifact build environment on 2026-08-27.

## Passed

- Source architecture audit: 235 TypeScript/TSX files, no detected explicit `any` annotations/casts.
- Internal route audit: 24 application page routes; no dead literal internal links.
- Interactive action audit: passed across 178 frontend TypeScript/TSX files.
- API/backend structure audit: 17 canonical frontend/backend/API artifacts present.
- Public asset audit: all literal static asset references resolve.
- OpenAPI audit: 25 canonical HTTP/WebSocket paths represented.
- Dashboard action-registry audit: 4 registered governed actions.
- TypeScript syntax/transpile scan: 234 implementation files, 0 syntax diagnostics.
- Static `@/` and relative import resolution: 0 unresolved imports across 235 TS/TSX files.
- JSON/YAML parsing: passed.
- PWA service-worker JavaScript syntax: passed.

## Environment limitation

The artifact environment runs Node.js 22 and does not contain the project dependency tree. The repository itself correctly requires Node.js 24.20.0+ and pnpm 11.23.0. Therefore the dependency-backed `pnpm install`, ESLint 10.9.1 execution, `tsc --noEmit`, Turbo build, and Next.js production build must be run in a network-enabled Node 24.20.0 environment before production release.

Use:

```bash
nvm use
corepack enable
corepack prepare pnpm@11.23.0 --activate
pnpm install
pnpm approve-builds
pnpm db:check
pnpm db:migrate
pnpm verify
```
