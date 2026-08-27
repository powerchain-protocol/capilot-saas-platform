"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/utils";

export function ThemeAppIcon({ size = 52, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-[22%]", className)} style={{ width: size, height: size }}>
      <Image src="/icons/app-icon-light.png" alt="PowerChain app icon" fill sizes={`${size}px`} className="object-cover [html[data-theme=dark]_&]:hidden" />
      <Image src="/icons/app-icon-dark.png" alt="PowerChain app icon" fill sizes={`${size}px`} className="hidden object-cover [html[data-theme=dark]_&]:block" />
    </span>
  );
}
