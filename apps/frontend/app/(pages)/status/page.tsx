import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { StatusClient } from "@/components/status/status-client";

export const dynamic = "force-dynamic";

export default function StatusPage() {
  return <><Navbar /><main className="bg-[var(--canvas)] py-20"><div className="pc-shell max-w-4xl"><p className="pc-kicker">Status</p><h1 className="mt-4 text-5xl font-bold tracking-[-.05em]">System status</h1><p className="mt-4 text-sm leading-6 text-[var(--muted)]">Live configuration posture from the canonical PowerChain API v1 health endpoint.</p><StatusClient /></div></main><Footer /></>;
}
