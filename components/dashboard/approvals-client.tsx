"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Loader2, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { apiRoutes } from "@/config/api";

type Approval = { id: string; title: string; description: string; severity: string; status: string; amount?: string };
type Filter = "pending" | "all" | "resolved";

export function ApprovalsClient() {
  const [items, setItems] = useState<Approval[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const { toast } = useToast();

  async function load() {
    try {
      const response = await fetch(apiRoutes.approvals);
      const json = await response.json();
      if (json.ok) setItems(json.data); else setError(json.error.message);
    } catch { setError("Unable to load approvals."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => items.filter((item) => filter === "all" ? true : filter === "pending" ? item.status === "pending" : item.status !== "pending"), [filter, items]);

  async function act(id: string, action: "approve" | "request_changes") {
    setBusy(id + action); setError("");
    const response = await fetch(apiRoutes.approval(id), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) });
    const json = await response.json().catch(() => null);
    setBusy("");
    if (!response.ok) {
      const message = json?.error?.message || "Action failed.";
      setError(message);
      toast({ title: "Approval not updated", description: message, tone: "error" });
      return;
    }
    setItems((current) => current.map((item) => item.id === id ? json.data : item));
    toast({ title: action === "approve" ? "Approval recorded" : "Changes requested", description: json.data.title, tone: "success" });
  }

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#1E6B4B]">Policy controls</p><h1 className="mt-2 text-3xl font-bold tracking-[-.04em] sm:text-4xl">Review & approve</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66706A]">Decisions are recorded only after an authorized workspace member explicitly acts. No auto-execution.</p></div>
        <div className="flex items-center gap-2 rounded-xl border border-[#DDE3DE] bg-white p-1.5 shadow-sm" role="group" aria-label="Approval filters"><SlidersHorizontal className="ml-2 size-3.5 text-[#7A847E]" />{(["pending", "all", "resolved"] as Filter[]).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} className={`min-h-9 rounded-lg px-3 text-[10px] font-bold capitalize ${filter === item ? "bg-[#143C2E] text-white" : "text-[#66706A] hover:bg-[#F4F6F4]"}`}>{item}</button>)}</div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3"><Summary label="Pending" value={items.filter((item) => item.status === "pending").length} /><Summary label="Resolved" value={items.filter((item) => item.status !== "pending").length} /><Summary label="High priority" value={items.filter((item) => item.status === "pending" && item.severity === "high").length} /></div>
      {error ? <p role="alert" className="mt-5 rounded-xl border border-[#F0D5D3] bg-[#FFF3F2] p-3 text-xs text-[#A73535]">{error}</p> : null}

      <div className="mt-5 space-y-4">
        {loading ? <ApprovalSkeleton /> : visible.map((approval) => (
          <article key={approval.id} className="pc-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#EDF4EF] text-[#1E6B4B]"><ShieldCheck className="size-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{approval.title}</h2><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${approval.severity === "high" ? "bg-[#FFF0EF] text-[#B43B36]" : "bg-[#FFF5E8] text-[#9D6419]"}`}>{approval.severity}</span><span className="rounded-full bg-[#F0F3F0] px-2 py-1 text-[9px] font-bold capitalize text-[#5F6963]">{approval.status.replace("_", " ")}</span></div>
                <p className="mt-2 text-sm leading-6 text-[#66706A]">{approval.description}</p>
                {approval.amount ? <p className="mt-3 text-xs font-bold text-[#243129]">{approval.amount}</p> : null}
              </div>
              {approval.status === "pending" ? (
                <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
                  <button disabled={!!busy} onClick={() => act(approval.id, "request_changes")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D4DBD6] bg-white px-4 text-xs font-bold transition hover:bg-[#F7F9F7] disabled:opacity-50">{busy === approval.id + "request_changes" ? <Loader2 className="size-3 animate-spin" /> : <X className="size-3" />}Request changes</button>
                  <button disabled={!!busy} onClick={() => act(approval.id, "approve")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#143C2E] px-4 text-xs font-bold text-white transition hover:bg-[#0F3327] disabled:opacity-50">{busy === approval.id + "approve" ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}Approve</button>
                </div>
              ) : <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-bold text-[#167A4A]"><CheckCircle2 className="size-4" />Recorded</span>}
            </div>
          </article>
        ))}
      </div>

      {!loading && visible.length === 0 ? <div className="pc-card mt-5 p-10 text-center"><CheckCircle2 className="mx-auto size-7 text-[#167A4A]" /><h2 className="mt-3 text-sm font-bold">Nothing in this view</h2><p className="mt-1 text-xs text-[#66706A]">There are no approvals matching the selected filter.</p></div> : null}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) { return <div className="pc-card p-4"><span className="text-[9px] font-semibold uppercase tracking-[.1em] text-[#87908A]">{label}</span><b className="mt-2 block text-2xl tracking-[-.03em]">{value}</b></div>; }
function ApprovalSkeleton() { return <>{Array.from({ length: 3 }).map((_, index) => <div key={index} className="pc-card p-6"><div className="flex gap-4"><div className="pc-skeleton size-11 shrink-0 rounded-2xl"/><div className="flex-1"><div className="pc-skeleton h-4 w-2/5 rounded"/><div className="pc-skeleton mt-3 h-3 w-full rounded"/><div className="pc-skeleton mt-2 h-3 w-3/4 rounded"/></div></div></div>)}</>; }
