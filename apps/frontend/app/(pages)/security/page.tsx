import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Database, GlobeLock, KeyRound, Network, ShieldCheck, UserCheck } from "lucide-react";

const items = [
  ["Session security", "Signed HttpOnly cookies, 12-hour standard sessions, and explicit 30-day Remember me sessions.", KeyRound],
  ["Password storage", "Node scrypt hashing with per-password random salts; raw passwords are never persisted.", ShieldCheck],
  ["Workspace isolation", "Authenticated reads and mutations are scoped to the signed session workspace.", Database],
  ["Approval authorization", "Only owner, admin, and operator roles can mutate policy-gated approvals.", UserCheck],
  ["CORS boundary", "Same-origin by default; only configured exact origins may access CORS-enabled v1 infrastructure routes.", GlobeLock],
  ["Provider isolation", "Pyth, Birdeye, Helius, Solana RPC, database, and AI provider secrets remain server-side.", Network],
] as const;

export default function Page() {
  return <><Navbar /><main className="bg-white py-24"><div className="pc-shell"><p className="pc-kicker">Security</p><h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-[-.05em]">Governed by default.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">PowerChain separates identity, workspace authorization, Copilot analysis, approval, external providers, and execution boundaries. Current-session IP visibility is masked by default and raw IP addresses are not persisted by the reference application database.</p><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map(([title, description, Icon]) => <div key={title} className="pc-card p-6"><Icon className="size-6 text-[var(--green)]" /><h2 className="mt-5 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p></div>)}</div></div></main><Footer /></>;
}
