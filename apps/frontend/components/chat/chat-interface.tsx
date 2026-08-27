"use client";

import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { type FormEvent, type RefObject } from "react";
import type { ChatMessage, MessageAction } from "@/types/messages";
import type { PromptDefinition } from "@/types/prompts";
import { Suggestions } from "@/components/ai/suggestions";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";

export type ChatInterfaceProps = {
  messages: ChatMessage[];
  actions: MessageAction[];
  draft: string;
  loading: boolean;
  loadingHistory: boolean;
  error: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  onDraftChange: (value: string) => void;
  onSuggestion: (prompt: PromptDefinition) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function ChatInterface(props: ChatInterfaceProps) {
  const { messages, actions, draft, loading, loadingHistory, error, textareaRef, bottomRef, onDraftChange, onSuggestion, onSubmit } = props;
  return <>
    <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--surface-raised)] p-4 sm:p-6">
      {loadingHistory ? <ChatSkeleton /> : null}
      {!loadingHistory && messages.length === 0 ? <div className="mx-auto mt-12 max-w-lg text-center sm:mt-20"><span className="mx-auto grid size-14 place-items-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-sm"><Sparkles className="size-6 text-[var(--green)]" /></span><h2 className="mt-5 text-2xl font-bold tracking-[-.035em]">Ask about your workspace.</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Analyze assets, review approvals, inspect operational context, or prepare a structured report.</p><div className="mt-6"><Suggestions onSelect={onSuggestion} /></div></div> : null}
      {messages.map((message) => <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[90%] rounded-2xl px-4 py-3.5 text-sm leading-6 sm:max-w-[82%] ${message.role === "user" ? "rounded-br-md bg-[var(--green-soft)] text-[var(--ink)]" : "rounded-bl-md border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] shadow-sm"}`}>{message.role === "assistant" ? <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-[var(--green)]"><Bot className="size-3" /> Copilot</div> : null}<p className="whitespace-pre-wrap">{message.content}</p></div></div>)}
      {loading ? <div className="flex max-w-[86%] items-center gap-2 rounded-2xl rounded-bl-md border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)] shadow-sm"><Loader2 className="size-4 animate-spin" />Analyzing workspace context…</div> : null}
      {error ? <p role="alert" className="rounded-xl border border-[#F0D5D3] bg-[#FFF5F4] px-3 py-2 text-xs text-[#A73535]">{error}</p> : null}
      <div ref={bottomRef} />
    </div>
    {actions.length > 0 ? <div className="flex flex-wrap gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">{actions.map((action) => <a key={`${action.href}-${action.label}`} href={action.href} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[10px] font-semibold transition hover:bg-[var(--surface-soft)]">{action.label}</a>)}</div> : null}
    <form onSubmit={onSubmit} className="border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:p-4"><div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-2 transition focus-within:border-[var(--green)] focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--green)_8%,transparent)]"><textarea ref={textareaRef} value={draft} onChange={(event) => onDraftChange(event.target.value)} name="message" maxLength={2000} rows={2} className="min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--muted-2)]" placeholder="Ask about assets, approvals, energy, or operations…" aria-label="Message PowerChain Copilot" /><div className="flex items-center justify-between gap-3 px-1 pb-1"><span className={`text-[9px] ${draft.length > 1800 ? "font-semibold text-[#9D6419]" : "text-[var(--muted-2)]"}`}>{draft.length.toLocaleString()} / 2,000</span><button disabled={loading || !draft.trim()} aria-label="Send message" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--forest)] px-4 text-xs font-bold text-white transition hover:bg-[var(--forest-strong)] disabled:opacity-40"><Send className="size-3.5" />Send</button></div></div><p className="mt-2 text-center text-[9px] leading-4 text-[var(--muted-2)]">Copilot can analyze and recommend. Verify operationally significant decisions before approval or execution.</p></form>
  </>;
}
