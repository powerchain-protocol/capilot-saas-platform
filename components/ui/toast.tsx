"use client";

import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastTone = "success" | "error" | "info";
export type ToastInput = { title: string; description?: string; tone?: ToastTone; duration?: number };
type ToastItem = ToastInput & { id: number };

type ToastContextValue = {
  toast: (input: ToastInput) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const item: ToastItem = { ...input, id, tone: input.tone ?? "info" };
    setItems((current) => [...current.slice(-2), item]);
    window.setTimeout(() => dismiss(id), input.duration ?? 4200);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-3 top-20 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto sm:w-[390px]"
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => <ToastCard key={item.id} item={item} dismiss={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, dismiss }: { item: ToastItem; dismiss: (id: number) => void }) {
  const Icon = item.tone === "success" ? CheckCircle2 : item.tone === "error" ? CircleAlert : Info;
  return (
    <div role={item.tone === "error" ? "alert" : "status"} className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-[#D9DEDA] bg-white p-4 shadow-[0_22px_70px_rgba(16,21,19,.16)]">
      <Icon className={`mt-0.5 size-5 shrink-0 ${item.tone === "error" ? "text-[#C43D3D]" : "text-[#167A4A]"}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#101513]">{item.title}</p>
        {item.description ? <p className="mt-1 text-xs leading-5 text-[#66706A]">{item.description}</p> : null}
      </div>
      <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(item.id)} className="grid size-8 shrink-0 place-items-center rounded-lg text-[#66706A] transition hover:bg-[#F0F3F0] hover:text-[#101513]">
        <X className="size-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
