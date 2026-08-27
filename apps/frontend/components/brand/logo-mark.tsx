import Image from "next/image";
import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  variant?: "dark" | "light";
  priority?: boolean;
  alt?: string;
};

export function LogoMark({
  className,
  variant = "dark",
  priority = false,
  alt = "",
}: LogoMarkProps) {
  const src =
    variant === "light"
      ? "/images/brand/powerchain-mark-light-optimized.png"
      : "/images/brand/powerchain-mark-dark-optimized.png";

  return (
    <span
      className={cn("relative inline-block size-10 shrink-0", className)}
      aria-hidden={alt ? undefined : "true"}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="64px"
        priority={priority}
        quality={100}
        className="object-contain"
      />
    </span>
  );
}
