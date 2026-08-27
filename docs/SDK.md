
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

## Server-side note

The v1 auth contract is browser cookie based. The SDK does not invent API-key or bearer-token authentication. A future machine credential should be introduced as an explicit backend contract before server-to-server authenticated use.
