import { cacheGetOrSet } from "@/lib/cache";
import { servicesConfig } from "@/config/services";
import { AppError } from "@/utils/errors";

export type PythPrice = { price: number; confidence: number | null; publishTime: number | null; source: "pyth" };

export function isPythConfigured() {
  return Boolean(process.env.PYTH_SOL_USD_FEED_ID || process.env.PYTH_DEFAULT_FEED_ID);
}

export async function getPythPrice(feedId = process.env.PYTH_DEFAULT_FEED_ID || process.env.PYTH_SOL_USD_FEED_ID): Promise<PythPrice> {
  if (!feedId) throw new AppError("Pyth feed id is not configured.", { code: "PYTH_NOT_CONFIGURED", status: 503 });
  const normalized = feedId.replace(/^0x/, "");
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) throw new AppError("Pyth feed id must be a 32-byte hex identifier.", { code: "PYTH_INVALID_FEED_ID", status: 422 });
  return cacheGetOrSet(`pyth:${normalized}`, servicesConfig.cacheTtlMs, async () => {
    const url = new URL("/v2/updates/price/latest", servicesConfig.pythHermesUrl);
    url.searchParams.append("ids[]", normalized);
    url.searchParams.set("parsed", "true");
    const response = await fetch(url, { signal: AbortSignal.timeout(servicesConfig.requestTimeoutMs), headers: { accept: "application/json" }, cache: "no-store" });
    if (!response.ok) throw new AppError(`Pyth returned HTTP ${response.status}.`, { code: "PYTH_HTTP_ERROR", status: 502 });
    const json = await response.json() as { parsed?: Array<{ price?: { price?: string; expo?: number; conf?: string; publish_time?: number } }> };
    const price = json.parsed?.[0]?.price;
    if (!price?.price || typeof price.expo !== "number") throw new AppError("Pyth returned an invalid price payload.", { code: "PYTH_INVALID_RESPONSE", status: 502 });
    const multiplier = 10 ** price.expo;
    return {
      price: Number(price.price) * multiplier,
      confidence: price.conf ? Number(price.conf) * multiplier : null,
      publishTime: price.publish_time ?? null,
      source: "pyth" as const,
    };
  });
}
