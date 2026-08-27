import { FaApple, FaGooglePlay, FaWindows } from "react-icons/fa6";
import { ArrowUpRight, Cloud, Github, Globe2, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/brand/app-icon";

export function Downloads() {
  return (
    <section className="bg-[var(--canvas)] py-20 sm:py-24">
      <div className="pc-shell">
        <div className="grid gap-10 overflow-hidden rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_24px_80px_rgba(16,21,19,.055)] sm:p-10 lg:grid-cols-[.78fr_1.22fr] lg:p-14">
          <div className="relative">
            <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-[#E9F2EC] blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-4">
                <AppIcon variant="green" size={72} priority alt="PowerChain Copilot app icon" className="shadow-[0_18px_38px_rgba(16,21,19,.15)]" />
                <div><p className="pc-kicker">PowerChain everywhere</p><p className="mt-2 text-xs font-semibold text-[#5B675F]">Mobile · Desktop · Web</p></div>
              </div>
              <h2 className="mt-7 text-4xl font-bold tracking-[-.05em] sm:text-5xl">One Copilot. Every workspace.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">Use the same identity, assets, operational context and governed workflows across browser, mobile and desktop surfaces.</p>
              <div className="mt-7 grid gap-2 text-xs text-[#5C685F] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {["One PowerChain identity", "Synced operational context", "Responsive product surfaces", "Signed distribution channels"].map((item) => <span key={item} className="flex items-center gap-2 rounded-xl bg-[var(--canvas)] px-3 py-2.5"><ShieldCheck className="size-4 shrink-0 text-[var(--success)]" />{item}</span>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-2"><Button href="/setup" arrow>Setup PowerChain</Button><Button href="/install" variant="secondary">All install options</Button></div>
            </div>
          </div>

          <div className="grid content-start gap-3 sm:grid-cols-2">
            <StoreBadge href="/setup?platform=iOS&source=store" icon={<FaApple />} overline="Managed mobile" title="App Store" />
            <StoreBadge href="/setup?platform=Android&source=store" icon={<FaGooglePlay />} overline="Managed mobile" title="Google Play" />
            <InstallCard icon={<FaApple />} appIcon={<AppIcon variant="light" size={42} />} title="PowerChain for macOS" meta="macOS 14+ · Apple silicon / Intel" href="/setup?platform=macOS" action="Setup" />
            <InstallCard icon={<FaWindows />} appIcon={<AppIcon variant="dark-green" size={42} />} title="PowerChain for Windows" meta="Windows 11 · x64 / ARM64" href="/setup?platform=Windows" action="Setup" />
            <InstallCard icon={<Github />} appIcon={<AppIcon variant="dark" size={42} />} title="GitHub Releases" meta="Signed artifacts · checksums · notes" href="/setup?platform=macOS&source=github" action="Open" />
            <InstallCard icon={<Cloud />} appIcon={<AppIcon variant="green" size={42} />} title="Google Drive" meta="Managed beta / enterprise distribution" href="/setup?platform=macOS&source=drive" action="Open" />
            <InstallCard icon={<Globe2 />} appIcon={<AppIcon variant="green" size={42} />} title="PowerChain Web" meta="No installation required" wide action="Open" href="/sign-in" />
            <div className="flex items-start gap-3 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-[10px] leading-5 text-[var(--muted)] sm:col-span-2"><MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-[var(--success)]" /><span>Install sources are configuration-driven. Missing production URLs fail closed and route to a real access-request workflow rather than a dead download.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoreBadge({ href, icon, overline, title }: { href: string; icon: React.ReactNode; overline: string; title: string }) {
  return <a href={href} className="group flex min-h-20 items-center gap-4 rounded-2xl bg-[#101513] px-5 text-white shadow-[0_12px_30px_rgba(16,21,19,.12)] transition duration-150 hover:-translate-y-px hover:bg-[#17201B]"><span className="text-3xl">{icon}</span><span className="min-w-0 flex-1"><span className="block text-[9px] tracking-wide text-white/65">{overline}</span><b className="block text-xl tracking-[-.025em]">{title}</b></span><ArrowUpRight className="size-4 text-white/50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>;
}

function InstallCard({ icon, appIcon, title, meta, wide = false, action = "Setup", href = "/setup" }: { icon: React.ReactNode; appIcon: React.ReactNode; title: string; meta: string; wide?: boolean; action?: string; href?: string }) {
  return <a href={href} className={`${wide ? "sm:col-span-2" : ""} group flex min-h-24 items-center gap-3 rounded-2xl border border-[#D6DDD8] bg-white px-4 transition duration-150 hover:-translate-y-px hover:border-[#AEBBB2] hover:shadow-[0_12px_30px_rgba(16,21,19,.055)]`}>{appIcon}<span className="min-w-0 flex-1"><span className="flex items-center gap-1.5 text-[#143C2E]"><span className="text-sm">{icon}</span><b className="truncate text-sm">{title}</b></span><span className="mt-1 block text-[10px] text-[#758079]">{meta}</span></span><span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--green)]">{action}<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></a>;
}
