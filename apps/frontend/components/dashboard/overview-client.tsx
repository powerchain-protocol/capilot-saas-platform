"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Bot, Leaf, ShieldCheck, Sun, Wind, Zap } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { apiRoutes } from "@/config/api";

type Asset = { id: string; name: string; type: string; location: string; capacityMw: number; availability: number; status: string; verified?: boolean };
type Approval = { id: string; title: string; description: string; severity: string; status: string };
type ActivityItem = { id: string; title: string; detail: string; createdAt: string };
type DashboardData = {
  user: { name: string; email: string };
  workspace: { name: string; plan: string };
  metrics: { assets: number; capacityMw: number; availability: number; verifiedAssets: number; pendingApprovals: number; pwrcAvailable: string };
  assets: Asset[];
  approvals: Approval[];
  activities: ActivityItem[];
};

export function OverviewClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiRoutes.dashboard)
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error?.message || "Failed to load");
        setData(json.data);
      })
      .catch((reason) => setError(reason.message));
  }, []);

  if (error) return <State title="Dashboard unavailable" copy={error} />;
  if (!data) return <OverviewSkeleton />;
  const metrics = data.metrics;

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--green)]">Command Center</p><h1 className="mt-2 text-3xl font-bold tracking-[-.04em] sm:text-4xl">Good morning, {data.user.name.split(" ")[0]}.</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Current operational state from your authenticated PowerChain workspace.</p></div>
        <Link href="/dashboard/copilot" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-sm font-bold text-white shadow-[0_10px_26px_rgba(20,60,46,.14)] transition hover:bg-[var(--forest-strong)]"><Bot className="size-4" />Ask Copilot</Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Assets" value={metrics.assets} icon={<Sun />} meta="Connected" />
        <Metric label="Capacity" value={`${metrics.capacityMw} MW`} icon={<Leaf />} meta="Portfolio" />
        <Metric label="Availability" value={`${metrics.availability}%`} icon={<Activity />} meta="Current" />
        <Metric label="Verified" value={metrics.verifiedAssets} icon={<ShieldCheck />} meta="Evidence" />
        <Metric label="Approvals" value={metrics.pendingApprovals} icon={<AlertTriangle />} meta="Pending" warning={metrics.pendingApprovals > 0} />
        <Metric label="PWRC" value={metrics.pwrcAvailable} icon={<PwrcIcon size={19} />} meta="Available" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
        <section className="pc-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EDF0EE] px-5 py-4"><div><h2 className="text-sm font-bold">Operational assets</h2><p className="mt-1 text-[10px] text-[var(--muted-2)]">Health, availability and capacity</p></div><Link href="/dashboard/assets" className="text-xs font-semibold text-[var(--green)] hover:underline">View all →</Link></div>
          <div className="divide-y divide-[#EDF0EE] px-4 sm:px-5">{data.assets.map((asset) => <AssetRow key={asset.id} asset={asset} />)}</div>
        </section>

        <section className="pc-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#EDF0EE] px-5 py-4"><div><h2 className="text-sm font-bold">Approval Center</h2><p className="mt-1 text-[10px] text-[var(--muted-2)]">Actions requiring review</p></div><Link href="/dashboard/approvals" className="text-xs font-semibold text-[var(--green)] hover:underline">Review →</Link></div>
          <div className="space-y-3 p-4 sm:p-5">{data.approvals.length ? data.approvals.map((approval) => <div key={approval.id} className="rounded-xl border border-[var(--border)] bg-[#FCFDFC] p-3"><div className="flex items-start justify-between gap-2"><b className="text-xs leading-5">{approval.title}</b><span className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-bold ${approval.severity === "high" ? "bg-[#FFF0EF] text-[#B43B36]" : "bg-[#FFF5E8] text-[#9D6419]"}`}>{approval.severity}</span></div><p className="mt-2 text-[10px] leading-4 text-[var(--muted)]">{approval.description}</p></div>) : <p className="py-8 text-center text-xs text-[var(--muted-2)]">No approvals pending.</p>}</div>
        </section>
      </div>

      <section className="pc-card mt-4 overflow-hidden">
        <div className="border-b border-[#EDF0EE] px-5 py-4"><h2 className="text-sm font-bold">Recent activity</h2><p className="mt-1 text-[10px] text-[var(--muted-2)]">Workspace events and operational evidence</p></div>
        <div className="divide-y divide-[#EDF0EE] px-5">{data.activities.map((item) => <div key={item.id} className="flex items-center gap-3 py-3.5"><span className="size-2 rounded-full bg-[#167A4A]" /><div className="min-w-0 flex-1"><b className="block truncate text-xs">{item.title}</b><span className="mt-0.5 block truncate text-[10px] text-[var(--muted-2)]">{item.detail}</span></div><span className="shrink-0 text-[9px] text-[#929A95]">{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>)}</div>
      </section>
    </div>
  );
}

function AssetRow({ asset }: { asset: Asset }) {
  const Icon = asset.type === "wind" ? Wind : asset.type === "storage" ? Zap : Sun;
  return <div className="flex items-center gap-3 py-3.5"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EDF4EF] text-[var(--green)]"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><b className="block truncate text-xs">{asset.name}</b><span className="mt-0.5 block truncate text-[10px] text-[var(--muted-2)]">{asset.location} · {asset.capacityMw} MW</span></div><div className="text-right"><b className={`block text-[10px] ${asset.status === "operational" ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>{asset.availability}%</b><span className="mt-0.5 block text-[8px] capitalize text-[#89918C]">{asset.status}</span></div></div>;
}

function Metric({ label, value, icon, meta, warning = false }: { label: string; value: React.ReactNode; icon: React.ReactNode; meta: string; warning?: boolean }) {
  return <div className="pc-card p-4 transition hover:border-[#C2CCC5]"><div className="flex items-center justify-between"><span className="grid size-8 place-items-center rounded-xl bg-[#F1F6F3] text-[var(--green)] [&>svg]:size-4">{icon}</span>{warning ? <span className="size-2 rounded-full bg-[#C7862D]" /> : null}</div><span className="mt-3 block text-[9px] font-semibold uppercase tracking-[.08em] text-[var(--muted-2)]">{label}</span><b className="mt-1 block text-lg tracking-[-.02em]">{value}</b><span className="mt-1 block text-[8px] text-[#939B96]">{meta}</span></div>;
}

function State({ title, copy }: { title: string; copy: string }) { return <div className="pc-card p-8"><h1 className="text-xl font-bold">{title}</h1><p className="mt-2 text-sm text-[var(--muted)]">{copy}</p></div>; }
function OverviewSkeleton() { return <div className="mx-auto max-w-[1400px]" aria-hidden="true"><div className="pc-skeleton h-4 w-32 rounded"/><div className="pc-skeleton mt-3 h-10 w-80 max-w-full rounded-xl"/><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{Array.from({length:6}).map((_,i)=><div key={i} className="pc-skeleton h-28 rounded-[20px]"/>)}</div><div className="mt-4 grid gap-4 xl:grid-cols-2"><div className="pc-skeleton h-80 rounded-[20px]"/><div className="pc-skeleton h-80 rounded-[20px]"/></div></div>; }
