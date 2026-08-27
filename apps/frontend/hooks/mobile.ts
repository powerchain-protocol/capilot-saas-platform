"use client";

import { useMediaQuery } from "@/hooks/media-queries";
import { UI_RULES } from "@/config/rules";

export function useMobile(breakpoint = UI_RULES.mobileBreakpointPx): boolean {
  return useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
}
