import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("min-h-24 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted-2)] hover:border-[var(--border-strong)] focus:border-[var(--green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--green)_10%,transparent)] disabled:cursor-not-allowed disabled:opacity-60", className)} {...props} />;
});
