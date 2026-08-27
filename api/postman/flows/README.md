
# API flow recipes

These files document repeatable Postman/Collection Runner flows:

- `demo-chat.flow.json` — demo session → current session → create chat → send message → read message.
- `governed-approval.flow.json` — demo session → list approvals → explicit action → verify list.
- `provider-health.flow.json` — API health → demo session → services → Solana adapter health.

The manifests use `api/schemas/api-flow.schema.json`. They are portable repository documentation, not a claim of compatibility with a proprietary Postman Flows export format.
