"use client";

import { ErrorBoundaryPage } from "@/integrations/pages";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body><ErrorBoundaryPage error={error} reset={reset} global /></body>
    </html>
  );
}
