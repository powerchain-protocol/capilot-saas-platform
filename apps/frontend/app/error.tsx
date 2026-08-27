"use client";

import { ErrorBoundaryPage } from "@/integrations/pages";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorBoundaryPage error={error} reset={reset} />;
}
