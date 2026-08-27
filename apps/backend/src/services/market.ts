import { env } from "../config/env.ts";
import { ApiError } from "../api/v1/middlewares/http.ts";

export async function getPythPrice(feedId: string) {
  const normalized = feedId.replace(/^0x/, "");
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) throw new ApiError("Pyth feed id must be 32-byte hex.", { status: 422, code: "PYTH_INVALID_FEED_ID" });
  const url = new URL("/v2/updates/price/latest", env.pythHermesUrl);
  url.searchParams.append("ids[]", normalized);
  url.searchParams.set("parsed", "true");
  const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new ApiError(`Pyth returned HTTP ${response.status}.`, { status: 502, code: "PYTH_HTTP_ERROR" });
  const payload = await response.json() as { parsed?: Array<{ price?: { price?: string; expo?: number; conf?: string; publish_time?: number } }> };
  const price = payload.parsed?.[0]?.price;
  if (!price?.price || typeof price.expo !== "number") throw new ApiError("Pyth returned an invalid payload.", { status: 502, code: "PYTH_INVALID_RESPONSE" });
  const multiplier = 10 ** price.expo;
  return { source: "pyth", price: Number(price.price) * multiplier, confidence: price.conf ? Number(price.conf) * multiplier : null, publishTime: price.publish_time ?? null };
}

export async function getBirdeyePrice(address: string) {
  if (!env.birdeyeApiKey) throw new ApiError("Birdeye is not configured.", { status: 503, code: "BIRDEYE_NOT_CONFIGURED" });
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) throw new ApiError("Invalid Solana token address.", { status: 422, code: "INVALID_TOKEN_ADDRESS" });
  const url = new URL("/defi/price", env.birdeyeApiUrl);
  url.searchParams.set("address", address);
  const response = await fetch(url, { headers: { accept: "application/json", "X-API-KEY": env.birdeyeApiKey, "x-chain": "solana" }, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new ApiError(`Birdeye returned HTTP ${response.status}.`, { status: 502, code: "BIRDEYE_HTTP_ERROR" });
  const payload = await response.json() as { success?: boolean; data?: { value?: number; updateUnixTime?: number } };
  if (!payload.success || typeof payload.data?.value !== "number") throw new ApiError("Birdeye returned an invalid payload.", { status: 502, code: "BIRDEYE_INVALID_RESPONSE" });
  return { source: "birdeye", price: payload.data.value, updatedAt: payload.data.updateUnixTime ?? null };
}
