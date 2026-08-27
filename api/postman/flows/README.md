
# API flow recipes

These files document repeatable Postman/Collection Runner flows:

- `demo-chat.flow.json` — demo session → current session → create chat → send message → read message.
- `governed-approval.flow.json` — demo session → list approvals → explicit action → verify list.
- `provider-health.flow.json` — API health → demo session → services → Solana adapter health.
- `credits.flow.json` — credit snapshot → quote evidence → completed response → receipt/ledger verification.

The manifests use `api/schemas/api-flow.schema.json`. They are portable repository documentation, not a claim of compatibility with a proprietary Postman Flows export format.
