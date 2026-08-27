# PWRC Credits and Completed-Response Billing

PowerChain Copilot `1.0.0` uses PWRC as an application usage-credit accounting unit for completed Copilot responses. The current canonical completed-response price is **10,000 PWRC**.

This subsystem is an application accounting boundary. A PowerChain credit receipt is **non-transferable audit evidence**, not a security, investment product, payment token, or transferable financial instrument.

## Authoritative transaction path

```text
USER MESSAGE PERSISTED
        ↓
DETERMINISTIC SERVER QUOTE
        ↓
canonical sorted JSON payload
        ↓
SHA-256 quote hash
        ↓
PERSIST QUOTE
        ↓
ATOMIC CREDIT RESERVATION
        ↓
AI GENERATION
        ↓
ATOMIC RESPONSE + SETTLEMENT
        ↓
reserved → spent (10,000 PWRC)
        ↓
APPEND-ORIENTED LEDGER
        ↓
NON-TRANSFERABLE RECEIPT
```

The assistant response is delivered only after the response message, credit settlement, and receipt have committed together at the store boundary.

## Failure behavior

- **Insufficient credits:** returns HTTP `402 INSUFFICIENT_CREDITS`; AI generation does not start.
- **AI/provider failure:** the reservation is released using a compensating ledger movement.
- **Settlement transaction failure:** the storage transaction rolls back and the service attempts a compensating release. No assistant response is returned as delivered.
- **Expired quote:** cannot be reserved.
- **Abandoned/crashed request:** a server reconciliation loop releases reservations that remain reserved beyond the configured recovery window, recording a compensating ledger movement.
- **Duplicate state transition:** fails closed rather than charging twice.

## Quote evidence

Every quote binds:

- application version
- pricing version
- purpose
- PWRC amount
- workspace
- user
- chat
- persisted request-message ID
- issue time
- expiry time

The canonical payload is SHA-256 hashed. A successful receipt preserves the quote hash and links it to the reservation ledger entry, settlement ledger entry, and persisted assistant response.

## Credit states

`credit_accounts` tracks:

- `available`
- `reserved`
- `spent`
- `funded`

`credit_ledger` records reserve, release, settlement, and funding movements. Integer accounting values are stored without JavaScript floating-point arithmetic.

## API

```text
GET /v1/credits
GET /v1/credits/ledger
GET /v1/credits/quotes
GET /v1/credits/receipts
```

The browser uses the same-origin `/api/v1/*` gateway. External clients use `/v1/*` and must supply the configured `X-Api-Key`; authenticated workspace operations also require a valid user session.

`POST /v1/ai/generate` is a development/diagnostic preview path and is disabled by default in production through `ALLOW_UNBILLED_AI_PREVIEW=false`; production Copilot delivery should use persisted chat so the billing lifecycle cannot be bypassed.

## Realtime event

After committed settlement, chat subscribers receive `chat.receipt`.

The REST response remains authoritative for the sender. The WebSocket event supports synchronized workspace views and must not be interpreted as a second settlement request.

## Migrations

- `20260827000200_credits.sql` — credit account and ledger
- `20260827000300_credit_quotes_receipts.sql` — deterministic quotes and non-transferable receipts

Apply migrations with:

```bash
pnpm db:migrate
```

Always reconcile application credit state against the durable PostgreSQL ledger before production release.

## Reservation recovery

A process crash can happen after an atomic reservation but before response settlement. The backend therefore runs a bounded stale-reservation reconciliation loop. `CREDIT_RESERVATION_RECOVERY_MS` defines the minimum reserved age before recovery (default 15 minutes) and `CREDIT_RECONCILE_INTERVAL_MS` controls the sweep cadence (minimum/default 60 seconds). Recovery uses row locking in PostgreSQL and records a `release` ledger entry with the `stale_reservation_recovery` reference.

The recovery age is intentionally separate from the signed quote's `expiresAt`; the quote payload/hash is never mutated after persistence.
