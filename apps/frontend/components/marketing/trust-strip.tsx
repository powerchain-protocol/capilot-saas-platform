import { Clock3, Database, LockKeyhole, ShieldCheck } from "lucide-react";

const items = [
  [ShieldCheck, "Governed actions", "Explicit approval boundaries"],
  [Database, "Evidence-aware", "Source-linked operational context"],
  [Clock3, "Fresh by design", "Freshness and source identity visible"],
  [LockKeyhole, "Secure by default", "Workspace-scoped access controls"],
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-raised)]" aria-label="Platform trust principles">
      <div className="pc-shell grid divide-y divide-[#E7EAE8] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
        {items.map(([Icon, title, copy]) => (
          <div key={title} className="flex min-h-[102px] items-center gap-3 px-4 py-5 sm:px-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#DDE5DF] bg-white text-[var(--green)] shadow-sm"><Icon className="size-4.5" /></span>
            <div><b className="block text-xs text-[var(--ink-soft)]">{title}</b><span className="mt-1 block text-[10px] leading-4 text-[#7A847E]">{copy}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
