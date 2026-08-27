import { CircleCheck, CircleDashed } from "lucide-react";

export function ServiceCard({ name, category, description, configured }: { name: string; category: string; description: string; configured?: boolean }) {
  return (
    <article className="rounded-2xl border border-[#E2E7E3] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#9AA29D]">{category}</p><h3 className="mt-1 text-sm font-bold text-[#1B241E]">{name}</h3></div>
        {typeof configured === "boolean" ? <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${configured ? "bg-[#EDF7F0] text-[var(--success)]" : "bg-[#F2F4F2] text-[var(--muted-2)]"}`}>{configured ? <CircleCheck className="size-3" /> : <CircleDashed className="size-3" />}{configured ? "Configured" : "Optional"}</span> : null}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#6B756F]">{description}</p>
    </article>
  );
}
