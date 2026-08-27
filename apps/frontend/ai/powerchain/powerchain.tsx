import { Bot, CheckCircle2, Network, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type PowerChainAiRuntime = {
  environment: "development" | "mainnet";
  providerOrder: readonly string[];
  configuredProviders: number;
  workspaceLabel?: string;
};

export function PowerChainAiContextCard({ runtime }: { runtime: PowerChainAiRuntime }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold text-[var(--green)]"><Bot className="size-4" /> PowerChain AI</p>
          <h3 className="mt-2 text-base font-semibold tracking-[-.02em]">Governed provider orchestration</h3>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Provider fallback stays inside one governed Copilot request and never authorizes operational or onchain execution.</p>
        </div>
        <Badge>{runtime.environment}</Badge>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Status icon={Network} label="Workspace" value={runtime.workspaceLabel ?? "Authenticated workspace"} />
        <Status icon={CheckCircle2} label="Configured providers" value={String(runtime.configuredProviders)} />
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--muted)]"><ShieldCheck className="size-3.5" /> Fallback order</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{runtime.providerOrder.map((provider, index) => <span key={`${provider}-${index}`} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[var(--ink)]">{index + 1}. {provider}</span>)}</div>
      </div>
    </Card>
  );
}

function Status({ icon: Icon, label, value }: { icon: typeof Bot; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3"><Icon className="size-4 text-[var(--green)]" /><div><p className="text-[10px] uppercase tracking-[.1em] text-[var(--muted)]">{label}</p><p className="text-xs font-semibold">{value}</p></div></div>;
}
