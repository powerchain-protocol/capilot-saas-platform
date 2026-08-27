import { CreditsSummary } from "@/components/credits";

export default function CreditsPage() {
  return <div className="mx-auto max-w-[1200px]"><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--green)]">Usage</p><h1 className="mt-2 text-3xl font-bold tracking-[-.04em]">PWRC Credits</h1><p className="mt-2 text-sm text-[var(--muted)]">Inspect available credits and the credit ledger without exposing wallet secrets.</p></div><CreditsSummary/></div>;
}
