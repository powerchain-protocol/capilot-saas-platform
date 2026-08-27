"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Laptop }
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-1" aria-label="Color theme">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`grid min-h-9 place-items-center rounded-lg transition ${compact ? "w-9" : "grid-cols-[auto_1fr] gap-1.5 px-2.5"} ${theme === value ? "bg-[var(--surface)] text-[var(--forest)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
          aria-pressed={theme === value}
          title={label}
        >
          <Icon className="size-3.5" />
          {!compact ? <span className="text-[10px] font-semibold">{label}</span> : null}
        </button>
      ))}
    </div>
  );
}
