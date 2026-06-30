import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-4 text-xs font-medium text-[var(--muted)]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        aria-label={label ?? "Progress"}
      >
        <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-200" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
