import Link from "next/link";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

type InstallMethodCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  external?: boolean;
  className?: string;
};

export function InstallMethodCard({ title, description, href, icon: Icon, badge, external = false, className }: InstallMethodCardProps) {
  const content = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--green)] shadow-sm">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--ink)]">
          {title}
          {badge ? <span className="rounded-full bg-[var(--green-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--green)]">{badge}</span> : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{description}</span>
      </span>
      {external ? <ExternalLink className="size-4 shrink-0 text-[var(--muted-2)]" aria-hidden="true" /> : null}
    </>
  );

  const classes = cn(
    "flex min-h-20 items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition hover:-translate-y-px hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
    className,
  );

  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" className={classes}>{content}</a>;
  }
  return <Link href={href} className={classes}>{content}</Link>;
}
