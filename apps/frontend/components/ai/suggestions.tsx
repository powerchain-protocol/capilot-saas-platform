"use client";

import { BookmarkPlus, Sparkles } from "lucide-react";
import { PROMPT_LIBRARY } from "@/lib/prompts/library";
import type { PromptDefinition } from "@/types/prompts";
import { useToast } from "@/components/ui/toast";

const STORAGE_KEY = "powerchain-saved-prompts";

export type SuggestionsProps = {
  onSelect: (prompt: PromptDefinition) => void;
  limit?: number;
  category?: PromptDefinition["category"];
};

function savePrompt(id: string): void {
  let current: string[] = [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed)) current = parsed.filter((value): value is string => typeof value === "string");
  } catch {
    current = [];
  }
  const next = Array.from(new Set([...current, id]));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("powerchain:saved-prompts"));
}

export function Suggestions({ onSelect, limit = 4, category }: SuggestionsProps) {
  const { toast } = useToast();
  const prompts = PROMPT_LIBRARY.filter((prompt) => !category || prompt.category === category).slice(0, limit);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="group flex min-h-16 items-stretch rounded-xl border border-[var(--border)] bg-[var(--surface)] transition hover:border-[#AFC0B4] hover:bg-[var(--surface-soft)]">
          <button type="button" onClick={() => onSelect(prompt)} className="min-w-0 flex-1 px-3.5 py-3 text-left">
            <span className="flex items-center gap-2 text-[11px] font-semibold text-[var(--ink)]"><Sparkles className="size-3.5 text-[var(--green)]" />{prompt.title}</span>
            <span className="mt-1 block text-[10px] leading-4 text-[var(--muted)]">{prompt.description}</span>
          </button>
          <button type="button" onClick={() => { savePrompt(prompt.id); toast({ title: "Prompt saved", description: prompt.title, tone: "success" }); }} className="m-2 grid size-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--green)]" aria-label={`Save ${prompt.title}`}><BookmarkPlus className="size-3.5" /></button>
        </div>
      ))}
    </div>
  );
}
