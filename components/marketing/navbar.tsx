"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Topbar } from "@/components/marketing/topbar";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E3E7E4]/80 bg-white/92 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <Topbar />
      <div className="pc-shell flex h-[72px] items-center justify-between gap-4">
        <Logo size="default" priority />

        <nav className="hidden items-center gap-1 rounded-2xl border border-[#E7EAE8] bg-[#FAFBFA] p-1 lg:flex" aria-label="Primary navigation">
          {siteConfig.nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                className={`rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${active ? "bg-white text-[#143C2E] shadow-sm" : "text-[#5D6961] hover:bg-white hover:text-[#101513]"}`}
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" href={siteConfig.routes.signIn}>Sign in</Button>
          <Button href={siteConfig.routes.getStarted}>Get Started</Button>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-[#D9DEDA] bg-white text-[#243129] shadow-sm transition hover:border-[#BCC6BF] hover:bg-[#F7F9F7] lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <>
          <button aria-label="Close navigation" type="button" className="fixed inset-0 z-[-1] bg-[#101513]/18 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />
          <div id="mobile-navigation" className="border-t border-[#E3E7E4] bg-white shadow-[0_24px_60px_rgba(16,21,19,.12)] lg:hidden">
            <div className="pc-shell grid gap-1 py-4">
              {siteConfig.nav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    className={`flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold transition ${active ? "bg-[#EDF4EF] text-[#17613F]" : "text-[#344139] hover:bg-[#F5F7F5]"}`}
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#EDF0EE] pt-4">
                <Button variant="secondary" href={siteConfig.routes.signIn}>Sign in</Button>
                <Button href={siteConfig.routes.getStarted}>Get Started</Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
