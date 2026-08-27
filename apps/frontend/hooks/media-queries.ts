"use client";

import { useEffect, useState } from "react";

export const MEDIA_QUERIES = {
  mobile: "(max-width: 639px)",
  tablet: "(min-width: 640px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  darkScheme: "(prefers-color-scheme: dark)"
} as const;

export type MediaQueryName = keyof typeof MEDIA_QUERIES;

export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = (): void => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useNamedMediaQuery(name: MediaQueryName): boolean {
  return useMediaQuery(MEDIA_QUERIES[name]);
}
