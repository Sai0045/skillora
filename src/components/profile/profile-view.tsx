"use client";

import { RefreshCw, Save, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { courseCategories } from "@/data/courses";
import { useLearning } from "@/hooks/use-learning";
import type { ThemePreference } from "@/types/lms";

export function ProfileView() {
  const { state, updateUser, resetData } = useLearning();
  const [name, setName] = useState(state.user.name);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(state.user.weeklyGoalMinutes.toString());
  const [preferredCategories, setPreferredCategories] = useState(state.user.preferredCategories);
  const [reducedMotion, setReducedMotion] = useState(state.user.reducedMotion);
  const [theme, setTheme] = useState<ThemePreference>(state.user.theme);
  const [message, setMessage] = useState("");

  function toggleCategory(category: string) {
    setPreferredCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedGoal = Number(weeklyGoalMinutes);
    updateUser({
      name: name.trim() || state.user.name,
      weeklyGoalMinutes: Number.isFinite(parsedGoal) && parsedGoal > 0 ? parsedGoal : state.user.weeklyGoalMinutes,
      preferredCategories,
      reducedMotion,
      theme,
    });
    setMessage("Preferences saved locally.");
  }

  function reset() {
    if (window.confirm("Reset all local Skillora demo data?")) {
      resetData();
      setMessage("Local demo data reset.");
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <Badge tone="accent">Profile</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Learning preferences</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          This prototype uses local browser storage only. Do not enter real personal information.
        </p>
      </section>

      {message ? <p className="text-sm text-[var(--success)]" aria-live="polite">{message}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold text-[var(--accent)]">
              {state.user.avatarInitials}
            </span>
            <div>
              <h2 className="text-xl font-semibold">Demo learner</h2>
              <p className="text-sm text-[var(--muted)]">{state.user.role}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Weekly goal in minutes
              <input
                inputMode="numeric"
                value={weeklyGoalMinutes}
                onChange={(event) => setWeeklyGoalMinutes(event.target.value)}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                value={state.user.email}
                disabled
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm text-[var(--muted)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Timezone
              <input
                value={state.user.timezone}
                disabled
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface-muted)] px-3 text-sm text-[var(--muted)]"
              />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Preferred categories</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {courseCategories.map((category) => (
                <label
                  key={category}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-[var(--border)] px-3 text-sm hover:bg-[var(--surface-muted)]"
                >
                  <input
                    type="checkbox"
                    checked={preferredCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="size-4 accent-[var(--accent)]"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex min-h-11 items-center justify-between gap-4 rounded-[var(--radius-control)] border border-[var(--border)] px-3 text-sm font-medium">
              Reduced motion
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                className="size-4 accent-[var(--accent)]"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Theme
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as ThemePreference)}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button type="submit">
              <Save className="size-4" aria-hidden="true" />
              Save preferences
            </Button>
            <Button variant="danger" onClick={reset}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Reset data
            </Button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <UserRound className="mb-4 size-5 text-[var(--accent)]" aria-hidden="true" />
            <h2 className="font-semibold">Local demo account</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Skillora does not authenticate, sync, or connect to any account in this assignment prototype.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <ShieldCheck className="mb-4 size-5 text-[var(--success)]" aria-hidden="true" />
            <h2 className="font-semibold">Stored in this browser</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Progress, notes, bookmarks, preferences, quiz attempts, and certificates use versioned local storage.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <SlidersHorizontal className="mb-4 size-5 text-[var(--warning)]" aria-hidden="true" />
            <h2 className="font-semibold">Demo behavior</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Resetting data restores the seeded Sairaj Abhale learner profile and sample progress.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
