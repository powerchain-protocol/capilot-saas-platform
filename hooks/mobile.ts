"use client";

import { useEffect, useState } from "react";
import { UI_RULES } from "@/config/rules";

export function useMobile(breakpoint = UI_RULES.mobileBreakpointPx) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return mobile;
}
