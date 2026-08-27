"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PROMPT_LIBRARY } from "@/lib/prompts/library";
import type { PromptDefinition } from "@/types/prompts";

const STORAGE_KEY = "powerchain-saved-prompts";

function readSavedIds(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function SavedPrompts({ onSelect }: { onSelect: (prompt: PromptDefinition) => void }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = (): void => setIds(readSavedIds());
    sync();
    window.addEventListener("powerchain:saved-prompts", sync);
    return () => window.removeEventListener("powerchain:saved-prompts", sync);
  }, []);

  const saved = ids.map((id) => PROMPT_LIBRARY.find((prompt) => prompt.id === id)).filter((prompt): prompt is PromptDefinition => Boolean(prompt));

  function remove(id: string): void {
    const next = ids.filter((value) => value !== id);
    setIds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  if (saved.length === 0) return <p className="text-xs leading-5 text-[var(--muted)]">No saved prompts yet. Save reusable operational requests from the prompt library.</p>;

  return <div className="grid gap-2">{saved.map((prompt) => <div key={prompt.id} className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2"><button type="button" onClick={() => onSelect(prompt)} className="min-w-0 flex-1 rounded-lg px-2 py-1.5 text-left hover:bg-[var(--surface-soft)]"><span className="flex items-center gap-2 text-[11px] font-semibold"><Bookmark className="size-3.5 text-[var(--green)]" />{prompt.title}</span><span className="mt-1 block truncate text-[9px] text-[var(--muted)]">{prompt.prompt}</span></button><button type="button" onClick={() => remove(prompt.id)} className="grid size-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--danger)]" aria-label={`Remove ${prompt.title}`}><Trash2 className="size-3.5" /></button></div>)}</div>;
}
