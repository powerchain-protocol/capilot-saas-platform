"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Globe2, MoreVertical, ShieldCheck } from "lucide-react";
import { useRuntimeContext } from "@/context";
import { useToast } from "@/components/ui/toast";

type InstallPromptChoice = { outcome: "accepted" | "dismissed"; platform: string };
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallPromptChoice>;
};

export function PwaInstaller() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const { isSecureContext, isStandalone } = useRuntimeContext();
  const { toast } = useToast();

  useEffect(() => {
    setInstalled(isStandalone);
    const onPrompt = (event: Event): void => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = (): void => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isStandalone]);

  async function install(): Promise<void> {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    toast({
      title: choice.outcome === "accepted" ? "Installation started" : "Installation cancelled",
      description: choice.outcome === "accepted" ? "Your browser is adding PowerChain Copilot to this device." : "You can install PowerChain later from the browser menu.",
      tone: choice.outcome === "accepted" ? "success" : "info",
    });
  }

  return (
    <section className="pc-card p-5 sm:p-6" aria-labelledby="pwa-installer-title">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]">
          <Globe2 className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--green)]">Progressive Web App</span>
            {installed ? <span className="inline-flex items-center gap-1 rounded-full bg-[var(--green-soft)] px-2 py-1 text-[9px] font-bold text-[var(--success)]"><CheckCircle2 className="size-3" /> Installed</span> : null}
          </div>
          <h2 id="pwa-installer-title" className="mt-2 text-xl font-bold tracking-[-.03em]">Install the web app</h2>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Use PowerChain in a standalone app window with the same authenticated SaaS workspace.</p>
        </div>
      </div>

      {installed ? (
        <div className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 text-sm font-semibold text-[var(--success)]">
          <CheckCircle2 className="size-4" aria-hidden="true" /> Installed on this device
        </div>
      ) : promptEvent ? (
        <button type="button" onClick={() => void install()} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--forest)] px-5 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-[var(--forest-strong)]">
          <Download className="size-4" aria-hidden="true" /> Install PowerChain PWA
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--ink)]"><MoreVertical className="size-4" aria-hidden="true" /> Install from your browser menu</div>
          <p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">Open the browser menu and choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>. Browser wording varies by platform.</p>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-[var(--muted-2)]">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{isSecureContext ? "Secure context detected." : "PWA installation normally requires HTTPS or localhost."} No private keys are stored by the installer.</span>
      </div>
    </section>
  );
}
