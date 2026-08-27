import Image from "next/image";
import { cn } from "@/lib/cn";

type PwrcIconProps = {
  className?: string;
  size?: number;
  priority?: boolean;
  framed?: boolean;
  alt?: string;
};

export function PwrcIcon({
  className,
  size = 32,
  priority = false,
  framed = false,
  alt = "",
}: PwrcIconProps) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full",
        framed && "ring-1 ring-black/10 shadow-[0_8px_24px_rgba(16,21,19,.14)]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={alt ? undefined : "true"}
    >
      <Image
        src="/images/tokens/pwrc-optimized.png"
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        quality={100}
        className="object-contain"
      />
    </span>
  );
}
