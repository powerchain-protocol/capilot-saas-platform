import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { env, hasManagedAi, hasSecureSessionSecret, hasSupabase } from "@/lib/server/env";
import { isPythConfigured } from "@/lib/pyth";
import { isBirdeyeConfigured } from "@/lib/birdeye";
import { isHeliusConfigured } from "@/lib/helius";

export const dynamic = "force-dynamic";

export default function Page() {
  const productionReady = !env.production || (hasSupabase && hasSecureSessionSecret);
  const rows = [
    ["Frontend", "Operational"],
    ["Authentication", hasSecureSessionSecret ? "Configured" : "Development-only secret"],
    ["Data adapter", hasSupabase ? "Supabase" : env.production ? "Missing production database" : "Local development store"],
    ["Copilot adapter", hasManagedAi ? `Managed · ${env.openAiModel}` : "Deterministic demo"],
    ["Pyth", isPythConfigured() ? "Configured" : "Optional · not configured"],
    ["Birdeye", isBirdeyeConfigured() ? "Configured" : "Optional · not configured"],
    ["Helius", isHeliusConfigured() ? "Configured" : "Optional · not configured"],
    ["Solana RPC", process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC_URL ? "Configured" : env.production ? "Missing production RPC" : "Devnet fallback"],
  ];
  return <><Navbar /><main className="bg-[#F7F9F7] py-20"><div className="pc-shell max-w-4xl"><p className="pc-kicker">Status</p><h1 className="mt-4 text-5xl font-bold tracking-[-.05em]">System status</h1><p className="mt-4 text-sm leading-6 text-[#66706A]">Configuration posture only. External provider availability is checked on demand through authenticated v1 service routes.</p><div className="pc-card mt-8 overflow-hidden"><div className="flex items-center gap-3 border-b border-[#E1E6E2] bg-[#F3F8F5] p-5"><span className={`size-3 rounded-full ${productionReady ? "bg-[#167A4A]" : "bg-[#B7791F]"}`} /><b className="text-sm">{productionReady ? "Application operational" : "Configuration required"}</b></div>{rows.map(([a, b]) => <div key={a} className="flex items-center justify-between gap-4 border-b border-[#EDF0EE] px-5 py-4 last:border-0"><span className="text-sm font-semibold">{a}</span><span className="text-right text-xs text-[#617069]">{b}</span></div>)}</div></div></main><Footer /></>;
}
