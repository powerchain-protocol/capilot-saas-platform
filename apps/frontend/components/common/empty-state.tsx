import type { LucideIcon } from "lucide-react";
import { CTA } from "@/components/common/cta";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return <div className="mx-auto max-w-md py-12 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--green-soft)] text-[var(--green)]"><Icon className="size-5" /></span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>{action ? <CTA href={action.href} label={action.label} className="mt-5" /> : null}</div>;
}
