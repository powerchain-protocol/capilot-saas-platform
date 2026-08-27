"use client";

import { createContext, useContext } from "react";
import type { SessionContext } from "@/lib/powerchain";

const SessionContextValue = createContext<SessionContext | null>(null);

export function SessionProvider({ value, children }: { value: SessionContext; children: React.ReactNode }) {
  return <SessionContextValue.Provider value={value}>{children}</SessionContextValue.Provider>;
}

export function useSessionContext(): SessionContext {
  const value = useContext(SessionContextValue);
  if (!value) throw new Error("useSessionContext must be used inside SessionProvider");
  return value;
}
