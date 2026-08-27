import { UI_RULES } from "@/config/rules";

export const breakpoints = {
  mobile: UI_RULES.mobileBreakpointPx,
  tablet: UI_RULES.tabletBreakpointPx,
} as const;

export function isLikelyMobileUserAgent(userAgent: string | null | undefined) {
  if (!userAgent) return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

export function recommendedPlatform(userAgent: string | null | undefined) {
  const ua = userAgent ?? "";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS" as const;
  if (/Android/i.test(ua)) return "Android" as const;
  if (/Windows/i.test(ua)) return "Windows" as const;
  if (/Macintosh|Mac OS X/i.test(ua)) return "macOS" as const;
  return "Web" as const;
}
