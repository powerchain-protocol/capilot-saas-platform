import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type CTAProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  icon?: boolean;
};

export function CTA({ href, label, variant = "primary", className, icon = true }: CTAProps) {
  return (
    <Link href={href} className={cn(
      "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2",
      variant === "primary" && "bg-[var(--forest)] text-white shadow-[0_9px_24px_rgba(20,60,46,.18)] hover:-translate-y-px hover:bg-[var(--forest-strong)]",
      variant === "secondary" && "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] hover:-translate-y-px hover:bg-[var(--surface-soft)]",
      variant === "quiet" && "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)]",
      className
    )}>
      {label}{icon ? <ArrowRight className="size-4" /> : null}
    </Link>
  );
}
