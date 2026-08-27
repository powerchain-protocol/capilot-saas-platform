"use client";

import { Cpu, Github, HardDriveDownload, ShieldCheck } from "lucide-react";
import { FaApple, FaWindows } from "react-icons/fa6";
import { AppIcon } from "@/components/brand/app-icon";
import { getInstallSources } from "@/config/install";
import { useMobile } from "@/hooks/mobile";

export function DesktopInstaller({ platform }: { platform: "macOS" | "Windows" }) {
  const mobile = useMobile();
  const sources = getInstallSources(platform);
  const github = sources.find((source) => source.id === "github");
  const drive = sources.find((source) => source.id === "drive");
  const PlatformIcon = platform === "macOS" ? FaApple : FaWindows;
  const iconVariant = platform === "macOS" ? "light" : "dark-green";

  return (
    <section className="pc-card p-5 sm:p-6" aria-labelledby={`${platform}-desktop-title`}>
      <div className="flex items-start gap-4">
        <AppIcon variant={iconVariant} size={mobile ? 54 : 64} alt={`PowerChain Copilot ${platform} app icon`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.13em] text-[var(--green)]"><PlatformIcon /> Desktop</div>
          <h2 id={`${platform}-desktop-title`} className="mt-2 text-xl font-bold tracking-[-.03em]">PowerChain for {platform}</h2>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Signed desktop distribution with controlled release channels and explicit update provenance.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {github ? <a href={github.href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-xs font-bold text-white"><Github className="size-4" /> GitHub Releases</a> : null}
        {drive ? <a href={drive.href} target={drive.external ? "_blank" : undefined} rel={drive.external ? "noreferrer" : undefined} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 text-xs font-bold text-[var(--ink)]"><HardDriveDownload className="size-4" /> {drive.configured ? "Managed Drive" : "Request managed build"}</a> : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-[var(--muted)]">
        <span className="flex items-center gap-2 rounded-xl bg-[var(--surface-soft)] p-3"><Cpu className="size-4" /> {platform === "macOS" ? "Apple silicon / Intel" : "x64 / ARM64"}</span>
        <span className="flex items-center gap-2 rounded-xl bg-[var(--surface-soft)] p-3"><ShieldCheck className="size-4" /> Signed builds only</span>
      </div>
    </section>
  );
}
