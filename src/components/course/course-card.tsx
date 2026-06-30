"use client";

import { Bookmark, CheckCircle2, Clock3, Star, Users } from "lucide-react";
import { Badge } from "@/components/common/badge";
import { Button, LinkButton } from "@/components/common/button";
import { CourseThumbnail } from "@/components/common/course-thumbnail";
import { ProgressBar } from "@/components/common/progress-bar";
import { calculateCourseProgress, getContinueLesson, getCourseLessons, getCourseStatus } from "@/domain/progress";
import { useLearning } from "@/hooks/use-learning";
import { cn } from "@/lib/cn";
import { formatDuration, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Course } from "@/types/lms";

export function CourseCard({ course, featured = false }: { course: Course; featured?: boolean }) {
  const { state, toggleSavedCourse } = useLearning();
  const progress = calculateCourseProgress(course, state);
  const status = getCourseStatus(course, state);
  const continueLesson = getContinueLesson(course, state);
  const saved = state.savedCourseIds.includes(course.id);

  return (
    <article
      className={cn(
        "grid h-full items-start overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]",
        featured ? "lg:grid-cols-[240px_1fr]" : "",
      )}
    >
      <CourseThumbnail
        course={course}
        compact={!featured}
        className={featured ? "m-4 lg:mb-4 lg:mr-0 lg:aspect-[4/3] lg:min-h-0" : ""}
      />
      <div className="flex min-w-0 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge tone={status === "completed" ? "success" : status === "in-progress" ? "accent" : "neutral"}>
                {status === "not-started" ? "Not started" : status.replace("-", " ")}
              </Badge>
              {featured ? <Badge tone="warning">Featured</Badge> : null}
            </div>
            <h2 className="text-lg font-semibold leading-tight text-[var(--foreground)]">
              <a className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]" href={routes.course(course.id)}>
                {course.title}
              </a>
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{course.tagline}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={saved ? `Unsave ${course.title}` : `Save ${course.title}`}
            onClick={() => toggleSavedCourse(course.id)}
          >
            <Bookmark className={cn("size-5", saved ? "fill-[var(--accent)] text-[var(--accent)]" : "")} aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-2">
          <span>{course.instructor.name}</span>
          <span>{course.category} · {course.level}</span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="size-4" aria-hidden="true" />
            {formatDuration(course.durationMinutes)} · {pluralize(getCourseLessons(course).length, "lesson")}
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="size-4 fill-[var(--warning)] text-[var(--warning)]" aria-hidden="true" />
            {course.ratingDemo.toFixed(1)} demo rating
          </span>
          <span className="inline-flex items-center gap-2 sm:col-span-2">
            <Users className="size-4" aria-hidden="true" />
            {course.learnerCountDemo.toLocaleString()} demo learners
          </span>
        </div>

        {status === "in-progress" || status === "completed" ? (
          <ProgressBar value={progress.percent} label={`${progress.completed}/${progress.total} complete`} />
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2">
          <LinkButton href={routes.course(course.id)} variant="outline">
            Details
          </LinkButton>
          <LinkButton href={routes.learn(course.id, continueLesson.id)}>
            {status === "not-started" || status === "saved" ? "Start" : "Continue"}
            {status === "completed" ? <CheckCircle2 className="size-4" aria-hidden="true" /> : null}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
