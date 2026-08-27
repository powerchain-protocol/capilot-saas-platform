import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Wind,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { PwrcIcon } from "@/components/brand/pwrc-icon";

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative w-[min(78vw,292px)] overflow-hidden rounded-[42px] border-[7px] border-[#171A18] bg-white shadow-[0_35px_80px_rgba(16,21,19,.18)] sm:w-[292px] ${className}`}>
      <div className="absolute left-1/2 top-2 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
      <div className="min-h-[588px] bg-[#FCFDFC] pt-10">{children}</div>
    </div>
  );
}

function PhoneNav({ active }: { active: string }) {
  const items = [
    ["Copilot", Bot],
    ["Command", LayoutDashboard],
    ["Assets", Sun],
    ["Alerts", AlertTriangle],
    ["Profile", UserRound],
  ] as const;
  return (
    <div className="absolute inset-x-0 bottom-0 grid grid-cols-5 border-t border-[var(--border)] bg-white/96 px-1 py-2 backdrop-blur">
      {items.map(([item, Icon]) => (
        <span key={item} className={`grid place-items-center gap-1 text-center text-[7px] font-semibold ${active === item ? "text-[var(--success)]" : "text-[#7A847E]"}`}>
          <Icon className="size-3.5" />{item}
        </span>
      ))}
    </div>
  );
}

