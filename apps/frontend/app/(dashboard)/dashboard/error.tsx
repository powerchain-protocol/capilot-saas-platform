"use client";

import { ErrorBoundaryPage } from "@/integrations/pages";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorBoundaryPage error={error} reset={reset} />;
}
