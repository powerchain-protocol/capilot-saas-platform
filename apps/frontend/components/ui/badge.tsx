import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex min-h-6 items-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 text-[10px] font-semibold text-[var(--ink-soft)]", className)} {...props} />;
}
