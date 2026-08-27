"use client";

import { useCallback, useEffect, useState } from "react";
import { powerChainApi } from "@/lib/powerchain";
import type { CreditLedgerEntry, CreditQuote, CreditReceipt, CreditsSnapshot } from "@/types/credits";

export function useCredits() {
  const [snapshot, setSnapshot] = useState<CreditsSnapshot | null>(null);
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>([]);
  const [quotes, setQuotes] = useState<CreditQuote[]>([]);
  const [receipts, setReceipts] = useState<CreditReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextSnapshot, nextLedger, nextQuotes, nextReceipts] = await Promise.all([
        powerChainApi.getCredits(),
        powerChainApi.getCreditLedger(),
        powerChainApi.getCreditQuotes(),
        powerChainApi.getCreditReceipts(),
      ]);
      setSnapshot(nextSnapshot);
      setLedger(nextLedger);
      setQuotes(nextQuotes);
      setReceipts(nextReceipts);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load PWRC credits.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);
  return { snapshot, ledger, quotes, receipts, loading, error, refresh } as const;
}
