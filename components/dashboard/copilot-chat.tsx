"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, CheckCircle2, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { useToast } from "@/components/ui/toast";

type Msg = { id: string; role: "user" | "assistant"; content: string };
type Action = { label: string; href: string };

const suggested = [
  "Analyze Solar Farm 45 performance",
  "Show pending approvals",
  "Summarize treasury boundaries",
  "Which assets need attention?",
];

export function CopilotChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [mode, setMode] = useState<"managed" | "demo">("demo");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/copilot")
      .then((response) => response.json())
      .then((json) => { if (json.ok) setMessages(json.data); else setError(json?.error?.message || "Unable to load conversation."); })
      .catch(() => setError("Unable to load conversation."))
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => bottom.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  function chooseSuggestion(prompt: string) {
    setDraft(prompt);
    requestAnimationFrame(() => textarea.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || loading) return;
    setDraft("");
    setError("");
    setActions([]);
    setMessages((current) => [...current, { id: `local-${Date.now()}`, role: "user", content: message }]);
    setLoading(true);

    const response = await fetch("/api/copilot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const json = await response.json().catch(() => null);
    setLoading(false);
    if (!response.ok) {
      const messageText = json?.error?.message || "Copilot request failed.";
      setError(messageText);
      toast({ title: "Copilot unavailable", description: messageText, tone: "error" });
      return;
    }
    setMode(json.data.mode);
    setActions(json.data.actions || []);
    setMessages((current) => [...current, { id: `assistant-${Date.now()}`, role: "assistant", content: json.data.text }]);
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="pc-card flex min-h-[720px] flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-[#E1E6E2] bg-white p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#E7F1EB] text-[#1E6B4B]"><Bot className="size-5" /></span>
            <div className="min-w-0"><h1 className="truncate text-sm font-bold">PowerChain Copilot</h1><p className="truncate text-[10px] text-[#7B8580]">Operational analysis · governed workspace context</p></div>
          </div>
          <span className="shrink-0 rounded-full border border-[#DCE8E0] bg-[#EFF7F1] px-3 py-1 text-[8px] font-bold text-[#167A4A] sm:text-[9px]">{mode === "managed" ? "Managed AI" : "Demo reasoning"}</span>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#FCFDFC_0%,#F8FAF8_100%)] p-4 sm:p-6">
          {loadingHistory ? <ConversationSkeleton /> : null}
          {!loadingHistory && messages.length === 0 ? (
            <div className="mx-auto mt-12 max-w-lg text-center sm:mt-20">
              <span className="mx-auto grid size-14 place-items-center rounded-[20px] border border-[#DCE5DF] bg-white shadow-sm"><Sparkles className="size-6 text-[#1E6B4B]" /></span>
              <h2 className="mt-5 text-2xl font-bold tracking-[-.035em]">Ask about your workspace.</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66706A]">Analyze assets, review approvals, inspect operational context, or prepare a structured report.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {suggested.map((prompt) => <button key={prompt} type="button" onClick={() => chooseSuggestion(prompt)} className="min-h-12 rounded-xl border border-[#DDE3DE] bg-white px-3 text-left text-[11px] font-semibold text-[#425048] transition hover:border-[#AFC0B4] hover:bg-[#F4F8F5]">{prompt}</button>)}
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[90%] rounded-2xl px-4 py-3.5 text-sm leading-6 sm:max-w-[82%] ${message.role === "user" ? "rounded-br-md bg-[#E4F0E8] text-[#183329]" : "rounded-bl-md border border-[#DDE3DE] bg-white text-[#2B3730] shadow-sm"}`}>
                {message.role === "assistant" ? <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.1em] text-[#1E6B4B]"><Bot className="size-3" /> Copilot</div> : null}
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {loading ? <div className="flex max-w-[86%] items-center gap-2 rounded-2xl rounded-bl-md border border-[#DDE3DE] bg-white p-4 text-sm text-[#66706A] shadow-sm"><Loader2 className="size-4 animate-spin" />Analyzing workspace context…</div> : null}
          {error ? <p role="alert" className="rounded-xl border border-[#F0D5D3] bg-[#FFF5F4] px-3 py-2 text-xs text-[#A73535]">{error}</p> : null}
          <div ref={bottom} />
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-t border-[#EEF1EF] bg-white px-4 py-3">
            {actions.map((action) => <Link key={`${action.href}-${action.label}`} href={action.href} className="rounded-lg border border-[#D9DEDA] bg-white px-3 py-2 text-[10px] font-semibold transition hover:border-[#AAB8AE] hover:bg-[#F7F9F7]">{action.label}</Link>)}
          </div>
        ) : null}

        <form onSubmit={submit} className="border-t border-[#E1E6E2] bg-white p-3 sm:p-4">
          <div className="rounded-2xl border border-[#D5DDD7] bg-white p-2 transition focus-within:border-[#1E6B4B] focus-within:shadow-[0_0_0_4px_rgba(30,107,75,.06)]">
            <textarea ref={textarea} value={draft} onChange={(event) => setDraft(event.target.value)} name="message" maxLength={2000} rows={2} className="min-h-12 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none" placeholder="Ask about assets, approvals, energy, or operations…" aria-label="Message PowerChain Copilot" />
            <div className="flex items-center justify-between gap-3 px-1 pb-1">
              <span className={`text-[9px] ${draft.length > 1800 ? "font-semibold text-[#9D6419]" : "text-[#939B96]"}`}>{draft.length.toLocaleString()} / 2,000</span>
              <button disabled={loading || !draft.trim()} aria-label="Send message" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#143C2E] px-4 text-xs font-bold text-white transition hover:bg-[#0F3327] disabled:opacity-40"><Send className="size-3.5" />Send</button>
            </div>
          </div>
          <p className="mt-2 text-center text-[9px] leading-4 text-[#8A938D]">Copilot can analyze and recommend. Verify operationally significant decisions before approval or execution.</p>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="pc-card p-5">
          <h2 className="text-xs font-bold">Execution boundary</h2>
          <div className="mt-4 space-y-3 text-[11px] leading-5 text-[#66706A]">
            <p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#167A4A]" />Copilot can analyze and recommend. Approval remains explicit.</p>
            <p className="flex gap-2"><PwrcIcon size={17} />Representative completed-response charge: 10,000 PWRC.</p>
          </div>
        </div>
        <div className="pc-card p-5">
          <h2 className="text-xs font-bold">Suggested prompts</h2>
          <div className="mt-3 grid gap-2">
            {suggested.map((prompt) => <button key={prompt} type="button" onClick={() => chooseSuggestion(prompt)} className="rounded-xl border border-[#E1E6E2] bg-[#FAFBFA] px-3 py-2.5 text-left text-[10px] font-semibold text-[#56625B] transition hover:border-[#B9C6BC] hover:bg-[#F1F6F3]">{prompt}</button>)}
          </div>
        </div>
        <div className="pc-card p-5">
          <div className="flex items-center gap-2 text-xs font-bold"><CheckCircle2 className="size-4 text-[#167A4A]" />Context-aware</div>
          <p className="mt-2 text-[10px] leading-5 text-[#7A847E]">Responses use the authenticated workspace boundary rather than client-supplied balances, approvals, or settlement state.</p>
        </div>
      </aside>
    </div>
  );
}

function ConversationSkeleton() {
  return <div className="space-y-4" aria-hidden="true"><div className="pc-skeleton ml-auto h-16 w-2/3 rounded-2xl" /><div className="pc-skeleton h-28 w-4/5 rounded-2xl" /><div className="pc-skeleton ml-auto h-14 w-1/2 rounded-2xl" /></div>;
}
