"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export type ErrorBoundaryPageProps = {
  error?: Error & { digest?: string };
  reset?: () => void;
  global?: boolean;
};

export function ErrorBoundaryPage({ error, reset, global = false }: ErrorBoundaryPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] p-6">
      <div className="w-full max-w-2xl rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-7 text-center shadow-[var(--shadow-md)] sm:p-10">
        <Logo className="justify-center" />
        <div className="mx-auto mt-10 grid size-16 place-items-center rounded-2xl bg-[#FFF3E7] text-[#A45B12]"><AlertTriangle className="size-7" aria-hidden="true" /></div>
        <p className="pc-kicker mt-8">{global ? "Application error" : "Something went wrong"}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-.05em] sm:text-5xl">PowerChain could not finish that view.</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">No approval or execution action is assumed to have succeeded. Retry the view, then verify activity and receipts before repeating any sensitive operation.</p>
        {process.env.NODE_ENV === "development" && error?.message ? <pre className="mt-6 max-h-32 overflow-auto rounded-xl bg-[var(--surface-soft)] p-3 text-left text-[10px] leading-5 text-[var(--muted)]">{error.message}</pre> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {reset ? <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[var(--forest-strong)]"><RefreshCw className="size-4" /> Try again</button> : null}
          <Button href="/" variant={reset ? "secondary" : "primary"}><Home className="size-4" /> Return home</Button>
          <Button href="/status" variant="ghost">System status</Button>
        </div>
        {error?.digest ? <p className="mt-6 text-[10px] text-[var(--muted-2)]">Error reference: {error.digest}</p> : null}
      </div>
    </main>
  );
}
