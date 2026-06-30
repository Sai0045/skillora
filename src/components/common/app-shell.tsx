"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Bell, BookOpen, GraduationCap, Home, Menu, Moon, Search, Sun, UserRound, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/common/button";
import { useLearning } from "@/hooks/use-learning";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const navItems = [
  { href: routes.dashboard, label: "Dashboard", icon: Home },
  { href: routes.courses, label: "Courses", icon: BookOpen },
  { href: routes.certificates, label: "Certificates", icon: GraduationCap },
  { href: routes.profile, label: "Profile", icon: UserRound },
];

const currentPathKey = "skillora.current-path";
const previousPathKey = "skillora.previous-path";

function isActive(pathname: string, href: string) {
  if (href === routes.dashboard) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function useResolvedDarkMode(theme: "system" | "light" | "dark") {
  const [resolvedDarkMode, setResolvedDarkMode] = useState(theme === "dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      setResolvedDarkMode(theme === "system" ? media.matches : theme === "dark");
    };
    const timer = window.setTimeout(syncTheme, 0);
    media.addEventListener("change", syncTheme);

    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", syncTheme);
    };
  }, [theme]);

  return resolvedDarkMode;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, updateUser } = useLearning();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkMode = useResolvedDarkMode(state.user.theme);
  const canShowBack = pathname !== routes.dashboard;

  useEffect(() => {
    const currentPath = window.sessionStorage.getItem(currentPathKey);

    if (currentPath && currentPath !== pathname) {
      window.sessionStorage.setItem(previousPathKey, currentPath);
    }

    window.sessionStorage.setItem(currentPathKey, pathname);
  }, [pathname]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `${routes.courses}?q=${encodeURIComponent(trimmed)}` : routes.courses);
    setMobileOpen(false);
  }

  function toggleTheme() {
    updateUser({ theme: darkMode ? "light" : "dark" });
  }

  function goBack() {
    const previousPath = window.sessionStorage.getItem(previousPathKey);
    const target = previousPath && previousPath !== pathname ? previousPath : routes.dashboard;
    router.push(target);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-control)] focus:bg-[var(--accent)] focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link href={routes.dashboard} className="flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-[var(--brand-coral)] text-sm font-bold text-white shadow-sm">
              S
            </span>
            <span className="hidden font-semibold tracking-tight sm:inline">Skillora</span>
          </Link>

          {canShowBack ? (
            <Button variant="outline" size="sm" className="hidden lg:inline-flex" onClick={goBack} aria-label="Go back">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          ) : null}

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={submitSearch} className="ml-auto hidden w-full max-w-xs items-center md:flex">
            <label className="sr-only" htmlFor="global-course-search">
              Search courses
            </label>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
              <input
                id="global-course-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
                placeholder="Search courses"
              />
            </div>
          </form>

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-5" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            {darkMode ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
          </Button>
          <Link
            href={routes.profile}
            className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-muted)] text-sm font-semibold text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            aria-label="Open profile"
          >
            {state.user.avatarInitials}
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </Button>
        </div>

        {mobileOpen ? (
          <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 lg:hidden">
            <form onSubmit={submitSearch} className="mb-4">
              <label className="sr-only" htmlFor="mobile-course-search">
                Search courses
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
                <input
                  id="mobile-course-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
                  placeholder="Search courses"
                />
              </div>
            </form>
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {canShowBack ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-muted)]"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              >
                {darkMode ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm font-medium",
                      isActive(pathname, item.href)
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface-muted)]",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
