import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ReceiptText, WalletCards } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { Button } from "@/components/ui/button";

const lifecycle = [
  ["Quote", "Deterministic usage quote", FileCheck2],
  ["Reserve", "Atomic credit reservation", LockKeyhole],
  ["Deliver", "Completed Copilot response", CheckCircle2],
  ["Settle", "Append-only accounting", WalletCards],
  ["Receipt", "Verifiable usage receipt", ReceiptText],
] as const;

export function PwrcCredits() {
  return (
    <section id="pwrc" className="bg-white py-24">
      <div className="pc-shell">
        <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[linear-gradient(140deg,#FBFCFB_0%,#F4F7F5_58%,#EAF2ED_100%)]">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[.85fr_1.15fr] lg:p-14">
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <PwrcIcon size={72} framed priority />
                <div>
                  <p className="pc-kicker">PWRC credits</p>
                  <p className="mt-2 text-sm font-semibold text-[#526059]">Usage-aware Copilot accounting</p>
                </div>
              </div>

              <h2 className="mt-7 text-4xl font-bold tracking-[-.05em] sm:text-5xl">
                Credits with a clear operational lifecycle.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">
                Keep quotes, reservations, completed deliveries, balances, and receipts visible in one governed workflow instead of hiding usage behind opaque counters.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {["Available", "Reserved", "Spent", "Receipted"].map((state) => (
                  <span key={state} className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#526059]">
                    {state}
                  </span>
                ))}
              </div>

              <Button href="/product" variant="secondary" className="mt-8 w-fit" arrow>
                Explore credit architecture
              </Button>
            </div>

            <div className="rounded-[24px] border border-white/80 bg-white/88 p-5 shadow-[0_22px_60px_rgba(16,21,19,.07)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#E8ECE9] pb-5">
                <div className="flex items-center gap-3">
                  <PwrcIcon size={46} framed />
                  <div>
                    <span className="block text-[11px] text-[var(--muted-2)]">Available balance</span>
                    <b className="mt-1 block text-2xl tracking-[-.035em]">256,721 PWRC</b>
                  </div>
                </div>
                <span className="rounded-full bg-[#EDF6F0] px-3 py-1 text-[10px] font-bold text-[var(--success)]">Healthy</span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                {lifecycle.map(([title, desc, Icon], index) => (
                  <div key={title} className="relative rounded-2xl border border-[#E2E7E3] bg-[#FBFCFB] p-4 sm:min-h-[150px]">
                    <span className="grid size-9 place-items-center rounded-xl bg-[#EEF5F0] text-[var(--green)]"><Icon className="size-4" /></span>
                    <b className="mt-4 block text-xs">{title}</b>
                    <p className="mt-2 text-[10px] leading-4 text-[#748079]">{desc}</p>
                    {index < lifecycle.length - 1 && (
                      <ArrowRight className="absolute -right-[11px] top-1/2 z-10 hidden size-4 -translate-y-1/2 text-[#A9B3AC] sm:block" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E2E7E3] bg-[var(--canvas)] px-4 py-3 text-[10px] text-[var(--muted)]">
                <CheckCircle2 className="size-4 shrink-0 text-[var(--success)]" />
                Settlement is shown only after a completed delivered response; failed or interrupted work should not be charged as completed usage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
