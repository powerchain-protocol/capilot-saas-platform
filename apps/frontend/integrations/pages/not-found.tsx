import { Home, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] p-6">
      <div className="w-full max-w-2xl rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 text-center shadow-[var(--shadow-md)] sm:p-10">
        <Logo className="justify-center" />
        <div className="mx-auto mt-10 grid size-16 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]"><Search className="size-7" aria-hidden="true" /></div>
        <p className="pc-kicker mt-8">404 · Route not found</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-.05em] sm:text-5xl">This route is off-grid.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">The page may have moved, the link may be outdated, or the requested workspace route may not be available to this session.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" arrow><Home className="size-4" /> Return home</Button>
          <Button href="/dashboard" variant="secondary"><ShieldCheck className="size-4" /> Open dashboard</Button>
        </div>
      </div>
    </main>
  );
}
