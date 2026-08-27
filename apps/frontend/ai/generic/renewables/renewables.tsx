import { BatteryCharging, Gauge, Leaf, Sun, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type RenewableAiContext = {
  assetCount?: number;
  capacityMw?: number;
  availabilityPct?: number;
  technologies?: readonly string[];
  sourceLabel?: string;
  freshnessLabel?: string;
};

const capabilities = [
  { label: "Solar", icon: Sun },
  { label: "Wind", icon: Wind },
  { label: "Storage", icon: BatteryCharging },
  { label: "Performance", icon: Gauge }
] as const;

function metric(value: number | undefined, suffix = ""): string {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toLocaleString()}${suffix}` : "Not supplied";
}

export function RenewablesAiContextCard({ context = {} }: { context?: RenewableAiContext }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold text-[var(--green)]"><Leaf className="size-4" /> Renewable context</p>
          <h3 className="mt-2 text-base font-semibold tracking-[-.02em]">Evidence-aware energy analysis</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--muted)]">The generic renewable layer summarizes supplied asset context only. Missing telemetry, prices and availability remain explicitly unavailable.</p>
        </div>
        <Badge>{context.sourceLabel ?? "Workspace context"}</Badge>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Metric label="Assets" value={metric(context.assetCount)} />
        <Metric label="Capacity" value={metric(context.capacityMw, " MW")} />
        <Metric label="Availability" value={metric(context.availabilityPct, "%")} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {capabilities.map(({ label, icon: Icon }) => <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)]"><Icon className="size-3.5" /> {label}</span>)}
        {context.technologies?.map((technology) => <span key={technology} className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--muted)]">{technology}</span>)}
      </div>

      <p className="mt-4 text-[10px] leading-5 text-[var(--muted)]">Freshness: {context.freshnessLabel ?? "Not supplied"}. Operational decisions still require authoritative evidence and policy review.</p>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--muted)]">{label}</p><p className="mt-1 text-sm font-semibold text-[var(--ink)]">{value}</p></div>;
}

export const RENEWABLE_AI_PROMPTS = [
  "Summarize renewable asset performance using only supplied evidence.",
  "Highlight generation, storage and availability anomalies that need review.",
  "Prepare a renewable operations brief and label every unavailable data point."
] as const;
