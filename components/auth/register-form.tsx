"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiRoutes } from "@/config/api";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = (params.get("plan") || "free").toLowerCase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const rules = useMemo(() => [
    ["12+ characters", password.length >= 12],
    ["Uppercase", /[A-Z]/.test(password)],
    ["Lowercase", /[a-z]/.test(password)],
    ["Number", /\d/.test(password)],
  ] as const, [password]);
  const validPassword = rules.every(([, valid]) => valid);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validPassword) { setError("Complete all password requirements before continuing."); return; }
    setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(apiRoutes.auth.register, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), workspaceName: form.get("workspaceName"), password: form.get("password"), plan: ["free", "pro", "business"].includes(plan) ? plan : "free", acceptedTerms: Boolean(form.get("acceptedTerms")) }) });
    const json = await response.json().catch(() => null);
    setLoading(false);
    if (!response.ok) { setError(json?.error?.message || "Unable to create the account."); return; }
    router.push("/dashboard"); router.refresh();
  }

  return (
    <form onSubmit={submit} className="pc-card mx-auto mt-10 max-w-2xl p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#1E6B4B]">{plan} plan</p><h2 className="mt-2 text-2xl font-bold tracking-[-.03em]">Create your workspace</h2><p className="mt-2 text-xs leading-5 text-[#737D77]">Set up your PowerChain identity and operational workspace.</p></div><CheckCircle2 className="size-6 shrink-0 text-[#167A4A]" /></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field name="name" label="Your name" placeholder="Alex Morgan" autoComplete="name" /><Field name="email" label="Work email" placeholder="alex@company.com" type="email" autoComplete="email" /><Field name="workspaceName" label="Workspace" placeholder="Acme Energy Ops" autoComplete="organization" /><label className="text-xs font-semibold">Password<div className="relative mt-2"><input name="password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} required autoComplete="new-password" className="pc-input pr-12 font-normal" placeholder="Create a secure password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[#6D7771] hover:bg-[#F2F5F3]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label></div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#F6F8F6] p-3 sm:grid-cols-4">{rules.map(([label, valid]) => <span key={label} className={`flex items-center gap-1.5 text-[9px] font-semibold ${valid ? "text-[#167A4A]" : "text-[#7D8680]"}`}><span className={`grid size-4 place-items-center rounded-full ${valid ? "bg-[#E2F1E8]" : "bg-[#E8ECE9]"}`}>{valid ? <Check className="size-2.5" /> : null}</span>{label}</span>)}</div>
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#E1E6E2] bg-white p-3 text-[10px] leading-5 text-[#68736C]"><input name="acceptedTerms" type="checkbox" required className="mt-0.5 size-4 shrink-0 rounded border-[#C9D1CC] accent-[#143C2E]" /><span>I agree to the <Link href="/legal/terms" target="_blank" className="font-bold text-[#17613F] hover:underline">Terms of Service</Link> and acknowledge the <Link href="/legal/privacy" target="_blank" className="font-bold text-[#17613F] hover:underline">Privacy Policy</Link> and <Link href="/legal/disclaimer" target="_blank" className="font-bold text-[#17613F] hover:underline">Product Disclaimer</Link>.</span></label>
      {error ? <p role="alert" className="mt-4 rounded-xl border border-[#F0D5D3] bg-[#FFF3F2] px-3 py-2 text-xs font-medium text-[#A73535]">{error}</p> : null}
      <button disabled={loading || !validPassword} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#143C2E] px-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(20,60,46,.14)] transition hover:bg-[#0F3327] disabled:opacity-45">{loading ? <Loader2 className="size-4 animate-spin" /> : null}Create workspace</button>
      <p className="mt-3 text-center text-[10px] leading-5 text-[#7B8580]">Sessions use a signed HttpOnly cookie. Passwords are never stored in plaintext.</p>
    </form>
  );
}

function Field({ name, label, placeholder, type = "text", autoComplete }: { name: string; label: string; placeholder: string; type?: string; autoComplete?: string }) {
  return <label className="text-xs font-semibold">{label}<input name={name} type={type} required autoComplete={autoComplete} className="pc-input mt-2 font-normal" placeholder={placeholder} /></label>;
}
