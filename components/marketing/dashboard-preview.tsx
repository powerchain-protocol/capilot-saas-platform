import {
  Activity,
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  Leaf,
  ShieldCheck,
  Sun,
  WalletCards,
  Wind,
} from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { Logo } from "@/components/brand/logo";

const metrics = [
  { label: "Verified Energy", value: "24,812 MWh", meta: "+12.4%", icon: <Leaf className="size-4" /> },
  { label: "Active Assets", value: "128", meta: "6 countries", icon: <Activity className="size-4" /> },
  { label: "Availability", value: "98.0%", meta: "Operational", icon: <ShieldCheck className="size-4" /> },
  { label: "Treasury", value: "$18.7M", meta: "Onchain settled", icon: <CircleDollarSign className="size-4" /> },
  { label: "PWRC Credits", value: "256,721", meta: "Available", icon: <PwrcIcon size={18} /> },
  { label: "Alerts", value: "3", meta: "2 high priority", icon: <AlertTriangle className="size-4" /> },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="bg-[#F7F9F7] py-24">
      <div className="pc-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="pc-kicker">Command Center</p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-.045em] sm:text-5xl">Your infrastructure. One operational view.</h2>
          <p className="mt-4 text-base leading-7 text-[#66706A]">Portfolio-level intelligence with evidence freshness, asset health, treasury context, and actionable exceptions.</p>
        </div>

        <div className="pc-card mt-12 overflow-hidden">
          <div className="grid min-h-[610px] lg:grid-cols-[190px_1fr]">
            <aside className="hidden border-r border-[#E1E6E2] bg-[#FBFCFB] p-4 lg:block">
              <Logo size="compact" priority />
              <div className="mt-7 space-y-1">
                {[["Overview",LayoutDashboard],["Assets",Sun],["Energy",Wind],["Treasury",WalletCards],["Reports",BarChart3]].map(([x,I])=><div key={String(x)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${x==="Overview"?"bg-[#EDF3EF] text-[#17613F]":"text-[#66706A]"}`}><I className="size-4"/>{x}</div>)}
              </div>
            </aside>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-sm font-bold">Overview</p><p className="mt-1 text-xs text-[#7C8680]">Real-time intelligence across renewable infrastructure</p></div>
                <span className="rounded-full bg-[#EFF7F1] px-3 py-1 text-[10px] font-bold text-[#167A4A]">● Production · 12s ago</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {metrics.map((item)=><div key={item.label} className="rounded-2xl border border-[#E1E6E2] bg-white p-4"><div className="flex items-center gap-2 text-[#1E6B4B]"><span className="grid size-5 place-items-center">{item.icon}</span><span className="text-[10px] font-semibold text-[#6A756F]">{item.label}</span></div><b className="mt-3 block text-xl tracking-[-.03em]">{item.value}</b><span className="mt-1 block text-[10px] text-[#167A4A]">{item.meta}</span></div>)}
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_.85fr]">
                <div className="rounded-2xl border border-[#E1E6E2] bg-white p-5">
                  <div className="flex justify-between"><div><p className="text-xs font-semibold">Energy Generation</p><b className="mt-1 block text-xl">24,812 MWh</b></div><span className="text-[10px] text-[#167A4A]">▲ 12.4%</span></div>
                  <div className="mt-6 flex h-48 items-end gap-2">{[35,48,42,56,51,63,59,78,67,91,61,70,74,82,77,89].map((x,i)=><div key={i} className="flex-1 rounded-t-md bg-[linear-gradient(to_top,#CDE2D5,#2C805B)]" style={{height:`${x}%`}}/>)}</div>
                  <div className="mt-3 flex justify-between text-[9px] text-[#8A938E]"><span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 29</span></div>
                </div>

                <div className="rounded-2xl border border-[#E1E6E2] bg-white p-5">
                  <p className="text-xs font-semibold">Asset Health</p>
                  <div className="mt-4 space-y-4">{[["Solar Farm 45","98%",Sun],["Wind Farm North","96%",Wind],["Battery Site 08","94%",Activity]].map(([name,pct,I])=><div key={String(name)}><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-[#F0F5F2] text-[#1E6B4B]"><I className="size-4"/></span><div className="flex-1"><div className="flex justify-between text-[10px] font-semibold"><span>{name}</span><span>{pct}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EDF0EE]"><div className="h-full rounded-full bg-[#167A4A]" style={{width:String(pct)}}/></div></div></div></div>)}</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E1E6E2] bg-white p-5">
                <div className="flex items-center justify-between"><p className="text-xs font-semibold">Recent Operational Activity</p><span className="text-[10px] text-[#1E6B4B]">View all</span></div>
                <div className="mt-3 divide-y divide-[#EDF0EE]">{[["Wind Farm North · Energy batch verified","1,250 MWh","12m"],["Settlement executed","$2.45M USDC","45m"],["Solar Farm 45 · Review completed","Evidence verified","1h"]].map(([a,b,c])=><div key={a} className="flex items-center gap-3 py-3 text-[10px]"><CheckIcon/><div className="min-w-0 flex-1"><b className="block truncate">{a}</b><span className="text-[#7B8580]">{b}</span></div><span className="text-[#8A938E]">{c}</span></div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(){return <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#EDF6F0] text-[#167A4A]">✓</span>}
