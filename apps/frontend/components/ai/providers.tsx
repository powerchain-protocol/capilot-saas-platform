import { Bot, Cpu, Orbit, ServerCog, Sparkles, Waves } from "lucide-react";
import { AI_PROVIDERS, type AiProviderId } from "@powerchain/ai";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const providerIcons: Record<AiProviderId, typeof Bot> = {
  powerchain: Orbit,
  openai: Sparkles,
  anthropic: Bot,
  gemini: Waves,
  deepseek: Cpu,
  ollama: ServerCog
};

export function AiProviders({ enabled }: { enabled?: readonly AiProviderId[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {AI_PROVIDERS.map((provider) => {
        const Icon = providerIcons[provider.id];
        const active = enabled ? enabled.includes(provider.id) : provider.enabledByDefault;
        return (
          <Card key={provider.id} className="p-4">
            <div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[var(--green-soft)] text-[var(--green)]"><Icon className="size-4" /></span><Badge className={active ? "border-[#CFE2D5] bg-[#EDF7F0] text-[var(--success)]" : undefined}>{active ? "Available" : "Optional"}</Badge></div>
            <h3 className="mt-4 text-sm font-semibold">{provider.label}</h3><p className="mt-1 text-xs leading-5 text-[var(--muted)]">{provider.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
