"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils/utils";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const close = (): void => onOpenChange(false);
    dialog.addEventListener("close", close);
    return () => dialog.removeEventListener("close", close);
  }, [onOpenChange]);

  return (
    <dialog ref={ref} className="m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100%-24px))] overflow-visible bg-transparent p-0 backdrop:bg-[#08110c]/45 backdrop:backdrop-blur-sm">
      <section className={cn("overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] shadow-[0_30px_100px_rgba(0,0,0,.28)]", className)}>
        <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
          <div><h2 className="text-lg font-semibold tracking-[-.03em]">{title}</h2>{description ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}</div>
          <button type="button" onClick={() => onOpenChange(false)} className="grid size-10 shrink-0 place-items-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]" aria-label="Close dialog"><X className="size-4" /></button>
        </header>
        <div className="max-h-[70dvh] overflow-y-auto p-5 sm:p-6">{children}</div>
      </section>
    </dialog>
  );
}
