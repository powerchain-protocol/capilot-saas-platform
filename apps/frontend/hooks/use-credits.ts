"use client";

import { useCallback, useEffect, useState } from "react";
import { powerChainApi } from "@/lib/powerchain";
import type { CreditsSnapshot, CreditLedgerEntry } from "@/types/credits";

export function useCredits() {
  const [snapshot, setSnapshot] = useState<CreditsSnapshot | null>(null);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextSnapshot, nextLedger] = await Promise.all([powerChainApi.getCredits(), powerChainApi.getCreditLedger()]);
      setSnapshot(nextSnapshot);
      setLedger(nextLedger);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load PWRC credits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { snapshot, ledger, loading, error, refresh } as const;
}
