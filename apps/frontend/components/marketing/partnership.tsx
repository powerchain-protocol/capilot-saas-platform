import { Activity, Boxes, Database, Orbit, RadioTower, Sparkles } from "lucide-react";
import { ecosystemItems } from "@/data/partnerships";

const icons = [Orbit, Activity, RadioTower, Boxes, Database, Sparkles] as const;

export function Partnership() {
  return (
    <section className="border-t border-[var(--border)] bg-white" aria-labelledby="ecosystem-title">
      <div className="pc-shell py-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="pc-kicker">Ecosystem</p>
          <h2 id="ecosystem-title" className="mt-2 text-xl font-bold tracking-[-.035em] text-[#1A231D] sm:text-2xl">Built to connect with modern energy and onchain infrastructure.</h2>
          <p className="mt-2 text-xs leading-5 text-[#79827D]">Configured adapters and supported integration surfaces. Names shown here do not imply endorsement or a commercial partnership.</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {ecosystemItems.map((item, index) => {
            const Icon = icons[index];
            return <div key={item.name} className="group flex min-h-20 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 transition hover:bg-white"><Icon className="size-5 shrink-0 text-[#B0B7B2] transition group-hover:text-[#8C9790]" /><div className="min-w-0"><p className="text-xs font-bold text-[#69736D]">{item.name}</p><p className="mt-1 truncate text-[9px] text-[#A0A7A2]">{item.label}</p></div></div>;
          })}
        </div>
      </div>
    </section>
  );
}
