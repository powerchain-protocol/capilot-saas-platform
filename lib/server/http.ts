import { NextResponse } from "next/server";
import { getSession } from "./auth";

const apiHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status, headers: apiHeaders });
}

export function fail(message: string, status = 400, code = "BAD_REQUEST") {
  return NextResponse.json({ ok: false, error: { message, code } }, { status, headers: apiHeaders });
}

export async function apiSession() { return getSession(); }
export async function jsonBody<T>(req: Request): Promise<T | null> { try { return await req.json() as T; } catch { return null; } }
