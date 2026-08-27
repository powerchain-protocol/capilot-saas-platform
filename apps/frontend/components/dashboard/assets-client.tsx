"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, ShieldCheck, Sun, Wind, Zap } from "lucide-react";
import { apiRoutes } from "@/config/api";

type Asset = {
  id: string;
  name: string;
  location: string;
  type: string;
  capacityMw: number;
  availability: number;
  status: string;
  verified?: boolean;
};

const filters = ["all", "solar", "wind", "storage"] as const;

export function AssetsClient() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiRoutes.assets)
      .then((response) => response.json())
      .then((json) => json.ok ? setAssets(json.data) : setError(json.error.message))
      .catch(() => setError("Unable to load assets."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => assets.filter((asset) => {
    const matchesFilter = filter === "all" || asset.type.toLowerCase() === filter;
    const haystack = `${asset.name} ${asset.location} ${asset.type}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [assets, filter, query]);

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--green)]">Asset registry</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-.04em] sm:text-4xl">Operational assets</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Workspace-scoped renewable and connected infrastructure with health and verification state.</p>
        </div>
        <div className="flex min-h-12 w-full items-center rounded-xl border border-[#D5DDD7] bg-white px-3 shadow-sm transition focus-within:border-[var(--green)] focus-within:shadow-[0_0_0_4px_rgba(30,107,75,.06)] xl:w-[310px]">
          <Search className="size-4 shrink-0 text-[var(--muted-2)]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="ml-2 min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search assets" aria-label="Search assets" />
          {query ? <button type="button" onClick={() => setQuery("")} className="rounded-lg px-2 py-1 text-[10px] font-bold text-[var(--muted)] hover:bg-[var(--surface-soft)]">Clear</button> : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Asset filters">
          {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-10 shrink-0 rounded-xl px-4 text-xs font-bold capitalize transition ${filter === item ? "bg-[var(--forest)] text-white" : "bg-[#F5F7F5] text-[var(--muted)] hover:bg-[#EDF2EE]"}`}>{item}</button>)}
        </div>
        <span className="px-1 text-[10px] font-semibold text-[#7E8782]">{loading ? "Loading…" : `${filtered.length} of ${assets.length} assets`}</span>
      </div>

      {error ? <p role="alert" className="mt-5 rounded-xl border border-[#F0D5D3] bg-[#FFF3F2] p-3 text-xs text-[#A73535]">{error}</p> : null}

      {loading ? <AssetSkeleton /> : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
        </div>
      )}

      {!loading && filtered.length === 0 && !error ? (
        <div className="pc-card mt-6 p-10 text-center"><Search className="mx-auto size-6 text-[#94A099]" /><h2 className="mt-3 text-sm font-bold">No matching assets</h2><p className="mt-1 text-xs text-[var(--muted)]">Try another search term or asset type.</p><button type="button" onClick={() => { setQuery(""); setFilter("all"); }} className="mt-4 rounded-xl border border-[#D2DAD4] bg-white px-4 py-2 text-xs font-bold text-[#143C2E] hover:bg-[var(--canvas)]">Reset filters</button></div>
      ) : null}
    </div>
  );
}

function AssetCard({ asset }: { asset: Asset }) {
  const Icon = asset.type === "wind" ? Wind : asset.type === "storage" ? Zap : Sun;
  const healthy = asset.status === "operational";
  return (
    <article className="pc-card group overflow-hidden transition duration-150 hover:-translate-y-0.5 hover:border-[#BAC6BD] hover:shadow-[0_18px_48px_rgba(16,21,19,.075)]">
      <div className="relative h-32 overflow-hidden bg-[linear-gradient(145deg,#EDF4EF,#D8E6DC)] p-5">
        <div className="absolute inset-0 pc-grid-lines opacity-45" />
        <div className="relative flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl border border-white/90 bg-white/85 text-[var(--green)] shadow-sm"><Icon className="size-5" /></span>{asset.verified ? <span className="inline-flex items-center gap-1 rounded-full border border-[#DCE8E0] bg-white/88 px-2.5 py-1 text-[9px] font-bold text-[var(--success)]"><ShieldCheck className="size-3" /> Verified</span> : null}</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate font-bold tracking-[-.02em]">{asset.name}</h2><p className="mt-1 truncate text-xs text-[var(--muted)]">{asset.location} · <span className="capitalize">{asset.type}</span></p></div><span className={`mt-0.5 size-2.5 shrink-0 rounded-full ${healthy ? "bg-[#167A4A]" : "bg-[#B7791F]"}`} aria-label={asset.status} /></div>
        <div className="mt-4 grid grid-cols-3 gap-2"><Stat label="Capacity" value={`${asset.capacityMw} MW`} /><Stat label="Availability" value={`${asset.availability}%`} /><Stat label="Status" value={asset.status} /></div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-[#5B675F]"><CheckCircle2 className="size-3.5 text-[var(--success)]" />Operational data available</div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[var(--surface-soft)] p-3"><span className="text-[8px] text-[var(--muted-2)]">{label}</span><b className="mt-1 block truncate text-[11px] capitalize">{value}</b></div>;
}

function AssetSkeleton() {
  return <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="pc-card overflow-hidden"><div className="pc-skeleton h-32" /><div className="p-5"><div className="pc-skeleton h-5 w-1/2 rounded" /><div className="pc-skeleton mt-2 h-3 w-3/4 rounded" /><div className="mt-5 grid grid-cols-3 gap-2"><div className="pc-skeleton h-14 rounded-xl"/><div className="pc-skeleton h-14 rounded-xl"/><div className="pc-skeleton h-14 rounded-xl"/></div></div></div>)}</div>;
}
