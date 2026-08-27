import { NextResponse, type NextRequest } from "next/server";
import { corsHeaders, isCorsOriginAllowed } from "@/cors";

/**
 * API v1 edge boundary.
 *
 * CORS is same-origin by default. Additional credentialed origins must be
 * explicitly configured in CORS_ALLOWED_ORIGINS. Preflight is handled here so
 * every /api/v1 route has the same policy, including compatibility wrappers.
 */
export function proxy(request: NextRequest) {
  if (!isCorsOriginAllowed(request)) {
    return new NextResponse(null, {
      status: 403,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }

  const headers = corsHeaders(request);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
