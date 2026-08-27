"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { useCredits } from "@/hooks/use-credits";

function integer(value: string): string {
  try { return BigInt(value).toLocaleString("en-US"); } catch { return value; }
}

export function CreditsSummary() {
  const { snapshot, ledger, loading, error, refresh } = useCredits();
  if (loading) return <div className="pc-card h-64 animate-pulse" aria-label="Loading credits" />;
  if (error || !snapshot) return <div className="pc-card p-6"><h2 className="font-bold">Credits unavailable</h2><p className="mt-2 text-sm text-[var(--muted)]">{error ?? "No credit account was returned."}</p><button type="button" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--forest)] px-4 text-sm font-bold text-white" onClick={() => void refresh()}>Retry</button></div>;
  const { account } = snapshot;
  return <div className="space-y-4">
    <section className="pc-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><PwrcIcon size={42}/><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--green)]">PWRC credits</p><h2 className="mt-1 text-2xl font-bold tracking-[-.04em]">{integer(account.available)} available</h2></div></div><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold" onClick={() => void refresh()}><RefreshCw className="size-4"/>Refresh</button></div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Available",account.available],["Reserved",account.reserved],["Spent",account.spent],["Funded",account.funded]].map(([label,value])=><div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--canvas)] p-4"><span className="text-[9px] font-bold uppercase tracking-[.1em] text-[var(--muted-2)]">{label}</span><b className="mt-2 block text-lg">{integer(value)}</b></div>)}</div>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]"/>Credits are internal usage accounting. A completed response follows the governed quote → reserve → deliver → settle → receipt lifecycle.</p>
    </section>
    <section className="pc-card overflow-hidden"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-sm font-bold">Credit ledger</h2><p className="mt-1 text-[10px] text-[var(--muted-2)]">Append-oriented credit movements for this workspace user.</p></div><div className="divide-y divide-[var(--border)]">{ledger.length ? ledger.map((entry)=><div key={entry.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[120px_1fr_auto]"><b className="text-xs capitalize">{entry.kind}</b><span className="truncate text-xs text-[var(--muted)]">{entry.reference || entry.id}</span><span className="text-xs font-semibold">{integer(entry.amount)} PWRC</span></div>) : <p className="px-5 py-8 text-center text-xs text-[var(--muted)]">No credit movements yet.</p>}</div></section>
  </div>;
}
