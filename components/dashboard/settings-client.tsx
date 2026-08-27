"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Clock3, Eye, EyeOff, Loader2, ShieldCheck, Wifi } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { ServiceHealth } from "@/components/services/service-health";
import { apiRoutes } from "@/config/api";
import { apiV1, type SecuritySession } from "@/apps/frontend/api/v1";
import { formatDateTime } from "@/utils/formats";

type SessionData = {
  user: { name: string; email: string };
  workspace: { name: string; plan: string };
  role: string;
  persistent?: boolean;
  expiresAt?: string;
};

export function SettingsClient() {
  const { toast } = useToast();
  const [data, setData] = useState<SessionData | null>(null);
  const [securitySession, setSecuritySession] = useState<SecuritySession | null>(null);
  const [revealedIp, setRevealedIp] = useState(false);
  const [ipLoading, setIpLoading] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiRoutes.auth.session)
      .then((response) => response.json())
      .then((json) => json.ok ? setData(json.data) : setError(json.error.message));
    apiV1.getSecuritySession(false).then(setSecuritySession).catch(() => null);
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(apiRoutes.profile, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), workspaceName: form.get("workspaceName") }),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      const message = json?.error?.message || "Unable to save settings.";
      setState("idle");
      setError(message);
      toast({ title: "Settings not saved", description: message, tone: "error" });
      return;
    }
    setState("saved");
    setData((current) => current ? ({ ...current, user: { ...current.user, name: json.data.user.name }, workspace: { ...current.workspace, name: json.data.workspace.name } }) : current);
    toast({ title: "Settings saved", description: "Your profile and workspace settings are up to date.", tone: "success" });
    window.setTimeout(() => setState("idle"), 1800);
  }

  async function toggleIp() {
    setIpLoading(true);
    try {
      const nextReveal = !revealedIp;
      const session = await apiV1.getSecuritySession(nextReveal);
      setSecuritySession(session);
      setRevealedIp(nextReveal);
    } catch (error) {
      toast({ title: "Session details unavailable", description: error instanceof Error ? error.message : "Unable to load your current session.", tone: "error" });
    } finally {
      setIpLoading(false);
    }
  }

  if (!data) return <div className="pc-card p-8 text-sm text-[#66706A]">{error || "Loading settings…"}</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#1E6B4B]">Workspace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-.04em]">Settings</h1>
      <p className="mt-2 text-sm text-[#66706A]">Manage workspace identity, current-session visibility, and server-side service configuration.</p>

      <form onSubmit={save} className="pc-card mt-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Name<input name="name" defaultValue={data.user.name} required className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Workspace name<input name="workspaceName" defaultValue={data.workspace.name} required className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Email<input value={data.user.email} disabled className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Plan<input value={data.workspace.plan} disabled className="mt-2 h-12 w-full rounded-xl border border-[#E0E5E1] bg-[#F7F9F7] px-4 font-normal capitalize text-[#7B8580]" /></label>
        </div>
        {error ? <p role="alert" className="mt-4 rounded-xl bg-[#FFF3F2] p-3 text-xs text-[#A73535]">{error}</p> : null}
        <button type="submit" disabled={state === "saving"} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#143C2E] px-5 text-sm font-bold text-white disabled:opacity-60">
          {state === "saving" ? <Loader2 className="size-4 animate-spin" /> : state === "saved" ? <CheckCircle2 className="size-4" /> : null}
          {state === "saved" ? "Saved" : "Save settings"}
        </button>
      </form>

      <section className="pc-card mt-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 className="text-sm font-bold">Current session</h2><p className="mt-1 text-xs leading-5 text-[#78827C]">IP addresses are derived from the active request for security visibility and are not written to the reference application database.</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDF7F0] px-3 py-1.5 text-[9px] font-bold text-[#167A4A]"><ShieldCheck className="size-3" />Authenticated</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E5E9E6] bg-[#FAFBFA] p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#939C96]"><Wifi className="size-3.5" />Current IP</div><div className="mt-3 flex items-center justify-between gap-2"><span className="truncate font-mono text-xs font-semibold text-[#354039]">{securitySession?.ip || "Loading…"}</span><button type="button" onClick={() => void toggleIp()} disabled={ipLoading || !securitySession} className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#DDE4DF] bg-white text-[#657069] hover:text-[#143C2E] disabled:opacity-50" aria-label={revealedIp ? "Hide IP address" : "Show IP address"}>{ipLoading ? <Loader2 className="size-3.5 animate-spin" /> : revealedIp ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}</button></div></div>
          <div className="rounded-2xl border border-[#E5E9E6] bg-[#FAFBFA] p-4"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#939C96]">Session mode</p><p className="mt-3 text-xs font-bold text-[#354039]">{securitySession?.persistent ? "Remembered · 30 days" : "Browser session"}</p><p className="mt-1 text-[10px] text-[#8C958F]">Role: {securitySession?.role || data.role}</p></div>
          <div className="rounded-2xl border border-[#E5E9E6] bg-[#FAFBFA] p-4"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#939C96]"><Clock3 className="size-3.5" />Expires</div><p className="mt-3 text-xs font-bold text-[#354039]">{securitySession?.expiresAt ? formatDateTime(securitySession.expiresAt) : data.expiresAt ? formatDateTime(data.expiresAt) : "Session limited"}</p></div>
        </div>
      </section>

      <section className="pc-card mt-4 p-6">
        <h2 className="text-sm font-bold">Security posture</h2>
        <div className="mt-4 grid gap-3 text-xs text-[#66706A] sm:grid-cols-2">
          <p className="rounded-xl bg-[#F6F8F6] p-3">Signed HttpOnly session cookie</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">scrypt password hashing</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">Workspace-scoped API reads</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">Role-gated approval mutations</p>
        </div>
      </section>

      <ServiceHealth />
    </div>
  );
}
