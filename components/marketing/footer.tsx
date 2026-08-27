import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { FaGithub } from "react-icons/fa6";
import { Partnership } from "@/components/marketing/partnership";

const cols = {
  Product: [["Copilot", "/dashboard/copilot"], ["Command Center", "/dashboard"], ["Pricing", "/pricing"], ["Downloads", "/install"]],
  Solutions: [["Renewable Infrastructure", "/solutions"], ["Digital Energy", "/solutions"], ["Onchain Verification", "/solutions"], ["Approvals", "/dashboard/approvals"]],
  Resources: [["Documentation", "/docs"], ["Product", "/product"], ["FAQ", "/faq"], ["Status", "/status"]],
  Company: [["About", "/about"], ["Contact", "/contact"], ["Security", "/security"], ["Get Started", "/get-started"]],
  Legal: [["Privacy", "/legal/privacy"], ["Terms of Service", "/legal/terms"], ["Cookies", "/legal/cookies"], ["Disclaimer", "/legal/disclaimer"]],
} as const;

export function Footer() {
  return <>
    <Partnership />
    <footer className="border-t border-[#DEE4DF] bg-[#F7F9F7]">
      <div className="pc-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#66706A]">AI infrastructure for renewable operations, energy assets, and governed onchain workflows.</p>
            <div className="mt-6 flex gap-2">
              <a href="https://github.com/powerchain-protocol/capilot-frontend" target="_blank" rel="noreferrer" aria-label="PowerChain Copilot on GitHub" className="grid size-9 place-items-center rounded-xl border border-[#D7DED9] bg-white text-[#9AA39D] hover:text-[#143C2E]"><FaGithub className="size-4" /></a>
              <Link href="/contact" className="inline-flex h-9 items-center rounded-xl border border-[#D7DED9] bg-white px-3 text-[11px] font-semibold text-[#66716A] hover:text-[#143C2E]">Contact</Link>
            </div>
          </div>
          {Object.entries(cols).map(([name, items]) => <div key={name}><b className="text-xs">{name}</b><div className="mt-4 space-y-3">{items.map(([label, href]) => <Link className="block text-xs text-[#6B766F] hover:text-[#101513]" key={label} href={href}>{label}</Link>)}</div></div>)}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-[#DEE4DF] pt-6 text-[11px] text-[#78827C] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 PowerChain. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2"><Link href="/legal/disclaimer" className="hover:text-[#143C2E]">Product disclaimer</Link><Link href="/status" className="flex items-center gap-2 hover:text-[#143C2E]"><span className="size-2 rounded-full bg-[#167A4A]" /> System operational</Link></div>
        </div>
      </div>
    </footer>
  </>;
}
