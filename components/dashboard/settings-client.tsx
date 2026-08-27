"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type SessionData = {
  user: { name: string; email: string };
  workspace: { name: string; plan: string };
};

export function SettingsClient() {
  const { toast } = useToast();
  const [data, setData] = useState<SessionData | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((json) => json.ok ? setData(json.data) : setError(json.error.message));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
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
    setData((current) => current ? ({
      ...current,
      user: { ...current.user, name: json.data.user.name },
      workspace: { ...current.workspace, name: json.data.workspace.name },
    }) : current);
    toast({ title: "Settings saved", description: "Your profile and workspace settings are up to date.", tone: "success" });
    window.setTimeout(() => setState("idle"), 1800);
  }

  if (!data) return <div className="pc-card p-8 text-sm text-[#66706A]">{error || "Loading settings…"}</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#1E6B4B]">Workspace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-.04em]">Settings</h1>
      <p className="mt-2 text-sm text-[#66706A]">Update identity and workspace details through the SaaS API.</p>
      <form onSubmit={save} className="pc-card mt-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold">Name<input name="name" defaultValue={data.user.name} required className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Workspace name<input name="workspaceName" defaultValue={data.workspace.name} required className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Email<input value={data.user.email} disabled className="pc-input mt-2 font-normal" /></label>
          <label className="text-xs font-semibold">Plan<input value={data.workspace.plan} disabled className="mt-2 h-12 w-full rounded-xl border border-[#E0E5E1] bg-[#F7F9F7] px-4 font-normal capitalize text-[#7B8580]" /></label>
        </div>
        {error ? <p className="mt-4 rounded-xl bg-[#FFF3F2] p-3 text-xs text-[#A73535]">{error}</p> : null}
        <button type="submit" disabled={state === "saving"} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#143C2E] px-5 text-sm font-bold text-white disabled:opacity-60">
          {state === "saving" ? <Loader2 className="size-4 animate-spin" /> : state === "saved" ? <CheckCircle2 className="size-4" /> : null}
          {state === "saved" ? "Saved" : "Save settings"}
        </button>
      </form>
      <div className="pc-card mt-4 p-6">
        <h2 className="text-sm font-bold">Security posture</h2>
        <div className="mt-4 grid gap-3 text-xs text-[#66706A] sm:grid-cols-2">
          <p className="rounded-xl bg-[#F6F8F6] p-3">Signed HttpOnly session cookie</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">scrypt password hashing</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">Workspace-scoped API reads</p>
          <p className="rounded-xl bg-[#F6F8F6] p-3">Role-gated approval mutations</p>
        </div>
      </div>
    </div>
  );
}
