"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  HelpCircle,
  Keyboard,
  Lock,
  Menu,
  MessageCircle,
  NotebookPen,
  PlayCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { ProgressBar } from "@/components/common/progress-bar";
import {
  calculateCourseProgress,
  calculateSectionProgress,
  getAdjacentLessons,
  isLessonComplete,
  isLessonLocked,
} from "@/domain/progress";
import { getLatestQuizAttempt, scoreQuiz } from "@/domain/quiz";
import { useLearning } from "@/hooks/use-learning";
import { cn } from "@/lib/cn";
import { formatDuration, formatTimestamp } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Course, Lesson, Quiz } from "@/types/lms";

type Tab = "overview" | "notes" | "resources" | "qa" | "transcript";

const tabs: Array<{ id: Tab; label: string; icon: typeof NotebookPen }> = [
  { id: "overview", label: "Overview", icon: PlayCircle },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "resources", label: "Resources", icon: FileText },
  { id: "qa", label: "Q&A", icon: MessageCircle },
  { id: "transcript", label: "Transcript", icon: FileText },
];

function activeElementAcceptsText() {
  const element = document.activeElement;

  if (!element) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || element.getAttribute("contenteditable") === "true";
}

function CurriculumPanel({
  course,
  activeLessonId,
  onNavigate,
}: {
  course: Course;
  activeLessonId: string;
  onNavigate: (lesson: Lesson) => void;
}) {
  const { state } = useLearning();

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-lg font-semibold">Curriculum</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Manual completion controls progress.</p>
      </div>
      {course.sections.map((section) => {
        const progress = calculateSectionProgress(course.id, section, state);
        return (
          <section key={section.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{section.title}</h3>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{section.summary}</p>
              </div>
              <span className="text-xs text-[var(--muted)]">{progress.completed}/{progress.total}</span>
            </div>
            <ProgressBar value={progress.percent} className="mb-3" />
            <div className="grid gap-2">
              {section.lessons.map((lesson) => {
                const complete = isLessonComplete(course.id, lesson.id, state);
                const locked = isLessonLocked(course, lesson, state);
                const active = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    className={cn(
                      "grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[var(--radius-control)] border px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]",
                      locked ? "cursor-not-allowed opacity-60" : "",
                    )}
                    disabled={locked}
                    onClick={() => onNavigate(lesson)}
                  >
                    {locked ? (
                      <Lock className="size-4" aria-hidden="true" />
                    ) : complete ? (
                      <CheckCircle2 className="size-4 text-[var(--success)]" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 text-[var(--muted)]" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{lesson.title}</span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">{formatDuration(lesson.durationMinutes)} · {lesson.kind}</span>
                    </span>
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function QuizPanel({ course, quiz }: { course: Course; quiz: Quiz }) {
  const { state, submitQuiz } = useLearning();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const latestAttempt = getLatestQuizAttempt(state.quizAttempts, quiz.id);
  const result = submitted || latestAttempt ? scoreQuiz(quiz, submitted ? answers : latestAttempt?.answers ?? {}) : undefined;
  const allAnswered = quiz.questions.every((question) => answers[question.id]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allAnswered) {
      return;
    }

    submitQuiz(course, quiz, answers);
    setSubmitted(true);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
        <h3 className="font-semibold">{quiz.title}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Passing score: {quiz.passingScore}%</p>
        {latestAttempt ? (
          <p className="mt-2 text-sm text-[var(--success)]">
            Latest attempt: {latestAttempt.score}% · {latestAttempt.passed ? "passed" : "not passed"}
          </p>
        ) : null}
      </div>

      {quiz.questions.map((question, index) => {
        const selected = answers[question.id] ?? latestAttempt?.answers[question.id];
        const showFeedback = submitted || Boolean(latestAttempt);
        const correct = selected === question.correctOptionId;
        return (
          <fieldset key={question.id} className="rounded-[var(--radius-card)] border border-[var(--border)] p-4">
            <legend className="px-1 font-semibold">
              {index + 1}. {question.prompt}
            </legend>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] border border-[var(--border)] px-3 text-sm hover:bg-[var(--surface-muted)]"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    className="size-4 accent-[var(--accent)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {showFeedback ? (
              <p className={cn("mt-3 text-sm", correct ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                {correct ? "Correct. " : "Review this one. "}
                {question.feedback}
              </p>
            ) : null}
          </fieldset>
        );
      })}

      {result ? (
        <div className={cn("rounded-[var(--radius-card)] p-4 text-sm", result.passed ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--warning-soft)] text-[var(--warning)]")}>
          Score: {result.score}% ({result.correctCount}/{result.total}). {result.passed ? "This checkpoint is complete." : "Try again when ready."}
        </div>
      ) : null}

      <Button type="submit" disabled={!allAnswered}>
        Submit quiz
      </Button>
    </form>
  );
}

export function LearningWorkspace({ course, lesson, quiz }: { course: Course; lesson: Lesson; quiz?: Quiz }) {
  const router = useRouter();
  const {
    state,
    openLesson,
    completeLesson,
    undoLesson,
    toggleBookmark,
    saveNote,
    deleteNote,
  } = useLearning();
  const [activeTab, setActiveTab] = useState<Tab>(lesson.kind === "quiz" ? "overview" : "overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const progress = calculateCourseProgress(course, state);
  const adjacent = getAdjacentLessons(course, lesson.id);
  const complete = isLessonComplete(course.id, lesson.id, state);
  const bookmarked = state.bookmarks.some((bookmark) => bookmark.courseId === course.id && bookmark.lessonId === lesson.id);
  const lessonNotes = state.notes.filter((note) => note.courseId === course.id && note.lessonId === lesson.id);
  const dirtyNote = noteBody.trim().length > 0 || timestamp.trim().length > 0;
  const nextLocked = adjacent.next ? isLessonLocked(course, adjacent.next, state) : false;

  useEffect(() => {
    openLesson(course, lesson.id);
  }, [course, lesson.id, openLesson]);

  useEffect(() => {
    if (!dirtyNote) {
      return;
    }

    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirtyNote]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (activeElementAcceptsText()) {
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
      }

      if (event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleBookmark(course.id, lesson.id);
      }

      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        if (complete) {
          undoLesson(course, lesson.id);
        } else {
          completeLesson(course, lesson.id);
        }
      }

      if (event.key.toLowerCase() === "n" && adjacent.next && !nextLocked) {
        event.preventDefault();
        navigateTo(adjacent.next);
      }

      if (event.key.toLowerCase() === "p" && adjacent.previous) {
        event.preventDefault();
        navigateTo(adjacent.previous);
      }

      if (event.key === "Escape") {
        setDrawerOpen(false);
        setHelpOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function confirmDiscard() {
    return !dirtyNote || window.confirm("Discard the unsaved note?");
  }

  function navigateTo(target: Lesson) {
    if (!confirmDiscard()) {
      return;
    }

    router.push(routes.learn(course.id, target.id));
    setDrawerOpen(false);
  }

  function toggleCompletion() {
    if (complete) {
      undoLesson(course, lesson.id);
      setAnnouncement("Lesson marked incomplete.");
      return;
    }

    completeLesson(course, lesson.id);
    setAnnouncement("Lesson marked complete.");
  }

  const submitNote = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedTimestamp = timestamp ? Number(timestamp) : undefined;
    saveNote(course.id, lesson.id, noteBody, Number.isFinite(parsedTimestamp) ? parsedTimestamp : undefined);
    setNoteBody("");
    setTimestamp("");
    setAnnouncement("Note saved.");
  }, [course.id, lesson.id, noteBody, saveNote, timestamp]);

  const tabContent = useMemo(() => {
    if (activeTab === "overview") {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">{lesson.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">{lesson.description}</p>
          </div>
          {lesson.kind === "quiz" && quiz ? <QuizPanel course={course} quiz={quiz} /> : null}
          {lesson.kind !== "quiz" ? (
            <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm leading-6 text-[var(--muted)]">
              Completion is manual in this prototype. Exact YouTube playback progress is not tracked.
            </div>
          ) : null}
        </div>
      );
    }

    if (activeTab === "notes") {
      return (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={submitNote} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <label className="grid gap-2 text-sm font-medium">
              Note
              <textarea
                value={noteBody}
                onChange={(event) => setNoteBody(event.target.value)}
                rows={6}
                className="rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
                placeholder="Write a concise lesson note"
              />
            </label>
            <label className="mt-3 grid gap-2 text-sm font-medium">
              Optional timestamp in seconds
              <input
                inputMode="numeric"
                value={timestamp}
                onChange={(event) => setTimestamp(event.target.value)}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
                placeholder="620"
              />
            </label>
            {dirtyNote ? <p className="mt-3 text-sm text-[var(--warning)]">Unsaved note changes are protected.</p> : null}
            <Button type="submit" className="mt-4" disabled={!noteBody.trim()}>
              Save note
            </Button>
          </form>
          <div className="space-y-3">
            {lessonNotes.length === 0 ? (
              <EmptyState
                icon={<NotebookPen className="size-5" aria-hidden="true" />}
                title="No notes for this lesson"
                description="Save a timestamped note when you find a point worth revisiting."
              />
            ) : (
              lessonNotes.map((note) => (
                <article key={note.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
                  {note.timestampSeconds !== undefined ? (
                    <Badge tone="accent">{formatTimestamp(note.timestampSeconds)}</Badge>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{note.body}</p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
                    <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      );
    }

    if (activeTab === "resources") {
      return lesson.resources.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {lesson.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.href}
              download={resource.kind === "download"}
              target={resource.kind === "link" ? "_blank" : undefined}
              rel={resource.kind === "link" ? "noopener noreferrer" : undefined}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:bg-[var(--surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
            >
              <FileText className="mb-3 size-5 text-[var(--accent)]" aria-hidden="true" />
              <span className="block font-semibold">{resource.title}</span>
              <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">{resource.description}</span>
            </a>
          ))}
        </div>
      ) : (
        <EmptyState icon={<FileText className="size-5" aria-hidden="true" />} title="No resources here" description="This lesson does not include extra local files." />
      );
    }

    if (activeTab === "qa") {
      return (
        <EmptyState
          icon={<HelpCircle className="size-5" aria-hidden="true" />}
          title="No learner questions yet"
          description="For this local prototype, Q&A is a read-only empty state. A production version could connect this tab to course discussions."
        />
      );
    }

    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface-raised)] p-4">
        <h2 className="font-semibold">Transcript summary</h2>
        <div className="mt-4 grid gap-3">
          {lesson.transcript.map((line) => (
            <p key={line} className="text-sm leading-6 text-[var(--muted)]">
              {line}
            </p>
          ))}
        </div>
      </div>
    );
  }, [
    activeTab,
    course,
    deleteNote,
    dirtyNote,
    lesson,
    lessonNotes,
    noteBody,
    quiz,
    submitNote,
    timestamp,
  ]);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-black shadow-[var(--shadow-soft)]">
            {lesson.video ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube.com/embed/${lesson.video.youtubeId}`}
                title={lesson.video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[var(--surface-muted)] p-6 text-center text-[var(--muted)]">
                <div>
                  <FileText className="mx-auto mb-4 size-10 text-[var(--accent)]" aria-hidden="true" />
                  <p className="font-semibold text-[var(--foreground)]">{lesson.kind === "quiz" ? "Quiz lesson" : "Reading lesson"}</p>
                  <p className="mt-2 max-w-md text-sm leading-6">{lesson.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge tone="accent">{lesson.kind}</Badge>
                  <Badge tone={complete ? "success" : "neutral"}>{complete ? "Complete" : "In progress"}</Badge>
                  {bookmarked ? <Badge tone="warning">Bookmarked</Badge> : null}
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {course.title} · {formatDuration(lesson.durationMinutes)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="xl:hidden" onClick={() => setDrawerOpen(true)}>
                  <Menu className="size-4" aria-hidden="true" />
                  Curriculum
                </Button>
                <Button variant="outline" onClick={() => toggleBookmark(course.id, lesson.id)}>
                  <Bookmark className={bookmarked ? "size-4 fill-[var(--accent)] text-[var(--accent)]" : "size-4"} aria-hidden="true" />
                  {bookmarked ? "Saved" : "Bookmark"}
                </Button>
                <Button onClick={toggleCompletion}>
                  {complete ? <RotateCcw className="size-4" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}
                  {complete ? "Undo" : "Mark complete"}
                </Button>
              </div>
            </div>

            <ProgressBar value={progress.percent} label="Course progress" className="mt-5" />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" disabled={!adjacent.previous} onClick={() => adjacent.previous && navigateTo(adjacent.previous)}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Previous
              </Button>
              <Button variant="ghost" onClick={() => setHelpOpen(true)}>
                <Keyboard className="size-4" aria-hidden="true" />
                Shortcuts
              </Button>
              <Button disabled={!adjacent.next || nextLocked} onClick={() => adjacent.next && navigateTo(adjacent.next)}>
                Next
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
            {nextLocked ? <p className="mt-3 text-sm text-[var(--warning)]">Complete the checkpoint before opening the next lesson.</p> : null}
          </div>
        </div>

        <aside className="hidden xl:block">
          <CurriculumPanel course={course} activeLessonId={lesson.id} onNavigate={navigateTo} />
        </aside>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Lesson details">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-control)] px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                  active ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)] hover:bg-[var(--surface-muted)]",
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4" role="tabpanel">
          {tabContent}
        </div>
      </section>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-labelledby="curriculum-drawer-title">
          <button className="absolute inset-0 bg-black/45" aria-label="Close curriculum" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md overflow-y-auto bg-[var(--surface)] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="curriculum-drawer-title" className="text-lg font-semibold">
                Course curriculum
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close curriculum" onClick={() => setDrawerOpen(false)}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <CurriculumPanel course={course} activeLessonId={lesson.id} onNavigate={navigateTo} />
          </div>
        </div>
      ) : null}

      {helpOpen ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="shortcut-title">
          <button className="absolute inset-0 bg-black/45" aria-label="Close shortcuts" onClick={() => setHelpOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-card)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 id="shortcut-title" className="text-lg font-semibold">
                Keyboard shortcuts
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close shortcuts" onClick={() => setHelpOpen(false)}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt>Mark complete or undo</dt>
                <dd className="font-mono">C</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Bookmark lesson</dt>
                <dd className="font-mono">B</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Next lesson</dt>
                <dd className="font-mono">N</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Previous lesson</dt>
                <dd className="font-mono">P</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Open this help</dt>
                <dd className="font-mono">?</dd>
              </div>
            </dl>
          </div>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
