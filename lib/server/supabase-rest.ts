import { env, hasSupabase } from "./env";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(table: string, query = "", method: Method = "GET", body?: unknown): Promise<T> {
  if (!hasSupabase) throw new Error("Supabase is not configured");
  const url = `${env.supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}${query ? `?${query}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: env.supabaseServiceKey,
      authorization: `Bearer ${env.supabaseServiceKey}`,
      "content-type": "application/json",
      prefer: method === "POST" || method === "PATCH" ? "return=representation" : "return=minimal",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${method} ${table} failed (${res.status}): ${await res.text()}`);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const supabaseRest = {
  list: <T>(table: string, query: string) => request<T[]>(table, query, "GET"),
  insert: <T>(table: string, body: unknown) => request<T[]>(table, "", "POST", body),
  update: <T>(table: string, query: string, body: unknown) => request<T[]>(table, query, "PATCH", body),
};
