
# TypeScript SDK

The first-party reference SDK is `packages/sdk-typescript` (`@powerchain/copilot-sdk`).

```ts
import { PowerChainClient } from "@powerchain/copilot-sdk";

const powerchain = new PowerChainClient({ baseUrl: "http://localhost:8000" });
const health = await powerchain.health();
```

Authenticated browser use relies on the signed HttpOnly `pc_session` cookie:

```ts
await powerchain.demo();
const session = await powerchain.currentSession();
const chat = await powerchain.createChat("Portfolio review");
const response = await powerchain.sendMessage(chat.id, "Summarize asset health.");
```

## Realtime

```ts
import { connectChatSocket } from "@powerchain/copilot-sdk";

const socket = connectChatSocket({
  wsBaseUrl: "ws://localhost:8000",
  chatIdOrSlug: chat.id,
  onEvent: (event) => console.log(event),
});
```

If WebSocket connectivity fails, applications should fall back to HTTP chat reads. Do not infer missing events.

## Authentication model

External v1 requests use `X-Api-Key`. User/workspace calls additionally use the signed `pc_session` cookie. Server-side clients should supply `apiKey`; browser applications should normally use the same-origin Next.js gateway so the raw key never reaches browser JavaScript.

## API-key client

```ts
const client = new PowerChainClient({ apiKey: process.env.POWERCHAIN_API_KEY });
```

The default API host is `https://api.capilot.powerchain.energy`; SDK methods target `/v1`.

## Credits

The TypeScript client includes `credits()`, `creditLedger()`, `creditQuotes()`, `creditReceipts()`, `tokens()`, and `pwrcToken()`. Supply an API key with `new PowerChainClient({ apiKey })`; the SDK targets `/v1` on the configured base host.

### Verify a completed-response receipt

```ts
const response = await client.sendMessage(chat.id, "Summarize asset health.");
console.log(response.billing.quote.quoteHash);
console.log(response.billing.receipt.id);

const receipts = await client.creditReceipts();
```

Receipts are non-transferable audit evidence.
