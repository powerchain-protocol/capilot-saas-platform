"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, Coins, LayoutDashboard, LogOut, Settings, ShieldCheck, Sun } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useToast } from "@/components/ui/toast";
import { powerChainApi } from "@/lib/powerchain";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const items = [
  [/^\/dashboard$/, "Overview", LayoutDashboard, "/dashboard"],
  [/\/copilot/, "Copilot", Bot, "/dashboard/copilot"],
  [/\/assets/, "Assets", Sun, "/dashboard/assets"],
  [/\/approvals/, "Approvals", ShieldCheck, "/dashboard/approvals"],
  [/\/credits/, "Credits", Coins, "/dashboard/credits"],
  [/\/settings/, "Settings", Settings, "/dashboard/settings"],
] as const;
const mobileItems = items.filter(([, label]) => label !== "Settings");

export function DashboardShell({ children, userName, workspaceName }: { children: React.ReactNode; userName: string; workspaceName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const current = items.find(([match]) => match.test(pathname));
  const initial = userName.trim().charAt(0).toUpperCase() || "P";

  async function signOut() {
    try {
      await powerChainApi.signOut();
    } catch {
      toast({ title: "Sign out failed", description: "Please try again.", tone: "error" });
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)]">
      <div className="grid min-h-screen lg:grid-cols-[252px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[var(--surface)] p-5 lg:flex lg:flex-col">
          <Logo compact priority />

          <div className="mt-8 rounded-2xl border border-[#E3E8E4] bg-[var(--canvas)] p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--forest)] text-xs font-bold text-white">{initial}</span>
              <div className="min-w-0"><p className="truncate text-xs font-bold">{workspaceName}</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[.12em] text-[#89918C]">SaaS workspace</p></div>
            </div>
          </div>

          <nav className="mt-6 space-y-1" aria-label="Workspace navigation">
            {items.map(([match, label, Icon, href]) => {
              const active = match.test(pathname);
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-[#EEF4F0] text-[#17613F]" : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[#26352C]"}`}>
                  <span className={`grid size-7 place-items-center rounded-lg transition ${active ? "bg-white shadow-sm" : "group-hover:bg-white"}`}><Icon className="size-4" /></span>{label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-3 px-1"><span className="grid size-8 place-items-center rounded-full bg-[#EDF3EF] text-[10px] font-bold text-[#17613F]">{initial}</span><div className="min-w-0"><p className="truncate text-xs font-bold">{userName}</p><p className="mt-0.5 text-[9px] text-[#87908A]">Workspace member</p></div></div>
            <button onClick={signOut} className="mt-3 flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--surface-soft)] hover:text-[#A13B38]"><LogOut className="size-4" />Sign out</button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 backdrop-blur-xl sm:px-6">
            <div className="lg:hidden"><Logo compact /></div>
            <div className="hidden min-w-0 lg:block"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#8A938D]">{workspaceName}</p><p className="truncate text-sm font-bold text-[var(--ink-soft)]">{current?.[1] ?? "Workspace"}</p></div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full border border-[#DDE8E0] bg-[#F2F8F4] px-3 py-1.5 text-[9px] font-bold text-[var(--success)] sm:inline-flex">● Systems operational</span>
              <ThemeToggle compact />
              <Link href="/dashboard/settings" aria-label="Open settings" className="grid size-9 place-items-center rounded-full border border-[#DDE4DF] bg-[var(--canvas)] text-[10px] font-bold text-[#17613F]">{initial}</Link>
            </div>
          </header>

          <div className="p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">{children}</div>

          <nav className="pc-safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2 pt-2 shadow-[0_-10px_35px_rgba(16,21,19,.06)] backdrop-blur-xl lg:hidden" aria-label="Mobile workspace navigation">
            {mobileItems.map(([match, label, Icon, href]) => {
              const active = match.test(pathname);
              return (
                <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`grid min-h-[54px] place-items-center rounded-xl py-1 text-[9px] font-semibold transition ${active ? "bg-[#EDF4EF] text-[#17613F]" : "text-[#6E7872] active:bg-[var(--surface-soft)]"}`}>
                  <Icon className="size-4" /><span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </section>
      </div>
    </main>
  );
}
