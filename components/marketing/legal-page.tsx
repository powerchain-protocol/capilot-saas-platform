import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { legalDisclaimer, type LegalDocument } from "@/data/legal";

export function LegalPage({ document }: { document: LegalDocument }) {
  return <><Navbar /><main className="bg-white py-16 sm:py-24"><article className="pc-shell max-w-4xl"><p className="pc-kicker">Legal</p><h1 className="mt-4 text-4xl font-bold tracking-[-.05em] sm:text-5xl">{document.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#5F6963]">{document.description}</p><p className="mt-3 text-xs font-medium text-[#8B948E]">Last updated {document.updated}</p><div className="mt-10 space-y-8">{document.sections.map((section) => <section key={section.heading} className="border-t border-[#E6EAE7] pt-7"><h2 className="text-lg font-bold tracking-[-.025em] text-[#1B241E]">{section.heading}</h2><p className="mt-3 text-sm leading-7 text-[#626D66]">{section.body}</p></section>)}</div><aside className="mt-10 flex gap-3 rounded-2xl border border-[#E1E6E2] bg-[#F7F9F7] p-5"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#8A6A2B]" /><div><p className="text-xs font-bold text-[#354039]">Product limitation notice</p><p className="mt-1 text-xs leading-5 text-[#68736C]">{legalDisclaimer}</p><Link href="/legal/disclaimer" className="mt-2 inline-flex text-xs font-bold text-[#17613F] hover:underline">Read the full product disclaimer</Link></div></aside><p className="mt-8 text-[11px] leading-5 text-[#929A95]">Production operators should have final legal terms, privacy disclosures, regional requirements, commercial commitments, and subprocessors reviewed for the actual deployment before public launch.</p></article></main><Footer /></>;
}
