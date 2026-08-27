import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BACKEND_URL = process.env.POWERCHAIN_BACKEND_URL ?? "http://127.0.0.1:8000";
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

type RouteContext = { params: Promise<{ path: string[] }> };

type HeadersWithSetCookie = Headers & { getSetCookie?: () => string[] };

async function proxy(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const incoming = new URL(request.url);
  const target = new URL(`/api/v1/${path.map(encodeURIComponent).join("/")}`, BACKEND_URL);
  target.search = incoming.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));
  const serverApiKey = process.env.POWERCHAIN_API_KEY;
  if (!serverApiKey && process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false, error: { code: "API_KEY_NOT_CONFIGURED", message: "PowerChain API gateway is not configured." } }, { status: 503 });
  }
  if (serverApiKey) headers.set("x-api-key", serverApiKey);

  let body: ArrayBuffer | undefined;
  if (METHODS_WITH_BODY.has(request.method)) {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > 0) body = buffer;
  }

  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(30_000)
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-encoding");
    const setCookies = (upstream.headers as HeadersWithSetCookie).getSetCookie?.() ?? [];
    responseHeaders.delete("set-cookie");

    const response = new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    });
    for (const cookie of setCookies) response.headers.append("set-cookie", cookie);
    const singleCookie = upstream.headers.get("set-cookie");
    if (setCookies.length === 0 && singleCookie) response.headers.append("set-cookie", singleCookie);
    return response;
  } catch (error) {
    const message = process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "PowerChain API is temporarily unavailable.";
    return NextResponse.json({ ok: false, error: { code: "BACKEND_UNAVAILABLE", message } }, { status: 503 });
  }
}

export function GET(request: Request, context: RouteContext) { return proxy(request, context); }
export function POST(request: Request, context: RouteContext) { return proxy(request, context); }
export function PUT(request: Request, context: RouteContext) { return proxy(request, context); }
export function PATCH(request: Request, context: RouteContext) { return proxy(request, context); }
export function DELETE(request: Request, context: RouteContext) { return proxy(request, context); }
export function OPTIONS(request: Request, context: RouteContext) { return proxy(request, context); }
