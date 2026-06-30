import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--brand-coral)] text-white shadow-sm hover:bg-[var(--brand-coral-strong)]",
  secondary: "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
  danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger-strong)]",
  outline: "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
  icon: "size-11 p-0",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:cursor-not-allowed disabled:opacity-50";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

export function LinkButton({ className, variant = "primary", size = "md", href, children, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </Link>
  );
}
