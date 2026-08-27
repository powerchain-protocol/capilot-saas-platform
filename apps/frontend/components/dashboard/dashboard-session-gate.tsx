"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SessionProvider } from "@/context/session-context";
import { powerChainApi, PowerChainApiError, type SessionContext } from "@/lib/powerchain";

export function DashboardSessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionContext | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    powerChainApi.currentSession()
      .then((value) => setSession(value))
      .catch((reason: unknown) => {
        if (reason instanceof PowerChainApiError && reason.status === 401) {
          router.replace("/sign-in?next=/dashboard");
          return;
        }
        setError(reason instanceof Error ? reason.message : "Unable to load workspace session.");
      });
  }, [router]);

  if (error) return <main className="grid min-h-screen place-items-center bg-[var(--canvas)] p-6"><div className="pc-card max-w-lg p-8"><h1 className="text-xl font-bold">Workspace unavailable</h1><p className="mt-2 text-sm text-[var(--muted)]">{error}</p></div></main>;
  if (!session) return <DashboardGateSkeleton />;

  return (
    <SessionProvider value={session}>
      <DashboardShell userName={session.user.name} workspaceName={session.workspace.name}>{children}</DashboardShell>
    </SessionProvider>
  );
}

function DashboardGateSkeleton() {
  return <main className="min-h-screen bg-[var(--canvas)] p-6" aria-hidden="true"><div className="mx-auto max-w-[1400px]"><div className="pc-skeleton h-14 rounded-2xl"/><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4"><div className="pc-skeleton h-28 rounded-2xl"/><div className="pc-skeleton h-28 rounded-2xl"/><div className="pc-skeleton h-28 rounded-2xl"/><div className="pc-skeleton h-28 rounded-2xl"/></div><div className="pc-skeleton mt-4 h-96 rounded-2xl"/></div></main>;
}
