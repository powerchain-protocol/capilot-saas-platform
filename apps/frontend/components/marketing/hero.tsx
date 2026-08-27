import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMockups } from "./phone-mockups";

const proof = ["Operational intelligence", "Verified evidence", "Policy-controlled execution", "Real-time asset context"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 pc-grid-lines [mask-image:linear-gradient(to_bottom,black,transparent_78%)] opacity-55" />
      <div className="pointer-events-none absolute -right-36 top-8 size-[620px] rounded-full bg-[#E8F3EC] blur-3xl" />
      <div className="pointer-events-none absolute -left-36 bottom-0 size-[430px] rounded-full bg-[#F0F5F1] blur-3xl" />

      <div className="pc-shell relative grid min-h-[760px] items-center gap-10 py-14 sm:py-16 lg:grid-cols-[.88fr_1.12fr] lg:py-20 xl:min-h-[810px]">
        <div className="mx-auto max-w-[670px] text-center lg:mx-0 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E0] bg-[#F3F8F5] px-3 py-2 text-xs font-semibold text-[#17613F] shadow-sm">
            <ShieldCheck className="size-4" /> Secure · governed · onchain-ready
          </div>

          <h1 className="pc-title mt-7 text-[46px] sm:text-[60px] lg:text-[68px] xl:text-[74px]">
            AI Copilot for <span className="text-[var(--green)]">renewable infrastructure.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 text-[#5F6963] sm:text-[18px] sm:leading-8 lg:mx-0">
            Monitor assets, analyze operational data, review evidence, and coordinate governed workflows from one intelligent workspace built for energy operations.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button href="/get-started" arrow className="min-h-12 min-w-44">Get Started</Button>
            <Button href="/product" variant="secondary" className="min-h-12 min-w-44">Explore Product</Button>
          </div>

          <div className="mt-8 grid gap-2.5 text-left text-sm text-[#536059] sm:grid-cols-2">
            {proof.map((item) => (
              <span key={item} className="flex min-h-10 items-center gap-2 rounded-xl border border-[#E8ECE9] bg-white/72 px-3 backdrop-blur-sm">
                <CheckCircle2 className="size-4 shrink-0 text-[var(--success)]" />{item}
              </span>
            ))}
          </div>

          <a href="#dashboard" className="mx-auto mt-7 inline-flex items-center gap-2 text-xs font-bold text-[var(--green)] transition hover:gap-3 lg:mx-0">
            See the Command Center <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-[10%] hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[10px] font-bold text-[#486055] shadow-lg backdrop-blur md:flex">
            <Sparkles className="size-3.5 text-[var(--green)]" /> Live operational context
          </div>
          <PhoneMockups />
        </div>
      </div>
    </section>
  );
}
