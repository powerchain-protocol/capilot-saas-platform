"use client";

import { CheckCircle2, Copy, FileCheck2, RefreshCw, ShieldCheck } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/components/ui/toast";

function integer(value: string): string {
  try { return BigInt(value).toLocaleString("en-US"); } catch { return value; }
}
function shortHash(value: string): string { return value.length > 18 ? `${value.slice(0, 9)}…${value.slice(-7)}` : value; }
function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function CreditsSummary() {
  const { snapshot, ledger, quotes, receipts, loading, error, refresh } = useCredits();
  const { toast } = useToast();
  if (loading) return <div className="pc-card h-64 animate-pulse" aria-label="Loading credits" />;
  if (error || !snapshot) return <div className="pc-card p-6"><h2 className="font-bold">Credits unavailable</h2><p className="mt-2 text-sm text-[var(--muted)]">{error ?? "No credit account was returned."}</p><button type="button" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--forest)] px-4 text-sm font-bold text-white" onClick={() => void refresh()}>Retry</button></div>;
  const { account } = snapshot;
  const latestQuote = quotes[0] ?? null;

  async function copyHash(value: string): Promise<void> {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(value);
      toast({ title: "Quote hash copied", description: "The SHA-256 quote hash is ready to verify." });
    } catch {
      toast({ title: "Could not copy quote hash", description: "Select the displayed hash and copy it manually.", tone: "error" });
    }
  }

  return <div className="space-y-4">
    <section className="pc-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-center gap-3"><PwrcIcon size={42}/><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--green)]">PWRC credits</p><h2 className="mt-1 text-2xl font-bold tracking-[-.04em]">{integer(account.available)} available</h2></div></div><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-semibold" onClick={() => void refresh()}><RefreshCw className="size-4"/>Refresh</button></div>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Available",account.available],["Reserved",account.reserved],["Spent",account.spent],["Funded",account.funded]].map(([label,value])=><div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--canvas)] p-4"><span className="text-[9px] font-bold uppercase tracking-[.1em] text-[var(--muted-2)]">{label}</span><b className="mt-2 block text-lg">{integer(value)}</b></div>)}</div>
      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-xs text-[var(--muted)]"><p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]"/><span>Completed responses cost <b className="text-[var(--ink)]">{integer(snapshot.pricing.completedResponsePwrc)} PWRC</b>. The server persists a deterministic quote, reserves atomically, settles only with the delivered response, then writes a non-transferable receipt.</span></p></div>
    </section>

    <section className="grid gap-4 lg:grid-cols-2">
      <div className="pc-card p-5">
        <div className="flex items-center gap-2"><FileCheck2 className="size-4 text-[var(--green)]"/><h2 className="text-sm font-bold">Latest quote</h2></div>
        {latestQuote ? <div className="mt-4 space-y-3 text-xs"><div className="flex items-center justify-between gap-3"><span className="text-[var(--muted)]">Status</span><span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-2.5 py-1 font-bold text-[var(--green)]"><CheckCircle2 className="size-3"/>{latestQuote.status}</span></div><div className="flex items-center justify-between gap-3"><span className="text-[var(--muted)]">Amount</span><b>{integer(latestQuote.amount)} PWRC</b></div><div className="flex items-center justify-between gap-3"><span className="text-[var(--muted)]">Pricing</span><b>{latestQuote.pricingVersion}</b></div><div className="flex items-center justify-between gap-3"><span className="text-[var(--muted)]">Hash</span><button type="button" onClick={() => void copyHash(latestQuote.quoteHash)} className="inline-flex items-center gap-1.5 font-mono font-semibold hover:text-[var(--green)]" title={latestQuote.quoteHash}>{shortHash(latestQuote.quoteHash)}<Copy className="size-3"/></button></div></div> : <p className="mt-4 text-xs text-[var(--muted)]">No response quote has been created yet.</p>}
      </div>
      <div className="pc-card p-5"><div className="flex items-center gap-2"><ShieldCheck className="size-4 text-[var(--green)]"/><h2 className="text-sm font-bold">Receipts</h2></div><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{receipts.length ? `${receipts.length} recent non-transferable settlement receipt${receipts.length === 1 ? "" : "s"}.` : "No completed-response receipts yet."}</p>{receipts[0] ? <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--canvas)] p-3 text-xs"><div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Receipt</span><b className="font-mono">{receipts[0].id}</b></div><div className="mt-2 flex justify-between gap-4"><span className="text-[var(--muted)]">Created</span><span>{formatDate(receipts[0].createdAt)}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-[var(--muted)]">Transferable</span><b>No</b></div></div> : null}</div>
    </section>

    <section className="pc-card overflow-hidden"><div className="border-b border-[var(--border)] px-5 py-4"><h2 className="text-sm font-bold">Credit ledger</h2><p className="mt-1 text-[10px] text-[var(--muted-2)]">Append-oriented credit movements for this workspace user.</p></div><div className="divide-y divide-[var(--border)]">{ledger.length ? ledger.map((entry)=><div key={entry.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[120px_1fr_auto]"><b className="text-xs capitalize">{entry.kind}</b><span className="truncate text-xs text-[var(--muted)]">{entry.reference || entry.id}</span><span className="text-xs font-semibold">{integer(entry.amount)} PWRC</span></div>) : <p className="px-5 py-8 text-center text-xs text-[var(--muted)]">No credit movements yet.</p>}</div></section>
  </div>;
}
