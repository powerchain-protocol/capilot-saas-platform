"use client";

import { Smartphone, ShieldCheck } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { AppIcon } from "@/components/brand/app-icon";
import { getInstallSources, type Platform } from "@/config/install";
import { useMobile } from "@/hooks/mobile";

function storeLabel(platform: Platform): string {
  return platform === "iOS" ? "App Store" : "Google Play";
}

export function MobileInstaller({ platform }: { platform: "iOS" | "Android" }) {
  const mobile = useMobile();
  const source = getInstallSources(platform).find((item) => item.id === "store");
  const iconVariant = platform === "iOS" ? "light" : "dark-green";
  const StoreIcon = platform === "iOS" ? FaApple : FaGooglePlay;

  if (!source) return null;

  return (
    <section className="pc-card p-5 sm:p-6" aria-labelledby={`${platform}-installer-title`}>
      <div className="flex items-start gap-4">
        <AppIcon variant={iconVariant} size={mobile ? 54 : 64} alt={`PowerChain Copilot ${platform} app icon`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Smartphone className="size-4 text-[var(--green)]" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--green)]">Mobile</span>
          </div>
          <h2 id={`${platform}-installer-title`} className="mt-2 text-xl font-bold tracking-[-.03em]">PowerChain for {platform}</h2>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Managed installation, updates, and platform security through {storeLabel(platform)}.</p>
        </div>
      </div>

      <a
        href={source.href}
        target={source.external ? "_blank" : undefined}
        rel={source.external ? "noreferrer" : undefined}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[var(--forest)] px-5 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[var(--forest-strong)]"
      >
        <StoreIcon className="size-5" aria-hidden="true" />
        {source.configured ? `Open ${storeLabel(platform)}` : `Request ${platform} access`}
      </a>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--surface-soft)] p-3 text-[10px] leading-5 text-[var(--muted)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
        <span>PowerChain does not direct users to unsigned mobile packages. Store or approved beta distribution is required.</span>
      </div>
    </section>
  );
}
