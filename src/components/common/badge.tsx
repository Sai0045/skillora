import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "accent" | "warning";
  className?: string;
}) {
  const tones = {
    neutral: "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
    success: "border-[var(--success-soft)] bg-[var(--success-soft)] text-[var(--success)]",
    accent: "border-[var(--accent-soft)] bg-[var(--accent-soft)] text-[var(--accent)]",
    warning: "border-[var(--brand-coral-soft)] bg-[var(--brand-coral-soft)] text-[var(--brand-coral-strong)]",
  };

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
