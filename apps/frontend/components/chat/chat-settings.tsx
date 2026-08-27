"use client";

import { Settings2 } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@/components/ui/modals/dialog";

export type ChatSettingsValue = {
  concise: boolean;
  includeEvidence: boolean;
  includeSuggestedActions: boolean;
};

export function ChatSettings({ value, onChange }: { value: ChatSettingsValue; onChange: (value: ChatSettingsValue) => void }) {
  const [open, setOpen] = useState(false);
  const options: Array<{ key: keyof ChatSettingsValue; label: string; description: string }> = [
    { key: "concise", label: "Concise responses", description: "Prefer compact operational summaries." },
    { key: "includeEvidence", label: "Evidence context", description: "Surface verification and provenance notes when available." },
    { key: "includeSuggestedActions", label: "Suggested actions", description: "Show safe navigation and review actions after responses." }
  ];
  return <><button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]" aria-label="Chat settings"><Settings2 className="size-4" /></button><Dialog open={open} onOpenChange={setOpen} title="Chat settings" description="Control presentation preferences. Execution policy is not configurable here."><div className="space-y-3">{options.map((option) => <label key={option.key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--surface-soft)]"><input type="checkbox" checked={value[option.key]} onChange={(event) => onChange({ ...value, [option.key]: event.target.checked })} className="mt-1 size-4 accent-[#143C2E]" /><span><span className="block text-sm font-semibold">{option.label}</span><span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{option.description}</span></span></label>)}</div></Dialog></>;
}
