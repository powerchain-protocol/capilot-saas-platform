"use client";

import { useEffect, useState } from "react";
import { powerChainApi, type HealthSnapshot } from "@/lib/powerchain";

export function StatusClient() {
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    powerChainApi.health().then(setHealth).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Unable to load system health.");
    });
  }, []);

  if (error) return <div className="pc-card mt-8 p-6"><b className="text-sm">Status unavailable</b><p className="mt-2 text-xs text-[var(--muted)]">{error}</p></div>;
  if (!health) return <div className="pc-card mt-8 p-6" aria-hidden="true"><div className="pc-skeleton h-12 rounded-xl"/><div className="pc-skeleton mt-3 h-12 rounded-xl"/><div className="pc-skeleton mt-3 h-12 rounded-xl"/></div>;

  const rows = [
    ["API", health.status],
    ["Database", `${health.database.adapter} · ${health.database.ok ? "operational" : "degraded"}`],
    ["Sessions", health.sessions],
    ["Copilot adapter", health.ai],
    ["WebSocket", health.websocket],
    ["Pyth", health.providers.pyth ? "configured" : "not configured"],
    ["Birdeye", health.providers.birdeye ? "configured" : "not configured"],
    ["Helius", health.providers.helius ? "configured" : "not configured"],
    ["Solana RPC", health.providers.solanaRpc ? "configured" : "not configured"],
  ];
  return <div className="pc-card mt-8 overflow-hidden"><div className="flex items-center gap-3 border-b border-[var(--border)] bg-[#F3F8F5] p-5"><span className={`size-3 rounded-full ${health.status === "operational" ? "bg-[#167A4A]" : "bg-[#B7791F]"}`} /><b className="text-sm">{health.status === "operational" ? "Application operational" : "Configuration required"}</b><span className="ml-auto text-[10px] text-[var(--muted)]">v{health.version}</span></div>{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-[#EDF0EE] px-5 py-4 last:border-0"><span className="text-sm font-semibold">{label}</span><span className="text-right text-xs capitalize text-[#617069]">{value}</span></div>)}</div>;
}
