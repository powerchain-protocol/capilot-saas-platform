"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaApple, FaGooglePlay, FaWindows } from "react-icons/fa6";
import { Cloud, Github, Globe2, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { InstallInstructions } from "./instructions";
import { AppIcon } from "@/components/brand/app-icon";
import { getInstallSources, installConfig, type Platform } from "@/config/install";
import { useMobile } from "@/hooks/mobile";

const platformIcons: Record<Platform, React.ReactNode> = {
  macOS: <FaApple />,
  Windows: <FaWindows />,
  iOS: <FaApple />,
  Android: <FaGooglePlay />,
  Web: <Globe2 className="size-4" />,
};

export default function InstallPage() {
  const [platform, setPlatform] = useState<Platform>("Web");
  const mobile = useMobile();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("platform");
    if (installConfig.platforms.includes(p as Platform)) setPlatform(p as Platform);
  }, []);

  const sources = useMemo(() => getInstallSources(platform), [platform]);
  const variant = platform === "macOS" || platform === "iOS" ? "light" : platform === "Web" ? "green" : "dark-green";

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F9F7] py-14 sm:py-20">
        <div className="pc-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="pc-kicker">Install</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-.055em] sm:text-5xl">PowerChain Copilot on every platform.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#66706A]">Use the web app immediately or choose a trusted native distribution channel. GitHub Releases and managed Google Drive delivery are supported from the same setup flow.</p>
          </div>

          <div className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-2">
            {installConfig.platforms.map((item) => (
              <button key={item} onClick={() => setPlatform(item)} type="button" className={`flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${platform === item ? "border-[#1E6B4B] bg-[#EAF3ED] text-[#14563B]" : "border-[#D9DEDA] bg-white hover:border-[#B8C3BB]"}`}>
                {platformIcons[item]} {item}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[.85fr_1.15fr]">
            <section className="pc-card p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <AppIcon variant={variant} size={mobile ? 58 : 72} priority alt={`PowerChain Copilot ${platform} icon`} className="shadow-[0_16px_35px_rgba(16,21,19,.13)]" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[.13em] text-[#1E6B4B]">Canonical release</span>
                  <h2 className="mt-2 text-2xl font-bold">PowerChain for {platform}</h2>
                  <p className="mt-1 text-sm text-[#66706A]">Version {installConfig.version}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-[10px]">
                <Info a="Architecture" b={platform === "macOS" ? "Apple silicon / Intel" : platform === "Windows" ? "x64 / ARM64" : platform === "Web" ? "Browser" : "Managed store"} />
                <Info a="Sources" b={sources.length > 1 ? `${sources.length} channels` : "Web"} />
                <Info a="Security" b={platform === "Web" ? "HTTPS" : "Signed builds"} />
                <Info a="Updates" b={platform === "Web" ? "Continuous" : "Channel managed"} />
              </div>

              <Link href={`/setup?platform=${encodeURIComponent(platform)}`} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#143C2E] text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[#0F3327]">Choose installation source</Link>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {sources.slice(0, 2).map((source) => (
                  <Link key={source.id} href={`/setup?platform=${encodeURIComponent(platform)}&source=${source.id}`} className="flex min-h-11 items-center gap-2 rounded-xl border border-[#D9DEDA] bg-white px-3 text-xs font-semibold text-[#425148] transition hover:border-[#AEBAB2] hover:bg-[#F8FAF8]">
                    {source.id === "github" ? <Github className="size-4" /> : source.id === "drive" ? <Cloud className="size-4" /> : <ShieldCheck className="size-4" />}
                    {source.label}
                  </Link>
                ))}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F4F7F5] p-3 text-[10px] leading-5 text-[#69736D]">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#167A4A]" />
                <span>Native production installations only proceed through configured, trusted release channels. Unconfigured channels route to access requests rather than fake downloads.</span>
              </div>
            </section>

            <section className="pc-card p-6 sm:p-7">
              <p className="pc-kicker">Installation</p>
              <h2 className="mt-4 text-2xl font-bold">Get running in a few steps.</h2>
              <InstallInstructions platform={platform} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Info({ a, b }: { a: string; b: string }) {
  return <div className="rounded-xl bg-[#F5F7F5] p-3"><span className="block text-[#88908B]">{a}</span><b className="mt-1 block text-[#314139]">{b}</b></div>;
}
