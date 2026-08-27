"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type RuntimeContextValue = {
  isSecureContext: boolean;
  isStandalone: boolean;
};

const RuntimeContext = createContext<RuntimeContextValue>({
  isSecureContext: false,
  isStandalone: false,
});

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const value = useMemo<RuntimeContextValue>(() => {
    if (typeof window === "undefined") return { isSecureContext: false, isStandalone: false };
    const standalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
    return { isSecureContext: window.isSecureContext, isStandalone: standalone };
  }, []);

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

export function useRuntimeContext(): RuntimeContextValue {
  return useContext(RuntimeContext);
}
