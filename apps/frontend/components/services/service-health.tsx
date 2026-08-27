"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { powerChainApi } from "@/lib/powerchain";
import type { ServiceHealth as ServiceHealthType } from "@/lib/powerchain";
import { ServiceCard } from "./service-card";

export function ServiceHealth() {
  const [services, setServices] = useState<ServiceHealthType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try { setServices(await powerChainApi.getServices()); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to load service configuration."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  return (
    <section className="pc-card mt-4 p-6">
      <div className="flex items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Connected services</h2><p className="mt-1 text-xs text-[#7A847E]">Server-side provider configuration. API keys are never sent to the browser.</p></div><button type="button" onClick={() => void load()} disabled={loading} className="grid size-10 place-items-center rounded-xl border border-[#DCE3DE] text-[#68736C] hover:bg-[var(--canvas)] disabled:opacity-50" aria-label="Refresh service status"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></button></div>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-[#FFF3F2] p-3 text-xs text-[#A73535]">{error}</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{loading && !services.length ? Array.from({ length: 4 }, (_, index) => <div key={index} className="pc-skeleton h-32 rounded-2xl" />) : services.map((service) => <ServiceCard key={service.key} {...service} />)}</div>
    </section>
  );
}
