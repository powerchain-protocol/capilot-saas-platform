import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { cn } from "@/lib/cn";

type LogoSize = "compact" | "default" | "large";

type LogoProps = {
  size?: LogoSize;
  compact?: boolean;
  href?: string;
  className?: string;
  variant?: "dark" | "light";
  showProduct?: boolean;
  priority?: boolean;
  linked?: boolean;
};

const sizeMap: Record<LogoSize, { mark: string; word: string; product: string; gap: string }> = {
  compact: { mark: "size-[32px]", word: "text-[18px]", product: "text-[6px]", gap: "gap-2" },
  default: { mark: "size-[40px]", word: "text-[23px]", product: "text-[7px]", gap: "gap-2.5" },
  large: { mark: "size-[54px]", word: "text-[31px]", product: "text-[9px]", gap: "gap-3" },
};

export function Logo({
  size,
  compact = false,
  href = "/",
  className,
  variant = "dark",
  showProduct = true,
  priority = false,
  linked = true,
}: LogoProps) {
  const resolvedSize: LogoSize = size ?? (compact ? "compact" : "default");
  const s = sizeMap[resolvedSize];
  const wordmark = variant === "light" ? "text-white" : "text-[#101513]";

  const content = (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <LogoMark variant={variant} priority={priority} className={s.mark} />

      <span className="flex min-w-0 flex-col items-start">
        <span
          className={cn(
            "whitespace-nowrap leading-[.88] tracking-[-0.052em]",
            wordmark,
            s.word,
          )}
          aria-label="PowerChain"
        >
          <span className="font-[650]">Power</span>
          <span className="font-[400]">Chain</span>
        </span>

        {showProduct && (
          <span
            className={cn(
              "mt-[5px] whitespace-nowrap pl-[.03em] font-[500] uppercase tracking-[0.36em] text-[#A8AEAA]",
              s.product,
            )}
          >
            Copilot
          </span>
        )}
      </span>
    </span>
  );

  if (!linked) return content;

  return (
    <Link href={href} aria-label="PowerChain Copilot home" className="inline-flex shrink-0">
      {content}
    </Link>
  );
}
