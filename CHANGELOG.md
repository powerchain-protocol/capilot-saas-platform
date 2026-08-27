# Changelog

## 1.0.0 — Canonical release

PowerChain Copilot uses **1.0.0** as the canonical product version. Internal iteration numbers are intentionally not exposed as product versions.

### Platform
- Full-stack authenticated SaaS shell, dashboard, Copilot, assets, approvals, settings, contact, pricing, docs, security, status, and legal routes.
- Durable production storage through Supabase REST with fail-closed production configuration.
- Signed HttpOnly session model and explicit approval boundaries.

### Setup and distribution
- Added `/setup/` guided installation surface.
- Added GitHub Releases and Google Drive distribution sources.
- Added managed App Store / Google Play source slots and browser access.
- Missing native release URLs fail closed into real access-request flows.
- Centralized install configuration and release rules under `/config/`.

### Frontend
- Added canonical `config/app.ts`, `config/navigation.ts`, `config/install.ts`, and `config/rules.ts`.
- Added responsive `hooks/mobile.ts` and shared `lib/mobile.ts` helpers.
- Added accessible global `components/ui/toast.tsx` notifications.
- Added lazy loading for non-critical homepage product sections.
- Improved responsive spacing, touch targets, focus states, reduced-motion support, and distribution UI.

### UI/UX refinement
- Refined the responsive marketing hero, device presentation, trust strip, navigation, and loading skeletons.
- Added active navigation states, escape-to-close mobile navigation, body-scroll locking, and universal skip-to-content support.
- Rebuilt the authenticated SaaS shell with clearer workspace context, responsive bottom navigation, safer mobile spacing, and improved status hierarchy.
- Upgraded Copilot with interactive suggested prompts, controlled composer state, character count, contextual action links, and clearer analysis/approval boundaries.
- Upgraded Assets with search, asset-type filters, result counts, reset state, responsive cards, and loading skeletons.
- Upgraded Approvals with summary counters, status filters, toast feedback, responsive action controls, and resolved-state presentation.
- Improved sign-in and registration with password visibility controls, live password requirements, clearer errors, and accessible loading states.
- Moved non-runtime design references out of `public/` so they are not deployed as production static assets.

### Tooling
- Next.js 16.3 configuration with optimized image formats, package import optimization, compression, and security headers.
- Vercel configuration added.
- `.gitignore` expanded for Next.js, Vercel, package managers, generated artifacts, secrets, and local data.
- TypeScript configuration modernized for strict Next.js App Router development.

### Full-stack organization and security refinement
- Added `/data/`, `/utils/`, `components/services/`, `/cors/`, and `apps/frontend/api/v1/` architecture.
- Added the canonical `/api/v1` browser-facing API surface while retaining legacy route modules for compatibility.
- Added shared `cache.ts`, `safe-actions.ts`, Pyth, Birdeye, Helius, and Solana RPC server adapters.
- Added exact-origin CORS configuration with uniform `/api/v1` proxy/preflight enforcement and upgraded request security/rate-limit handling with hashed transient IP keys.
- Added Remember me session persistence with a 30-day explicit opt-in and a 12-hour standard session lifetime.
- Added masked-by-default current IP visibility in workspace settings without application-database IP persistence.
- Added cookie notice UI, expanded Terms of Service, Privacy, Cookie Policy, and Product Disclaimer routes.
- Added configurable centered update top bar with editable badge/message/link and dismiss state.
- Added neutral light-gray ecosystem/integration strip above the footer without implying endorsements.
- Added provider service configuration UI and updated README, API, integrations, security, architecture, and progress documentation.
