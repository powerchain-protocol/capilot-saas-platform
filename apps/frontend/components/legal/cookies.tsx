"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Cookie, X } from "lucide-react";

const COOKIE_NAME = "pc_cookie_notice";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function hasAcknowledgedCookies() {
  if (typeof document === "undefined") return true;
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith(`${COOKIE_NAME}=`));
}

export function CookieNotice() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasAcknowledgedCookies());
  }, []);

  function acknowledge() {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=essential; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
    setVisible(false);
  }

  if (!visible) return null;

  const placement = pathname.startsWith("/dashboard")
    ? "bottom-24 lg:bottom-5"
    : "bottom-3 sm:bottom-5";

  return (
    <aside
      aria-label="Cookie notice"
      className={`fixed inset-x-3 z-[80] mx-auto max-w-2xl rounded-2xl border border-[#DCE3DE] bg-white/96 p-4 shadow-[0_24px_70px_rgba(16,21,19,.18)] backdrop-blur-xl sm:p-5 ${placement}`}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EDF3EF] text-[#17613F]">
          <Cookie className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#172019]">Essential cookies only</p>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            PowerChain uses a secure session cookie for sign-in and a small preference cookie to remember this notice. Optional advertising cookies are not enabled in this reference app.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={acknowledge}
              className="inline-flex min-h-10 items-center rounded-xl bg-[var(--forest)] px-4 text-xs font-bold text-white hover:bg-[var(--forest-strong)]"
            >
              Continue with essentials
            </button>
            <Link
              href="/legal/cookies"
              className="inline-flex min-h-10 items-center rounded-xl px-3 text-xs font-semibold text-[#17613F] hover:bg-[#F3F7F4]"
            >
              Cookie policy
            </Link>
          </div>
        </div>

        <button
          type="button"
          aria-label="Dismiss cookie notice"
          onClick={acknowledge}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-[#7D8781] hover:bg-[#F3F5F3]"
        >
          <X className="size-4" />
        </button>
      </div>
    </aside>
  );
}
