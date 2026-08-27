"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { apiRoutes } from "@/config/api";
import { safeNextPath } from "@/utils/helpers";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const next = safeNextPath(params.get("next"));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch(apiRoutes.auth.signIn, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password"), rememberMe }),
    });
    const json = await response.json().catch(() => null);
    setLoading(false);
    if (!response.ok) {
      setError(json?.error?.message || "Unable to sign in.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function demo() {
    setError("");
    setDemoLoading(true);
    const response = await fetch(apiRoutes.auth.demo, { method: "POST" });
    setDemoLoading(false);
    if (!response.ok) {
      setError("Unable to start the demo workspace.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <div>
        <label htmlFor="email" className="text-xs font-semibold">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="pc-input mt-2" placeholder="you@company.com" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-xs font-semibold">Password</label>
          <Link href="/contact?intent=account-access" className="text-[11px] font-semibold text-[#1E6B4B] hover:underline">Need help?</Link>
        </div>
        <div className="relative mt-2">
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="pc-input pr-12" placeholder="••••••••••••" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[#6D7771] hover:bg-[#F2F5F3]" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-xs font-medium text-[#59645D]">
          <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="size-4 rounded border-[#C9D1CC] accent-[#143C2E]" />
          Remember me for 30 days
        </label>
        <span className="hidden text-[10px] text-[#929A95] sm:inline">Use only on a trusted device.</span>
      </div>
      {error ? <p role="alert" className="rounded-xl border border-[#F0D5D3] bg-[#FFF3F2] px-3 py-2 text-xs font-medium text-[#A73535]">{error}</p> : null}
      <button disabled={loading || demoLoading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#143C2E] px-4 text-sm font-bold text-white shadow-[0_10px_28px_rgba(20,60,46,.14)] transition hover:bg-[#0F3327] disabled:opacity-60">
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}Sign in
      </button>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-[#909893]"><span className="h-px flex-1 bg-[#E1E6E2]" />or<span className="h-px flex-1 bg-[#E1E6E2]" /></div>
      <button type="button" disabled={demoLoading || loading} onClick={demo} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#CAD3CC] bg-white px-4 text-sm font-bold text-[#143C2E] transition hover:bg-[#F7F9F7] disabled:opacity-60">
        {demoLoading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}Open demo workspace
      </button>
      <p className="text-center text-xs text-[#66706A]">New to PowerChain? <Link href="/get-started" className="font-semibold text-[#1E6B4B] hover:underline">Create an account</Link></p>
    </form>
  );
}
