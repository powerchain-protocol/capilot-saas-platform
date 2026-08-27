import { withCors, corsPreflight } from "@/cors";
import { getBirdeyePrice, isBirdeyeConfigured } from "@/lib/birdeye";
import { getPythPrice, isPythConfigured } from "@/lib/pyth";
import { apiSession, fail, ok } from "@/lib/server/http";
import { allowRequest } from "@/lib/server/security";
import { safeAction } from "@/lib/safe-actions";
import { AppError } from "@/utils/errors";

export async function GET(req: Request) {
  if (!allowRequest(req, "v1-market-price", 60, 60_000)) return withCors(req, fail("Too many requests. Try again shortly.", 429, "RATE_LIMITED"));
  const session = await apiSession();
  if (!session) return withCors(req, fail("Sign in required.", 401, "UNAUTHENTICATED"));
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider") || "auto";
  const address = url.searchParams.get("address") || "";
  const feedId = url.searchParams.get("feedId") || undefined;

  const result = await safeAction(async () => {
    if ((provider === "auto" || provider === "pyth") && (feedId || isPythConfigured())) return getPythPrice(feedId);
    if ((provider === "auto" || provider === "birdeye") && address && isBirdeyeConfigured()) return getBirdeyePrice(address);
    throw new AppError("No configured price provider can satisfy this request.", { status: 503, code: "PRICE_PROVIDER_UNAVAILABLE" });
  }, "Unable to load market price.");

  return withCors(req, result.ok ? ok(result.data) : fail(result.error.message, result.error.status, result.error.code));
}
export function OPTIONS(req: Request) { return corsPreflight(req); }
