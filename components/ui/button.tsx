import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Button({ href, children, variant = "primary", className, arrow = false }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string; arrow?: boolean }) {
  return (
    <Link href={href} className={cn(
      "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6B4B] focus-visible:ring-offset-2",
      variant === "primary" && "bg-[#143C2E] text-white shadow-[0_9px_24px_rgba(20,60,46,.18)] hover:-translate-y-px hover:bg-[#0E3024]",
      variant === "secondary" && "border border-[#C9D1CB] bg-white text-[#101513] hover:-translate-y-px hover:border-[#9EAAA2] hover:bg-[#F8FAF8]",
      variant === "ghost" && "text-[#314139] hover:bg-[#EEF3EF]",
      className
    )}>
      {children}{arrow && <ArrowRight className="size-4" />}
    </Link>
  );
}
