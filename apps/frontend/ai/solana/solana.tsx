import { Activity, CircleDot, Network, ShieldCheck, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type SolanaAiRuntime = {
  cluster: "devnet" | "mainnet-beta";
  status?: "operational" | "degraded" | "unavailable";
  provider?: string;
  slot?: number;
  blockHeight?: number;
  commitment?: "processed" | "confirmed" | "finalized";
  wallet?: string;
};

function compactWallet(value: string | undefined): string {
  if (!value) return "No wallet selected";
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}…${value.slice(-6)}`;
}

export function SolanaAiContextCard({ runtime }: { runtime: SolanaAiRuntime }) {
  const status = runtime.status ?? "unavailable";
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold text-[var(--green)]"><Network className="size-4" /> Solana context</p>
          <h3 className="mt-2 text-base font-semibold tracking-[-.02em]">Read-only chain evidence</h3>
        </div>
        <Badge className={status === "operational" ? "border-[#CFE2D5] bg-[#EDF7F0] text-[var(--success)]" : undefined}>{status}</Badge>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Row icon={CircleDot} label="Cluster" value={runtime.cluster} />
        <Row icon={Activity} label="RPC provider" value={runtime.provider ?? "Not configured"} />
        <Row icon={ShieldCheck} label="Commitment" value={runtime.commitment ?? "confirmed"} />
        <Row icon={WalletCards} label="Wallet" value={compactWallet(runtime.wallet)} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Metric label="Slot" value={runtime.slot?.toLocaleString() ?? "—"} />
        <Metric label="Block height" value={runtime.blockHeight?.toLocaleString() ?? "—"} />
      </div>
      <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">Balances, signatures and settlement remain unverified until the authenticated API confirms them against the configured RPC/evidence layer.</p>
    </Card>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"><Icon className="size-4 shrink-0 text-[var(--green)]" /><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--muted)]">{label}</p><p className="truncate text-xs font-semibold text-[var(--ink)]">{value}</p></div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[var(--surface-soft)] p-3"><p className="text-[10px] uppercase tracking-[.1em] text-[var(--muted)]">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
