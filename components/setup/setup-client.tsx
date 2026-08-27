"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Cloud, ExternalLink, Github, Globe2, HardDriveDownload, ShieldCheck } from "lucide-react";
import { FaApple, FaGooglePlay, FaWindows } from "react-icons/fa6";
import { getInstallSources, installConfig, type Platform } from "@/config/install";
import type { InstallSource } from "@/config/rules";
import { AppIcon } from "@/components/brand/app-icon";
import { useToast } from "@/components/ui/toast";
import { useMobile } from "@/hooks/mobile";

const platformIcons: Record<Platform, React.ReactNode> = {
  macOS: <FaApple />,
  Windows: <FaWindows />,
  iOS: <FaApple />,
  Android: <FaGooglePlay />,
  Web: <Globe2 className="size-4" />,
};

const sourceIcons: Record<InstallSource, React.ReactNode> = {
  github: <Github className="size-5" />,
  drive: <Cloud className="size-5" />,
  store: <HardDriveDownload className="size-5" />,
  web: <Globe2 className="size-5" />,
};

export function SetupClient({ initialPlatform = "Web", initialSource }: { initialPlatform?: Platform; initialSource?: InstallSource }) {
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const sources = useMemo(() => getInstallSources(platform), [platform]);
  const [source, setSource] = useState<InstallSource>(initialSource && sources.some((x) => x.id === initialSource) ? initialSource : sources[0]?.id ?? "web");
  const { toast } = useToast();
  const mobile = useMobile();

  const selected = sources.find((item) => item.id === source) ?? sources[0];

  function changePlatform(next: Platform) {
    const nextSources = getInstallSources(next);
    setPlatform(next);
    setSource(nextSources[0]?.id ?? "web");
  }

  function announce() {
    toast({
      title: selected?.configured ? "Installation source ready" : "Access request required",
      description: selected?.configured
        ? `Opening ${selected.label} for PowerChain Copilot ${installConfig.version}.`
        : `${selected?.label ?? "This channel"} is not publicly configured yet. The next step opens the access request flow.`,
      tone: selected?.configured ? "success" : "info",
    });
  }

  const variant = platform === "macOS" || platform === "iOS" ? "light" : platform === "Web" ? "green" : "dark-green";

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#E0E5E1] bg-white p-2 sm:mb-6">
        {["Choose platform", "Select source", "Install & sign in"].map((label, index) => (
          <div key={label} className={`flex min-h-10 items-center gap-2 rounded-xl px-2.5 text-[9px] font-bold sm:px-3 sm:text-[10px] ${index < 2 ? "bg-[#F0F6F2] text-[#17613F]" : "text-[#7D8680]"}`}>
            <span className={`grid size-5 shrink-0 place-items-center rounded-full ${index < 2 ? "bg-[#143C2E] text-white" : "bg-[#E8ECE9]"}`}>{index + 1}</span>
            <span className="truncate">{label}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
      <aside className="pc-card p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <AppIcon variant={variant} size={mobile ? 56 : 70} priority />
          <div>
            <p className="pc-kicker">Setup assistant</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-.035em]">Choose your platform</h2>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
          {installConfig.platforms.map((item) => (
            <button key={item} type="button" onClick={() => changePlatform(item)} className={`flex min-h-12 items-center gap-2 rounded-xl border px-4 text-left text-sm font-semibold transition ${platform === item ? "border-[#1E6B4B] bg-[#E7F1EB] text-[#143C2E]" : "border-[#D9DEDA] bg-white text-[#526058] hover:border-[#ADB9B0]"}`}>
              {platformIcons[item]} {item}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#F5F8F6] p-4 text-xs leading-6 text-[#66706A]">
          <div className="flex items-center gap-2 font-bold text-[#143C2E]"><ShieldCheck className="size-4" /> Signed channels only</div>
          <p className="mt-2">Native production installs fail closed when a trusted release source is not configured. Web access remains available through authenticated SaaS sign-in.</p>
        </div>
      </aside>

      <section className="pc-card p-6 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="pc-kicker">Distribution</p>
            <h2 className="mt-2 text-2xl font-bold tracking-[-.035em]">Install PowerChain for {platform}</h2>
          </div>
          <span className="rounded-full bg-[#EEF3EF] px-3 py-1.5 text-[10px] font-bold text-[#496056]">v{installConfig.version}</span>
        </div>

        <div className="mt-6 grid gap-3">
          {sources.map((item) => (
            <button key={item.id} type="button" onClick={() => setSource(item.id)} className={`flex min-h-20 items-center gap-4 rounded-2xl border p-4 text-left transition ${source === item.id ? "border-[#1E6B4B] bg-[#F1F7F3] shadow-[0_8px_26px_rgba(30,107,75,.08)]" : "border-[#D9DEDA] bg-white hover:border-[#AEBAB2]"}`}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#1E6B4B] shadow-sm">{sourceIcons[item.id]}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#101513]">{item.label}{item.configured ? <CheckCircle2 className="size-4 text-[#167A4A]" /> : <span className="rounded-full bg-[#F3EFE5] px-2 py-0.5 text-[9px] text-[#8A6418]">Access required</span>}</span>
                <span className="mt-1 block text-xs leading-5 text-[#66706A]">{item.description}</span>
              </span>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={selected.href} target={selected.external ? "_blank" : undefined} rel={selected.external ? "noreferrer" : undefined} onClick={announce} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#143C2E] px-5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(20,60,46,.18)] transition hover:-translate-y-px hover:bg-[#0F3327]">
              {selected.configured ? `Continue with ${selected.label}` : "Request access"}
              {selected.external ? <ExternalLink className="size-4" /> : <ArrowRight className="size-4" />}
            </a>
            <Link href={`/install?platform=${encodeURIComponent(platform)}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#C9D1CB] bg-white px-5 text-sm font-semibold text-[#243129] transition hover:border-[#99A69D] hover:bg-[#F8FAF8]">View instructions</Link>
          </div>
        ) : null}
      </section>
      </div>
    </div>
  );
}
