"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ContactForm() {
  const params = useSearchParams();
  const { toast } = useToast();
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        company: form.get("company"),
        message: form.get("message"),
        intent: params.get("intent") || "general",
      }),
    });
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      const message = json?.error?.message || "Unable to send your request.";
      setState("idle");
      setError(message);
      toast({ title: "Request not sent", description: message, tone: "error" });
      return;
    }
    setState("sent");
    toast({ title: "Request received", description: "PowerChain saved your request for follow-up.", tone: "success" });
  }

  if (state === "sent") {
    return (
      <div className="pc-card p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-[#167A4A]" />
        <h2 className="mt-4 text-2xl font-bold">Request received.</h2>
        <p className="mt-2 text-sm text-[#66706A]">Your request is stored in the PowerChain SaaS backend and ready for follow-up.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="pc-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Name" />
        <Field name="email" label="Work email" type="email" />
        <Field name="company" label="Company" />
        <label className="text-xs font-semibold sm:col-span-2">
          How can we help?
          <textarea name="message" required minLength={10} rows={6} className="mt-2 w-full resize-none rounded-xl border border-[#D7DED9] p-4 font-normal outline-none focus:border-[#1E6B4B]" />
        </label>
      </div>
      {error ? <p className="mt-4 rounded-xl bg-[#FFF3F2] px-3 py-2 text-xs text-[#A73535]">{error}</p> : null}
      <button type="submit" disabled={state === "loading"} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#143C2E] text-sm font-bold text-white disabled:opacity-60">
        {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
        Send request
      </button>
    </form>
  );
}

function Field({ name, label, type = "text" }: { name: string; label: string; type?: string }) {
  return (
    <label className="text-xs font-semibold">
      {label}
      <input name={name} type={type} required={name !== "company"} className="mt-2 h-12 w-full rounded-xl border border-[#D7DED9] px-4 font-normal outline-none focus:border-[#1E6B4B]" />
    </label>
  );
}
