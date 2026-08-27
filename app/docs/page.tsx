import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const docs = [
  { t: "Quick start", d: "Create an account or open the seeded demo workspace.", h: "/get-started" },
  { t: "Product architecture", d: "Understand Copilot, assets, evidence, approvals, and execution boundaries.", h: "/product" },
  { t: "API v1 health", d: "Machine-readable service health and provider configuration state.", h: "/api/v1/health" },
  { t: "Install", d: "Platform-specific installation and beta-access instructions.", h: "/install" },
  { t: "Security", d: "Sessions, Remember me, workspace authorization, CORS, IP visibility, and fail-closed behavior.", h: "/security" },
  { t: "SaaS dashboard", d: "Authenticated workspace and operational application surfaces.", h: "/dashboard" },
];

export default function Page() {
  return <><Navbar /><main className="bg-[#F7F9F7] py-20"><div className="pc-shell"><p className="pc-kicker">Documentation</p><h1 className="mt-4 text-5xl font-bold tracking-[-.05em]">Build and operate with PowerChain.</h1><p className="mt-4 max-w-2xl text-[#66706A]">Canonical v1 application routes, setup, security, provider services, and deployment boundaries.</p><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{docs.map((item) => <Link key={item.t} href={item.h} className="pc-card p-6 transition hover:-translate-y-1 hover:border-[#AEBAB2]"><h2 className="font-bold">{item.t}</h2><p className="mt-2 text-sm leading-6 text-[#66706A]">{item.d}</p><span className="mt-5 inline-block text-xs font-bold text-[#1E6B4B]">Open →</span></Link>)}</div></div></main><Footer /></>;
}
