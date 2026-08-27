import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("pc-skeleton rounded-xl", className)} {...props} />;
}
