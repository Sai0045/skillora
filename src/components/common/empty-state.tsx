import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--accent)]">
        {icon}
      </div>
      <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
