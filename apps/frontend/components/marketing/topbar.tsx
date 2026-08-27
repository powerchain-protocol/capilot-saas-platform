"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { topbarConfig } from "@/config/topbar";

export function Topbar() {
  const [visible, setVisible] = useState<boolean>(topbarConfig.enabled);

  useEffect(() => {
    if (!topbarConfig.enabled || !topbarConfig.dismissible) return;
    const dismissed = window.localStorage.getItem(`pc-topbar:${topbarConfig.id}`) === "dismissed";
    if (dismissed) setVisible(false);
  }, []);

  function dismiss() {
    setVisible(false);
    if (topbarConfig.dismissible) window.localStorage.setItem(`pc-topbar:${topbarConfig.id}`, "dismissed");
  }

  if (!visible) return null;

  return (
    <div className="relative border-b border-[var(--border)] bg-[#F4F6F4] px-12">
      <div className="mx-auto flex min-h-9 max-w-5xl items-center justify-center gap-2 text-center text-[10px] font-semibold text-[#5D6961] sm:text-[11px]">
        <span className="rounded-full border border-[#D7E3DA] bg-white px-2 py-0.5 text-[8px] font-extrabold tracking-[.12em] text-[var(--green)]">{topbarConfig.badge}</span>
        <span className="truncate sm:whitespace-normal">{topbarConfig.message}</span>
        <Link href={topbarConfig.href} className="hidden items-center gap-1 font-bold text-[#143C2E] hover:underline sm:inline-flex">{topbarConfig.linkLabel}<ArrowRight className="size-3" /></Link>
      </div>
      {topbarConfig.dismissible ? <button type="button" onClick={dismiss} aria-label="Dismiss update" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[#8B948E] hover:bg-white hover:text-[#344139]"><X className="size-3.5" /></button> : null}
    </div>
  );
}
