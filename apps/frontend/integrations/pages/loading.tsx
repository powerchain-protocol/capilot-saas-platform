import { Logo } from "@/components/brand/logo";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPage({ label = "Loading PowerChain Copilot…" }: { label?: string }) {
  return (
    <main className="min-h-screen bg-[var(--canvas)] px-4 py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center"><Logo /></div>
        <div className="mx-auto mt-12 max-w-3xl rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="mt-5 h-10 w-3/4 rounded-xl" />
          <Skeleton className="mt-3 h-4 w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded-lg" />
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <p className="mt-6 text-center text-xs text-[var(--muted-2)]">{label}</p>
        </div>
      </div>
    </main>
  );
}
