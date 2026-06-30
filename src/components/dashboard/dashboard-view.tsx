"use client";

import Link from "next/link";
import { Award, BookMarked, CalendarDays, Clock3, Flame, Goal, GraduationCap, PlayCircle, Search } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { LinkButton } from "@/components/common/button";
import { CourseThumbnail } from "@/components/common/course-thumbnail";
import { ProgressBar } from "@/components/common/progress-bar";
import { CourseCard } from "@/components/course/course-card";
import {
  calculateCourseProgress,
  calculateLearningStats,
  getContinueLesson,
  getCourseLessons,
} from "@/domain/progress";
import { useLearning } from "@/hooks/use-learning";
import { formatDate, formatDuration, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Course } from "@/types/lms";

function metricLabel(value: number, label: string) {
  return (
    <span className="block">
      <strong className="text-2xl font-semibold text-[var(--foreground)]">{value}</strong>
      <span className="mt-1 block text-sm text-[var(--muted)]">{label}</span>
    </span>
  );
}

const activityColors = [
  "var(--accent)",
  "var(--brand-sky)",
  "var(--brand-lagoon)",
  "var(--brand-coral)",
  "var(--brand-plum)",
  "var(--brand-amber)",
  "var(--accent)",
];

export function DashboardView({ courses }: { courses: Course[] }) {
  const { state } = useLearning();
  const continueCourse = courses.find((course) => course.id === "frontend-foundations") ?? courses[0];
  const continueLesson = getContinueLesson(continueCourse, state);
  const continueProgress = calculateCourseProgress(continueCourse, state);
  const stats = calculateLearningStats(courses, state, new Date("2026-06-30T12:00:00+05:30"));
  const weeklyGoalPercent = Math.min(100, Math.round((stats.completedMinutes / state.user.weeklyGoalMinutes) * 100));
  const recentCertificate = state.certificates[0];
  const recentCertificateCourse = recentCertificate ? courses.find((course) => course.id === recentCertificate.courseId) : undefined;
  const recentCourses = state.enrollments
    .map((enrollment) => courses.find((course) => course.id === enrollment.courseId))
    .filter((course): course is Course => Boolean(course))
    .slice(0, 3);
  const recommended = courses
    .filter((course) => state.user.preferredCategories.includes(course.category) && !recentCourses.some((recent) => recent.id === course.id))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--brand-coral),var(--accent),var(--brand-lagoon))]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge tone="accent">Learn at your pace. Grow with purpose.</Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Welcome back, {state.user.name.split(" ")[0]}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
                Continue your current lesson, review your notes, or pick a course that matches this week&apos;s learning goal.
              </p>
            </div>
            <LinkButton href={routes.courses} variant="outline">
              <Search className="size-4" aria-hidden="true" />
              Browse
            </LinkButton>
          </div>

          <div className="mt-6 grid gap-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-raised)_82%,var(--accent-soft))] p-4 md:grid-cols-[180px_1fr]">
            <CourseThumbnail course={continueCourse} compact />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="accent">Continue learning</Badge>
                <span className="text-sm text-[var(--muted)]">{formatDuration(continueProgress.remainingMinutes)} left</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{continueCourse.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Resume: {continueLesson.title}. {pluralize(getCourseLessons(continueCourse).length, "lesson")} in the course.
              </p>
              <ProgressBar value={continueProgress.percent} label="Course progress" className="mt-4" />
              <div className="mt-5 flex flex-wrap gap-2">
                <LinkButton href={routes.learn(continueCourse.id, continueLesson.id)}>
                  <PlayCircle className="size-4" aria-hidden="true" />
                  Resume lesson
                </LinkButton>
                <LinkButton href={routes.course(continueCourse.id)} variant="outline">
                  View curriculum
                </LinkButton>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--brand-lagoon-soft)] text-[var(--brand-lagoon)]">
                <Goal className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold">Weekly goal</h2>
                <p className="text-sm text-[var(--muted)]">{state.user.weeklyGoalMinutes} planned minutes</p>
              </div>
            </div>
            <ProgressBar value={weeklyGoalPercent} label={`${stats.completedMinutes} minutes completed`} className="mt-5" />
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-[var(--radius-control)] bg-[var(--brand-amber-soft)] text-[var(--brand-amber)]">
                <Award className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold">Recent certificate</h2>
                <p className="text-sm text-[var(--muted)]">
                  {recentCertificate && recentCertificateCourse
                    ? `${recentCertificateCourse.title} · ${formatDate(recentCertificate.issueDate)}`
                    : "Complete a course to earn one."}
                </p>
              </div>
            </div>
            <LinkButton href={routes.certificates} variant="outline" className="mt-5 w-full">
              Certificates
            </LinkButton>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Learning metrics">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 [box-shadow:inset_0_3px_0_var(--brand-coral)]">
          <Flame className="mb-4 size-5 text-[var(--brand-coral)]" aria-hidden="true" />
          {metricLabel(stats.streak, "day learning streak")}
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 [box-shadow:inset_0_3px_0_var(--accent)]">
          <BookMarked className="mb-4 size-5 text-[var(--accent)]" aria-hidden="true" />
          {metricLabel(stats.completedLessons, "lessons completed")}
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 [box-shadow:inset_0_3px_0_var(--brand-lagoon)]">
          <Clock3 className="mb-4 size-5 text-[var(--brand-lagoon)]" aria-hidden="true" />
          {metricLabel(Math.round(stats.completedMinutes / 60), "hours learned")}
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 [box-shadow:inset_0_3px_0_var(--brand-amber)]">
          <GraduationCap className="mb-4 size-5 text-[var(--brand-amber)]" aria-hidden="true" />
          {metricLabel(state.certificates.length, "certificates earned")}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-[var(--accent)]" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Weekly activity</h2>
          </div>
          <div className="mt-5 grid grid-cols-7 items-end gap-2" aria-label="Lessons completed this week">
            {stats.weeklyActivity.map((day) => {
              const height = Math.max(12, day.completedLessons * 28);
              return (
                <div key={day.label} className="text-center">
                  <div className="flex h-24 items-end justify-center rounded-[var(--radius-control)] bg-[var(--surface-raised)] p-1">
                    <div
                      className="w-full rounded-[var(--radius-control)]"
                      style={{ height, backgroundColor: activityColors[stats.weeklyActivity.indexOf(day)] }}
                      aria-label={`${day.completedLessons} completed lessons on ${day.label}`}
                    />
                  </div>
                  <span className="mt-2 block text-xs text-[var(--muted)]">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Recently viewed</h2>
            <Link href={routes.courses} className="text-sm font-medium text-[var(--accent)] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {recentCourses.map((course) => {
              const lesson = getContinueLesson(course, state);
              const progress = calculateCourseProgress(course, state);
              return (
                <Link
                  key={course.id}
                  href={routes.learn(course.id, lesson.id)}
                  className="grid min-h-20 grid-cols-[72px_1fr] gap-3 rounded-[var(--radius-card)] border border-[var(--border)] p-3 transition hover:bg-[var(--surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  <CourseThumbnail course={course} mini />
                  <span className="min-w-0">
                    <span className="block font-medium text-[var(--foreground)]">{course.title}</span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{lesson.title}</span>
                    <span className="mt-2 block text-xs text-[var(--muted)]">{progress.percent}% complete</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Recommended for you</h2>
          <Link href={routes.profile} className="text-sm font-medium text-[var(--accent)] hover:underline">
            Edit preferences
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {(recommended.length ? recommended : courses.slice(1, 3)).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
