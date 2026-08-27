import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FaGithub } from "react-icons/fa6";
import { Partnership } from "@/components/marketing/partnership";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ThemeAppIcon } from "@/components/brand/theme-app-icon";

const cols = {
  Product: [["Copilot", "/dashboard/copilot"], ["Command Center", "/dashboard"], ["Pricing", "/pricing"], ["Downloads", "/install"]],
  Solutions: [["Renewable Infrastructure", "/solutions"], ["Digital Energy", "/solutions"], ["Onchain Verification", "/solutions"], ["Approvals", "/dashboard/approvals"]],
  Resources: [["Documentation", "/docs"], ["Product", "/product"], ["FAQ", "/faq"], ["Status", "/status"]],
  Company: [["About", "/about"], ["Contact", "/contact"], ["Security", "/security"], ["Get Started", "/get-started"]],
  Legal: [["Privacy", "/legal/privacy"], ["Terms of Service", "/legal/terms"], ["Cookies", "/legal/cookies"], ["Disclaimer", "/legal/disclaimer"]]
} as const;

export function Footer() {
  return <>
    <Partnership />
    <footer className="border-t border-[var(--border)] bg-[var(--canvas)]">
      <div className="pc-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <div className="flex items-center gap-3"><Logo /><ThemeAppIcon size={38} className="hidden sm:inline-block" /></div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--muted)]">AI infrastructure for renewable operations, energy assets, and governed onchain workflows.</p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a href="https://github.com/powerchain-protocol/capilot-frontend" target="_blank" rel="noreferrer" aria-label="PowerChain Copilot on GitHub" className="grid size-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--forest)]"><FaGithub className="size-4" /></a>
              <Link href="/contact" className="inline-flex h-9 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--forest)]">Contact</Link>
              <ThemeToggle compact />
            </div>
          </div>
          {Object.entries(cols).map(([name, items]) => <div key={name}><b className="text-xs">{name}</b><div className="mt-4 space-y-3">{items.map(([label, href]) => <Link className="block text-xs text-[var(--muted)] hover:text-[var(--ink)]" key={label} href={href}>{label}</Link>)}</div></div>)}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-[11px] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 PowerChain. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2"><Link href="/legal/disclaimer" className="hover:text-[var(--forest)]">Product disclaimer</Link><Link href="/status" className="flex items-center gap-2 hover:text-[var(--forest)]"><span className="size-2 rounded-full bg-[#167A4A]" /> System operational</Link></div>
        </div>
      </div>
    </footer>
  </>;
}