export function PhoneMockups() {
  return (
    <div className="relative mx-auto flex h-[650px] w-full max-w-[740px] items-end justify-center overflow-visible sm:h-[675px]">
      <div className="pointer-events-none absolute bottom-2 left-1/2 h-16 w-[76%] -translate-x-1/2 rounded-[50%] bg-[#173B2D]/10 blur-2xl" />

      <Phone className="absolute bottom-7 left-[0%] hidden -rotate-[1.5deg] scale-[.82] lg:block xl:left-[1%] xl:scale-[.88]">
        <div className="px-4">
          <p className="text-[9px] font-semibold text-[#78817C]">Command Center</p>
          <div className="mt-1 flex items-center justify-between"><h3 className="text-lg font-bold tracking-[-.03em]">Operations</h3><span className="rounded-full bg-[#EEF7F1] px-2 py-1 text-[7px] font-bold text-[var(--success)]">LIVE</span></div>
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm">
            <span className="text-[9px] font-semibold text-[var(--green)]">Verified Energy</span>
            <div className="mt-2 flex items-end justify-between"><b className="text-xl">24,812 MWh</b><span className="text-[8px] font-bold text-[var(--success)]">▲ 12.4%</span></div>
            <div className="mt-4 flex h-20 items-end gap-1">
              {[28,43,35,52,49,67,58,72,61,82,64,71].map((value, index) => <span key={index} className="flex-1 rounded-t bg-[#DDEBE2]" style={{height:`${value}%`}} />)}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat title="Active Assets" value="128" icon={<Activity/>}/><Stat title="Treasury" value="$18.7M" icon={<CircleDollarSign/>}/><Stat title="Alerts" value="3" icon={<AlertTriangle/>}/><Stat title="Health" value="98%" icon={<CheckCircle2/>}/>
          </div>
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-white p-3"><p className="text-[8px] font-bold">Recent activity</p><p className="mt-2 text-[8px] text-[#69736D]">Wind Farm North · batch verified</p><p className="mt-1 text-[8px] text-[#69736D]">Settlement reconciled · 45m ago</p></div>
        </div>
        <PhoneNav active="Command" />
      </Phone>

      <Phone className="relative z-20">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-[var(--surface-soft)]"><LogoMark className="size-6" priority /></span>
              <div className="leading-none"><span className="block text-[11px] tracking-[-.025em]"><b>Power</b>Chain</span><span className="mt-1 block text-[6px] font-medium uppercase tracking-[.28em] text-[#A8AEAA]">Copilot</span></div>
            </div>
            <span className="rounded-full border border-[#DCE9E0] bg-[#EEF7F1] px-2 py-1 text-[7px] font-semibold text-[var(--success)]">Onchain-ready</span>
          </div>

          <div className="mt-7">
            <Sparkles className="size-6 text-[var(--success)]"/>
            <h3 className="mt-3 text-2xl font-bold tracking-[-.04em]">Hello, Alex.</h3>
            <p className="mt-2 text-[10px] leading-[17px] text-[#56615B]">I’m your AI copilot for renewable infrastructure and governed operations. How can I help today?</p>
          </div>

          <p className="mt-4 text-[9px] font-bold">Suggested actions</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Analyze performance","Review approvals","Summarize energy","Create report"].map((item) => <Link href="/dashboard/copilot" key={item} className="rounded-xl border border-[var(--border)] bg-white p-2.5 text-left text-[8px] font-semibold shadow-sm transition hover:border-[#BBC7BE] hover:bg-[var(--surface-soft)]">{item}</Link>)}
          </div>

          <div className="mt-4 rounded-2xl border border-[#DFE5E0] bg-white p-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--green-soft)]"><BarChart3 className="size-3 text-[var(--success)]"/></div>
              <div><p className="text-[9px] font-bold">Solar Farm 45 performance</p><p className="mt-1 text-[8px] leading-4 text-[var(--muted)]">24,812 MWh · 98% availability · no critical anomalies.</p></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <MiniMetric label="Capacity" value="120 MW"/><MiniMetric label="Variance" value="+12.4%"/><MiniMetric label="Evidence" value="Fresh"/>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F6F7F6] px-2.5 py-2"><span className="flex items-center gap-2 text-[7px] font-semibold text-[#5F6963]"><PwrcIcon size={18}/> PWRC credits</span><b className="text-[8px]">256,721</b></div>
          </div>

          <div className="absolute inset-x-4 bottom-14 flex h-11 items-center rounded-full border border-[var(--border)] bg-white px-3 shadow-[0_12px_32px_rgba(16,21,19,.12)]">
            <Search className="size-3.5 text-[#869089]"/><span className="ml-2 text-[8px] text-[#8B948E]">Ask anything…</span><span className="ml-auto grid size-7 place-items-center rounded-full bg-[#167A4A] text-white">↑</span>
          </div>
        </div>
        <PhoneNav active="Copilot" />
      </Phone>

      <Phone className="absolute bottom-7 right-[0%] hidden rotate-[1.5deg] scale-[.82] lg:block xl:right-[1%] xl:scale-[.88]">
        <div className="px-4">
          <p className="text-[9px] font-semibold text-[#78817C]">Assets</p>
          <h3 className="mt-1 text-xl font-bold tracking-[-.03em]">Solar Farm 45</h3>
          <div className="relative mt-4 h-28 overflow-hidden rounded-2xl bg-[linear-gradient(155deg,#dbe8e0,#95b6a3)] p-3"><div className="absolute inset-0 pc-grid-lines opacity-30"/><div className="relative mt-8 flex justify-end gap-2"><Sun className="size-8 text-white"/><Wind className="size-8 text-white"/></div></div>
          <div className="mt-3 flex items-center justify-between gap-2"><span className="text-[8px] text-[#647069]">Mojave, California · Solar</span><span className="rounded-full bg-[#EEF7F1] px-2 py-1 text-[7px] font-bold text-[var(--success)]">98% operational</span></div>
          <div className="mt-4 grid grid-cols-2 gap-2"><Stat title="Capacity" value="120 MW" icon={<Activity/>}/><Stat title="Generation" value="24.8 GWh" icon={<BarChart3/>}/></div>
          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white p-3"><div className="flex justify-between"><b className="text-[9px]">Evidence & provenance</b><ShieldCheck className="size-3 text-[var(--success)]"/></div>{["Oracle attestation","Meter readings","Weather context"].map(item => <div key={item} className="mt-3 flex items-center gap-2 text-[8px]"><CheckCircle2 className="size-3 text-[var(--success)]"/><span>{item}</span><span className="ml-auto text-[var(--success)]">Verified</span></div>)}</div>
          <Link href="/dashboard/assets" className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] text-[9px] font-bold text-white">Open asset <ChevronRight className="size-3"/></Link>
        </div>
        <PhoneNav active="Assets" />
      </Phone>
    </div>
  );
}

function Stat({title,value,icon}:{title:string;value:string;icon:React.ReactNode}) {
  return <div className="rounded-xl border border-[var(--border)] bg-white p-2.5"><div className="flex items-center gap-1 text-[var(--green)] [&_svg]:size-3"><span>{icon}</span><span className="text-[7px] font-semibold text-[#77817B]">{title}</span></div><b className="mt-1 block text-sm">{value}</b></div>;
}
function MiniMetric({label,value}:{label:string;value:string}) {
  return <div className="rounded-lg bg-[#F5F7F5] p-2"><span className="block text-[6px] text-[#8A938D]">{label}</span><b className="mt-1 block text-[8px]">{value}</b></div>;
}
