import { cacheGetOrSet } from "@/lib/cache";
import { servicesConfig } from "@/config/services";
import { AppError } from "@/utils/errors";

export type BirdeyePrice = { price: number; updatedAt: number | null; source: "birdeye" };

export function isBirdeyeConfigured() {
  return Boolean(process.env.BIRDEYE_API_KEY);
}

export async function getBirdeyePrice(address: string): Promise<BirdeyePrice> {
  const apiKey = process.env.BIRDEYE_API_KEY;
  if (!apiKey) throw new AppError("Birdeye API key is not configured.", { code: "BIRDEYE_NOT_CONFIGURED", status: 503 });
  if (!address) throw new AppError("Token address is required.", { code: "TOKEN_ADDRESS_REQUIRED", status: 422 });
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) throw new AppError("Token address is not a valid Solana base58 address.", { code: "INVALID_TOKEN_ADDRESS", status: 422 });
  return cacheGetOrSet(`birdeye:${address}`, servicesConfig.cacheTtlMs, async () => {
    const url = new URL("/defi/price", servicesConfig.birdeyeApiUrl);
    url.searchParams.set("address", address);
    const response = await fetch(url, {
      headers: { accept: "application/json", "X-API-KEY": apiKey, "x-chain": "solana" },
      signal: AbortSignal.timeout(servicesConfig.requestTimeoutMs),
      cache: "no-store",
    });
    if (!response.ok) throw new AppError(`Birdeye returned HTTP ${response.status}.`, { code: "BIRDEYE_HTTP_ERROR", status: 502 });
    const json = await response.json() as { success?: boolean; data?: { value?: number; updateUnixTime?: number } };
    if (!json.success || typeof json.data?.value !== "number") throw new AppError("Birdeye returned an invalid price payload.", { code: "BIRDEYE_INVALID_RESPONSE", status: 502 });
    return { price: json.data.value, updatedAt: json.data.updateUnixTime ?? null, source: "birdeye" as const };
  });
}
