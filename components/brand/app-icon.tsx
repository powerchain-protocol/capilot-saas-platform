import Image from "next/image";
import { cn } from "@/lib/cn";

export type AppIconVariant = "light" | "dark" | "green" | "dark-green";

const sources: Record<AppIconVariant, string> = {
  light: "/images/brand/app-icon-light.webp",
  dark: "/images/brand/app-icon-dark.webp",
  green: "/images/brand/app-icon-green.webp",
  "dark-green": "/images/brand/app-icon-dark-green.webp",
};

type AppIconProps = {
  variant?: AppIconVariant;
  className?: string;
  size?: number;
  priority?: boolean;
  alt?: string;
};

export function AppIcon({
  variant = "green",
  className,
  size = 64,
  priority = false,
  alt = "",
}: AppIconProps) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-[24%] ring-1 ring-black/[.06]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={alt ? undefined : "true"}
    >
      <Image
        src={sources[variant]}
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        quality={100}
        className="object-cover"
      />
    </span>
  );
}
