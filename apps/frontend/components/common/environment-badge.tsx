"use client";

import { frontendEnvironment } from "@/config/environment";

export function EnvironmentBadge({ compact = false }: { compact?: boolean }) {
  const mainnet = frontendEnvironment.id === "mainnet";
  const label = mainnet ? "Mainnet" : "Development";
  const network = frontendEnvironment.solanaCluster === "mainnet-beta" ? "Solana mainnet" : "Solana devnet";
  return (
    <span
      title={`${label} · ${network}`}
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-[.1em] ${compact ? "px-2 py-1 text-[8px]" : "px-3 py-1.5 text-[9px]"} ${mainnet ? "border-[#CFE2D5] bg-[#EDF7F0] text-[#17613F]" : "border-[#E2E5E2] bg-[#F4F5F4] text-[#68716C]"}`}
    >
      <span className={`size-1.5 rounded-full ${mainnet ? "bg-[#1E6B4B]" : "bg-[#8A938D]"}`} />
      {label}
    </span>
  );
}
