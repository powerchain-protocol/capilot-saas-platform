"use client";

import { CheckCircle2, FileCheck2, Radio, ShieldCheck } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatSettings, type ChatSettingsValue } from "@/components/chat/chat-settings";
import { SavedPrompts } from "@/components/messages/saved-prompts";
import { PwrcIcon } from "@/components/brand/pwrc-icon";
import { useToast } from "@/components/ui/toast";
import { connectChatRealtime, powerChainApi, PowerChainApiError, type ApiMessage, type ChatWsEvent } from "@/lib/powerchain";
import type { ChatMessage, MessageAction } from "@/types/messages";
import type { PromptDefinition } from "@/types/prompts";
import type { CreditReceipt } from "@/types/credits";

const defaultSettings: ChatSettingsValue = {
  concise: true,
  includeEvidence: true,
  includeSuggestedActions: true,
};

function toChatMessage(message: ApiMessage): ChatMessage | null {
  if (message.role !== "user" && message.role !== "assistant" && message.role !== "system") return null;
  return { id: message.id, role: message.role, content: message.content, createdAt: message.createdAt, status: "sent" };
}

function isApiMessage(value: unknown): value is ApiMessage {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string"
    && typeof record.chatId === "string"
    && typeof record.workspaceId === "string"
    && typeof record.userId === "string"
    && (record.role === "user" || record.role === "assistant" || record.role === "system")
    && typeof record.content === "string"
    && typeof record.createdAt === "string";
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
}

