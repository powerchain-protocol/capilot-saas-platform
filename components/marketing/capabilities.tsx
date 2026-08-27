import { Activity, Bot, Boxes, Cable, ShieldCheck } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";

const capabilities = [
  ["Renewable Infrastructure", "Manage solar, wind, storage, EV charging, and connected assets at scale.", Activity],
  ["AI-Powered Operations", "Turn operational context into summaries, anomaly reviews, and recommendations.", Bot],
  ["Grid Intelligence", "Bring telemetry, forecasts, local-market context, and system events into one view.", Cable],
  ["Tokenized Assets", "Represent approved asset and transaction records with clear operational boundaries.", Boxes],
  ["Onchain Verification", "Attach verifiable provenance to defined records without putting all telemetry onchain.", ShieldCheck],
] as const;

export function Capabilities() {
  return (
    <section id="solutions" className="bg-[#F7F9F7] py-24">
      <div className="pc-shell">
        <div className="max-w-3xl">
          <p className="pc-kicker">PowerChain platform</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-.045em] sm:text-5xl">Built for the operating reality of energy infrastructure.</h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map(([title, desc, Icon], i) => (
            <article key={title} className="pc-card group overflow-hidden p-6 transition duration-150 hover:-translate-y-1 hover:border-[#BFCAC2]">
              <div className="relative h-40 overflow-hidden rounded-2xl bg-[linear-gradient(150deg,#F5F8F6,#DCE9E1)]">
                <div className="absolute inset-0 pc-grid-lines opacity-60" />
                <div className="absolute -bottom-12 -right-7 size-44 rounded-full border-[24px] border-white/60" />
                <span className="absolute left-6 top-6 grid size-14 place-items-center rounded-2xl border border-white/80 bg-white/80 shadow-sm">
                  <Icon className="size-7 text-[#1E6B4B]" />
                </span>
                <div className="absolute bottom-5 left-6 right-6 flex items-end gap-2">
                  {Array.from({ length: 6 }).map((_, j) => <span key={j} className="w-5 rounded-t bg-[#86AE97]/55" style={{ height: `${20 + j * 12 + i * 2}px` }} />)}
                </div>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-[-.03em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#66706A]">{desc}</p>
            </article>
          ))}

          <article className="pc-card group overflow-hidden p-6 transition duration-150 hover:-translate-y-1 hover:border-[#BFCAC2]">
            <div className="relative h-40 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_38%_35%,#FFFFFF_0,#F1F3F2_38%,#DCE6E0_100%)]">
              <div className="absolute inset-0 pc-grid-lines opacity-35" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_16px_25px_rgba(16,21,19,.18)]">
                <PwrcIcon size={104} />
              </div>
              <span className="absolute bottom-4 right-4 rounded-full border border-[#D7DED9] bg-white/90 px-3 py-1 text-[9px] font-bold tracking-[.08em] text-[#58645D]">PWRC</span>
            </div>
            <h3 className="mt-6 text-xl font-bold tracking-[-.03em]">PWRC Credits & Settlement</h3>
            <p className="mt-3 text-sm leading-6 text-[#66706A]">Keep credit balances, receipts, reservations, and supported settlement rails visible with transparent accounting.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
