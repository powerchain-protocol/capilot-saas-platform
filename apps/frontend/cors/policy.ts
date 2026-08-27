import { corsConfig } from "@/config/cors";

function requestHost(req: Request) {
  return req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
}

export function isCorsOriginAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    if (originUrl.host === requestHost(req)) return true;
    return corsConfig.allowedOrigins.includes(origin);
  } catch {
    return false;
  }
}

export function corsHeaders(req: Request) {
  const origin = req.headers.get("origin");
  const headers = new Headers({
    "Access-Control-Allow-Methods": corsConfig.allowedMethods.join(", "),
    "Access-Control-Allow-Headers": corsConfig.allowedHeaders.join(", "),
    "Access-Control-Expose-Headers": corsConfig.exposedHeaders.join(", "),
    "Access-Control-Max-Age": String(corsConfig.maxAgeSeconds),
    Vary: "Origin",
  });
  if (origin && isCorsOriginAllowed(req)) {
    headers.set("Access-Control-Allow-Origin", origin);
    if (corsConfig.allowCredentials) headers.set("Access-Control-Allow-Credentials", "true");
  }
  return headers;
}

export function withCors(req: Request, response: Response) {
  const headers = corsHeaders(req);
  headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export function corsPreflight(req: Request) {
  if (!isCorsOriginAllowed(req)) return new Response(null, { status: 403 });
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}
