"use client";

import { Bookmark, CheckCircle2, Clock3, Copy, Globe2, Layers3, PlayCircle, Star, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/common/badge";
import { Button, LinkButton } from "@/components/common/button";
import { CourseThumbnail } from "@/components/common/course-thumbnail";
import { ProgressBar } from "@/components/common/progress-bar";
import { calculateCourseProgress, calculateSectionProgress, getContinueLesson, getCourseLessons, isLessonComplete } from "@/domain/progress";
import { useLearning } from "@/hooks/use-learning";
import { formatDuration, pluralize } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Course } from "@/types/lms";

export function CourseDetails({ course }: { course: Course }) {
  const { state, toggleSavedCourse } = useLearning();
  const [shareMessage, setShareMessage] = useState("");
  const saved = state.savedCourseIds.includes(course.id);
  const progress = calculateCourseProgress(course, state);
  const continueLesson = getContinueLesson(course, state);
  const previewLesson = getCourseLessons(course).find((lesson) => lesson.isPreview && lesson.video);

  async function shareCourse() {
    const url = `${window.location.origin}${routes.course(course.id)}`;

    if (navigator.share) {
      await navigator.share({ title: course.title, url });
      setShareMessage("Share sheet opened.");
      return;
    }

    await navigator.clipboard.writeText(url);
    setShareMessage("Course link copied.");
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">{course.category}</Badge>
            <Badge tone="neutral">{course.level}</Badge>
            {progress.percent === 100 ? <Badge tone="success">Completed</Badge> : null}
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--muted)]">{course.description}</p>

          <dl className="mt-6 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2">
              <Star className="size-4 fill-[var(--warning)] text-[var(--warning)]" aria-hidden="true" />
              <dt className="sr-only">Demo rating</dt>
              <dd>{course.ratingDemo.toFixed(1)} demo rating</dd>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4" aria-hidden="true" />
              <dt className="sr-only">Demo learners</dt>
              <dd>{course.learnerCountDemo.toLocaleString()} demo learners</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="size-4" aria-hidden="true" />
              <dt className="sr-only">Duration</dt>
              <dd>{formatDuration(course.durationMinutes)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="size-4" aria-hidden="true" />
              <dt className="sr-only">Language</dt>
              <dd>{course.language}</dd>
            </div>
          </dl>

          {progress.completed > 0 ? <ProgressBar value={progress.percent} label={`${progress.completed}/${progress.total} lessons complete`} className="mt-6" /> : null}

          <div className="mt-6 flex flex-wrap gap-2">
            <LinkButton href={routes.learn(course.id, continueLesson.id)}>
              <PlayCircle className="size-4" aria-hidden="true" />
              {progress.completed > 0 ? "Continue course" : "Start course"}
            </LinkButton>
            <Button variant="outline" onClick={() => toggleSavedCourse(course.id)}>
              <Bookmark className={saved ? "size-4 fill-[var(--accent)] text-[var(--accent)]" : "size-4"} aria-hidden="true" />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" onClick={shareCourse}>
              <Copy className="size-4" aria-hidden="true" />
              Share
            </Button>
          </div>
          {shareMessage ? <p className="mt-3 text-sm text-[var(--success)]" aria-live="polite">{shareMessage}</p> : null}
        </div>

        <aside className="space-y-4">
          <CourseThumbnail course={course} />
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold">Instructor</h2>
            <p className="mt-3 text-lg font-semibold">{course.instructor.name}</p>
            <p className="mt-1 text-sm text-[var(--accent)]">{course.instructor.title}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{course.instructor.bio}</p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-xl font-semibold">What you will learn</h2>
          <ul className="mt-4 grid gap-3">
            {course.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--success)]" aria-hidden="true" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-xl font-semibold">Requirements</h2>
          <ul className="mt-4 grid gap-3">
            {course.requirements.map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                <Layers3 className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                {requirement}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {previewLesson ? (
        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge tone="warning">Preview lesson</Badge>
              <h2 className="mt-3 text-xl font-semibold">{previewLesson.title}</h2>
            </div>
            <LinkButton href={routes.learn(course.id, previewLesson.id)} variant="outline">
              Open preview
            </LinkButton>
          </div>
          <div className="aspect-video overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-black">
            <iframe
              className="size-full"
              src={`https://www.youtube.com/embed/${previewLesson.video?.youtubeId}`}
              title={previewLesson.video?.title ?? previewLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Curriculum</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {pluralize(course.sections.length, "section")} · {pluralize(getCourseLessons(course).length, "lesson")}
            </p>
          </div>
          <LinkButton href={routes.learn(course.id, continueLesson.id)}>Start learning</LinkButton>
        </div>

        <div className="mt-5 divide-y divide-[var(--border)]">
          {course.sections.map((section, index) => {
            const sectionProgress = calculateSectionProgress(course.id, section, state);
            return (
              <details key={section.id} open={index === 0} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-control)] p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
                  <span>
                    <span className="font-semibold">{section.title}</span>
                    <span className="mt-1 block text-sm text-[var(--muted)]">{section.summary}</span>
                  </span>
                  <span className="text-sm text-[var(--muted)]">{sectionProgress.completed}/{sectionProgress.total}</span>
                </summary>
                <div className="mt-3 grid gap-2">
                  {section.lessons.map((lesson) => (
                    <a
                      key={lesson.id}
                      href={routes.learn(course.id, lesson.id)}
                      className="grid gap-2 rounded-[var(--radius-control)] border border-[var(--border)] p-3 text-sm transition hover:bg-[var(--surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] sm:grid-cols-[1fr_auto]"
                    >
                      <span>
                        <span className="font-medium text-[var(--foreground)]">{lesson.title}</span>
                        <span className="mt-1 block text-[var(--muted)]">{lesson.description}</span>
                      </span>
                      <span className="flex items-center gap-2 text-[var(--muted)]">
                        {isLessonComplete(course.id, lesson.id, state) ? <CheckCircle2 className="size-4 text-[var(--success)]" aria-hidden="true" /> : null}
                        {formatDuration(lesson.durationMinutes)}
                      </span>
                    </a>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Demo reviews</h2>
            <Badge tone="neutral">Demo content</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {course.reviews.map((review) => (
              <blockquote key={review.id} className="rounded-[var(--radius-card)] bg-[var(--surface-raised)] p-4">
                <p className="text-sm leading-6 text-[var(--muted)]">&ldquo;{review.quote}&rdquo;</p>
                <footer className="mt-3 text-sm font-medium">
                  {review.learner} · {review.rating}/5
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 divide-y divide-[var(--border)]">
            {course.faq.map((item) => (
              <details key={item.question} className="py-3">
                <summary className="cursor-pointer font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
