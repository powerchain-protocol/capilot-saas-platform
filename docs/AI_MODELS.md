# AI models and provider routing

PowerChain Copilot keeps model selection server-side. Browser code can inspect sanitized model availability but never receives provider credentials.

## Provider order

```dotenv
AI_PROVIDER_ORDER=openai,anthropic,gemini,deepseek,ollama
AI_REQUEST_TIMEOUT_MS=30000
```

Each completed Copilot response uses one existing PWRC reservation. Provider fallback happens inside that reservation and must not create another quote or charge.

## Configurable model aliases

```dotenv
OPENAI_MODEL=gpt-5.6-mini
ANTHROPIC_MODEL=claude-sonnet-4-5
GEMINI_MODEL=gemini-2.5-pro
DEEPSEEK_MODEL=deepseek-chat
OLLAMA_MODEL=llama3.3
```

These are configuration defaults/aliases, not a guarantee that the corresponding provider credential, entitlement, or deployment exists. Override them per deployment without changing application code.

Provider credentials:

```dotenv
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
DEEPSEEK_API_KEY=
OLLAMA_API_URL=
```

The backend currently implements:

- OpenAI Responses API
- Anthropic Messages API
- Gemini `generateContent`
- DeepSeek OpenAI-compatible chat completions
- Ollama `/api/chat`

If a configured provider fails, the router attempts the next configured provider. If no provider is available in development and `ALLOW_DEMO_AI=true`, the deterministic representative response path may be used. Mainnet should keep demo AI disabled.

## Model registry API

```text
GET /v1/ai/models
```

The response exposes provider, configured model alias, local/managed mode, and whether that provider has runtime configuration. It never exposes credentials.

## Shared model catalog

Static model/provider descriptors used by the UI live in:

```text
packages/ai/src/providers.ts
packages/ai/src/models.ts
```

Runtime availability remains authoritative on the backend.