export function CopilotChat() {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [actions, setActions] = useState<MessageAction[]>([]);
  const [mode, setMode] = useState<"managed" | "demo">("demo");
  const [transport, setTransport] = useState<"connecting" | "connected" | "polling" | "closed">("connecting");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [settings, setSettings] = useState<ChatSettingsValue>(defaultSettings);
  const [lastReceipt, setLastReceipt] = useState<CreditReceipt | null>(null);
  const [creditAvailable, setCreditAvailable] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      try {
        const chats = await powerChainApi.listChats();
        const chat = chats[0] ?? await powerChainApi.createChat("PowerChain Copilot");
        const [history, credits] = await Promise.all([
          powerChainApi.getChat(chat.id),
          powerChainApi.getCredits(),
        ]);
        if (!active) return;
        setChatId(chat.id);
        setCreditAvailable(credits.account.available);
        setLastReceipt(credits.latestReceipt);
        setMessages(history.messages.map(toChatMessage).filter((message): message is ChatMessage => message !== null));
      } catch (reason) {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Unable to load conversation.");
      } finally {
        if (active) setLoadingHistory(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!chatId) return;
    return connectChatRealtime(chatId, {
      onStatus: setTransport,
      onEvent: (event: ChatWsEvent) => {
        if (event.type === "chat.receipt") {
          const payload = event.payload as CreditReceipt;
          if (payload && typeof payload.id === "string" && typeof payload.quoteHash === "string") setLastReceipt(payload);
          return;
        }
        if (event.type !== "chat.message" || !isApiMessage(event.payload)) return;
        const converted = toChatMessage(event.payload);
        if (converted) setMessages((current) => mergeMessages(current, [converted]));
      },
      onFallbackMessages: (items) => {
        const converted = items.map(toChatMessage).filter((message): message is ChatMessage => message !== null);
        setMessages((current) => mergeMessages(current, converted));
      },
    });
  }, [chatId]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function choosePrompt(prompt: PromptDefinition): void {
    setDraft(prompt.prompt);
    requestAnimationFrame(() => textarea.current?.focus());
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const message = draft.trim();
    if (!message || loading || !chatId) return;
    const localId = `local-${Date.now()}`;
    setDraft("");
    setError("");
    setActions([]);
    setMessages((current) => [...current, { id: localId, role: "user", content: message, status: "sending", createdAt: new Date().toISOString() }]);
    setLoading(true);

    try {
      const result = await powerChainApi.sendChatMessage(chatId, message);
      const userMessage = toChatMessage(result.userMessage);
      const assistantMessage = toChatMessage(result.message);
      setMode(result.mode);
      setLastReceipt(result.billing.receipt);
      setCreditAvailable(result.billing.account.available);
      setActions(settings.includeSuggestedActions ? result.actions.map((action) => ({ label: action.label, href: action.href })) : []);
      setMessages((current) => {
        const withoutLocal = current.filter((item) => item.id !== localId);
        return mergeMessages(withoutLocal, [userMessage, assistantMessage].filter((item): item is ChatMessage => item !== null));
      });
    } catch (reason) {
      const messageText = reason instanceof Error ? reason.message : "Copilot request failed.";
      const insufficientCredits = reason instanceof PowerChainApiError && reason.code === "INSUFFICIENT_CREDITS";
      setMessages((current) => current.map((item) => item.id === localId ? { ...item, status: "failed" } : item));
      setError(messageText);
      toast({
        title: insufficientCredits ? "PWRC credits required" : "Copilot unavailable",
        description: messageText,
        tone: "error",
        ...(insufficientCredits ? { action: { label: "View credits", onClick: () => { window.location.href = "/dashboard/credits"; } } } : {}),
      });
    } finally {
      setLoading(false);
    }
  }

  const transportLabel = transport === "connected" ? "Live" : transport === "polling" ? "Polling" : transport === "connecting" ? "Connecting" : "Offline";

  return (
    <div className="mx-auto grid max-w-[1280px] gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="pc-card flex min-h-[720px] flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]"><ShieldCheck className="size-5" /></span><div className="min-w-0"><h1 className="truncate text-sm font-bold">PowerChain Copilot</h1><p className="truncate text-[10px] text-[var(--muted)]">Operational analysis · governed workspace context</p></div></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-[#DCE8E0] bg-[#EFF7F1] px-3 py-1 text-[9px] font-bold text-[var(--success)] sm:inline-flex"><Radio className="size-3" />{transportLabel}</span><span className="hidden rounded-full border border-[#DCE8E0] bg-[#EFF7F1] px-3 py-1 text-[9px] font-bold text-[var(--success)] md:inline-flex">{mode === "managed" ? "Managed AI" : "Demo reasoning"}</span><ChatSettings value={settings} onChange={setSettings} /></div>
        </header>
        <ChatInterface messages={messages} actions={actions} draft={draft} loading={loading} loadingHistory={loadingHistory} error={error} textareaRef={textarea} bottomRef={bottom} onDraftChange={setDraft} onSuggestion={choosePrompt} onSubmit={submit} />
      </section>

      <aside className="space-y-4">
        <div className="pc-card p-5"><h2 className="text-xs font-bold">Execution boundary</h2><div className="mt-4 space-y-3 text-[11px] leading-5 text-[var(--muted)]"><p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--success)]" />Copilot can analyze and recommend. Approval remains explicit.</p><p className="flex gap-2"><PwrcIcon size={17} />Completed response: 10,000 PWRC credits.{creditAvailable ? ` ${BigInt(creditAvailable).toLocaleString("en-US")} available.` : ""}</p>{lastReceipt ? <p className="flex gap-2"><FileCheck2 className="mt-0.5 size-4 shrink-0 text-[var(--green)]"/><span>Settled receipt <b className="font-mono text-[var(--ink)]">{lastReceipt.id}</b> · non-transferable audit evidence.</span></p> : null}</div></div>
        <div className="pc-card p-5"><h2 className="text-xs font-bold">Saved prompts</h2><div className="mt-3"><SavedPrompts onSelect={choosePrompt} /></div></div>
        <div className="pc-card p-5"><div className="flex items-center gap-2 text-xs font-bold"><CheckCircle2 className="size-4 text-[var(--success)]" />Context-aware</div><p className="mt-2 text-[10px] leading-5 text-[var(--muted)]">Responses use the authenticated workspace boundary rather than client-supplied balances, approvals, or settlement state.</p></div>
      </aside>
    </div>
  );
}
