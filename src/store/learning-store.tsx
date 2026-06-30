"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { calculateCourseProgress, getCourseLessons } from "@/domain/progress";
import { scoreQuiz } from "@/domain/quiz";
import { createDefaultLearningState } from "@/store/default-state";
import { loadLearningState, resetLearningState, saveLearningState } from "@/store/storage";
import type { Course, LearningState, Quiz, ThemePreference, User } from "@/types/lms";

type LearningAction =
  | { type: "hydrate"; state: LearningState }
  | { type: "openLesson"; course: Course; lessonId: string; now: string }
  | { type: "completeLesson"; course: Course; lessonId: string; now: string }
  | { type: "undoLesson"; course: Course; lessonId: string }
  | { type: "toggleBookmark"; courseId: string; lessonId: string; now: string }
  | { type: "toggleSavedCourse"; courseId: string }
  | {
      type: "saveNote";
      courseId: string;
      lessonId: string;
      body: string;
      timestampSeconds?: number;
      now: string;
    }
  | { type: "deleteNote"; noteId: string }
  | { type: "submitQuiz"; course: Course; quiz: Quiz; answers: Record<string, string>; now: string }
  | { type: "updateUser"; patch: Partial<Pick<User, "name" | "weeklyGoalMinutes" | "preferredCategories" | "reducedMotion" | "theme">> }
  | { type: "reset" };

type LearningContextValue = {
  state: LearningState;
  isHydrated: boolean;
  openLesson: (course: Course, lessonId: string) => void;
  completeLesson: (course: Course, lessonId: string) => void;
  undoLesson: (course: Course, lessonId: string) => void;
  toggleBookmark: (courseId: string, lessonId: string) => void;
  toggleSavedCourse: (courseId: string) => void;
  saveNote: (courseId: string, lessonId: string, body: string, timestampSeconds?: number) => void;
  deleteNote: (noteId: string) => void;
  submitQuiz: (course: Course, quiz: Quiz, answers: Record<string, string>) => void;
  updateUser: (patch: Partial<Pick<User, "name" | "weeklyGoalMinutes" | "preferredCategories" | "reducedMotion" | "theme">>) => void;
  resetData: () => void;
};

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

function id(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function upsertEnrollment(state: LearningState, course: Course, lessonId: string) {
  const lessons = getCourseLessons(course);
  const fallbackLessonId = lessons[0]?.id ?? lessonId;
  const existing = state.enrollments.find((enrollment) => enrollment.courseId === course.id);

  if (existing) {
    return state.enrollments.map((enrollment) =>
      enrollment.courseId === course.id ? { ...enrollment, lastLessonId: lessonId } : enrollment,
    );
  }

  return [
    ...state.enrollments,
    {
      courseId: course.id,
      status: "in-progress" as const,
      enrolledAt: new Date().toISOString(),
      lastLessonId: lessonId || fallbackLessonId,
    },
  ];
}

function upsertLessonProgress(
  state: LearningState,
  courseId: string,
  lessonId: string,
  patch: Partial<LearningState["lessonProgress"][number]>,
) {
  const existing = state.lessonProgress.find(
    (progress) => progress.courseId === courseId && progress.lessonId === lessonId,
  );

  if (existing) {
    return state.lessonProgress.map((progress) =>
      progress.courseId === courseId && progress.lessonId === lessonId ? { ...progress, ...patch } : progress,
    );
  }

  return [
    ...state.lessonProgress,
    {
      courseId,
      lessonId,
      completed: false,
      ...patch,
    },
  ];
}

function finishCourseIfReady(state: LearningState, course: Course) {
  const progress = calculateCourseProgress(course, state);

  if (progress.percent !== 100 || state.certificates.some((certificate) => certificate.courseId === course.id)) {
    return state;
  }

  const now = new Date();
  const credentialDate = now.toISOString().slice(0, 10).replaceAll("-", "");
  const certificate = {
    id: id("certificate"),
    courseId: course.id,
    learnerName: state.user.name,
    issueDate: now.toISOString().slice(0, 10),
    credentialCode: `SKL-${course.id.slice(0, 3).toUpperCase()}-${credentialDate}`,
  };

  return {
    ...state,
    enrollments: state.enrollments.map((enrollment) =>
      enrollment.courseId === course.id ? { ...enrollment, status: "completed" as const } : enrollment,
    ),
    certificates: [...state.certificates, certificate],
  };
}

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  if (action.type === "hydrate") {
    return action.state;
  }

  if (action.type === "reset") {
    return resetLearningState();
  }

  if (action.type === "openLesson") {
    return {
      ...state,
      enrollments: upsertEnrollment(state, action.course, action.lessonId),
      lessonProgress: upsertLessonProgress(state, action.course.id, action.lessonId, {
        lastOpenedAt: action.now,
      }),
    };
  }

  if (action.type === "completeLesson") {
    const nextState = {
      ...state,
      enrollments: upsertEnrollment(state, action.course, action.lessonId),
      lessonProgress: upsertLessonProgress(state, action.course.id, action.lessonId, {
        completed: true,
        completedAt: action.now,
        lastOpenedAt: action.now,
      }),
    };

    return finishCourseIfReady(nextState, action.course);
  }

  if (action.type === "undoLesson") {
    const nextState = {
      ...state,
      lessonProgress: state.lessonProgress.map((progress) =>
        progress.courseId === action.course.id && progress.lessonId === action.lessonId
          ? { ...progress, completed: false, completedAt: undefined }
          : progress,
      ),
    };
    const progress = calculateCourseProgress(action.course, nextState);

    return {
      ...nextState,
      enrollments: nextState.enrollments.map((enrollment) =>
        enrollment.courseId === action.course.id
          ? { ...enrollment, status: progress.percent === 100 ? "completed" : "in-progress" }
          : enrollment,
      ),
      certificates: progress.percent === 100 ? nextState.certificates : nextState.certificates.filter((item) => item.courseId !== action.course.id),
    };
  }

  if (action.type === "toggleBookmark") {
    const existing = state.bookmarks.find(
      (bookmark) => bookmark.courseId === action.courseId && bookmark.lessonId === action.lessonId,
    );

    return {
      ...state,
      bookmarks: existing
        ? state.bookmarks.filter((bookmark) => bookmark.id !== existing.id)
        : [
            ...state.bookmarks,
            {
              id: id("bookmark"),
              courseId: action.courseId,
              lessonId: action.lessonId,
              createdAt: action.now,
            },
          ],
    };
  }

  if (action.type === "toggleSavedCourse") {
    const alreadySaved = state.savedCourseIds.includes(action.courseId);

    return {
      ...state,
      savedCourseIds: alreadySaved
        ? state.savedCourseIds.filter((courseId) => courseId !== action.courseId)
        : [...state.savedCourseIds, action.courseId],
    };
  }

  if (action.type === "saveNote") {
    const body = action.body.trim();

    if (!body) {
      return state;
    }

    return {
      ...state,
      notes: [
        {
          id: id("note"),
          courseId: action.courseId,
          lessonId: action.lessonId,
          body,
          timestampSeconds: action.timestampSeconds,
          createdAt: action.now,
          updatedAt: action.now,
        },
        ...state.notes,
      ],
    };
  }

  if (action.type === "deleteNote") {
    return {
      ...state,
      notes: state.notes.filter((note) => note.id !== action.noteId),
    };
  }

  if (action.type === "submitQuiz") {
    const result = scoreQuiz(action.quiz, action.answers);
    const attempt = {
      id: id("attempt"),
      quizId: action.quiz.id,
      courseId: action.course.id,
      lessonId: action.quiz.lessonId,
      answers: action.answers,
      score: result.score,
      passed: result.passed,
      submittedAt: action.now,
    };

    const withAttempt = {
      ...state,
      quizAttempts: [attempt, ...state.quizAttempts],
    };

    if (!result.passed) {
      return withAttempt;
    }

    const withCompletion = {
      ...withAttempt,
      enrollments: upsertEnrollment(withAttempt, action.course, action.quiz.lessonId),
      lessonProgress: upsertLessonProgress(withAttempt, action.course.id, action.quiz.lessonId, {
        completed: true,
        completedAt: action.now,
        lastOpenedAt: action.now,
      }),
    };

    return finishCourseIfReady(withCompletion, action.course);
  }

  if (action.type === "updateUser") {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.patch,
      },
    };
  }

  return state;
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, undefined, createDefaultLearningState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "hydrate", state: loadLearningState() });
    const timer = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveLearningState(state);
    }
  }, [isHydrated, state]);

  useEffect(() => {
    const root = document.documentElement;
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyPreferences = () => {
      const resolvedTheme: Exclude<ThemePreference, "system"> =
        state.user.theme === "system" ? (darkQuery.matches ? "dark" : "light") : state.user.theme;
      root.dataset.theme = resolvedTheme;
      root.dataset.motion = state.user.reducedMotion ? "reduced" : "full";
    };

    applyPreferences();
    darkQuery.addEventListener("change", applyPreferences);

    return () => darkQuery.removeEventListener("change", applyPreferences);
  }, [state.user.reducedMotion, state.user.theme]);

  const now = useCallback(() => new Date().toISOString(), []);

  const openLesson = useCallback(
    (course: Course, lessonId: string) => dispatch({ type: "openLesson", course, lessonId, now: now() }),
    [now],
  );
  const completeLesson = useCallback(
    (course: Course, lessonId: string) => dispatch({ type: "completeLesson", course, lessonId, now: now() }),
    [now],
  );
  const undoLesson = useCallback((course: Course, lessonId: string) => dispatch({ type: "undoLesson", course, lessonId }), []);
  const toggleBookmark = useCallback(
    (courseId: string, lessonId: string) => dispatch({ type: "toggleBookmark", courseId, lessonId, now: now() }),
    [now],
  );
  const toggleSavedCourse = useCallback((courseId: string) => dispatch({ type: "toggleSavedCourse", courseId }), []);
  const saveNote = useCallback(
    (courseId: string, lessonId: string, body: string, timestampSeconds?: number) =>
      dispatch({ type: "saveNote", courseId, lessonId, body, timestampSeconds, now: now() }),
    [now],
  );
  const deleteNote = useCallback((noteId: string) => dispatch({ type: "deleteNote", noteId }), []);
  const submitQuiz = useCallback(
    (course: Course, quiz: Quiz, answers: Record<string, string>) =>
      dispatch({ type: "submitQuiz", course, quiz, answers, now: now() }),
    [now],
  );
  const updateUser = useCallback(
    (patch: Partial<Pick<User, "name" | "weeklyGoalMinutes" | "preferredCategories" | "reducedMotion" | "theme">>) =>
      dispatch({ type: "updateUser", patch }),
    [],
  );
  const resetData = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<LearningContextValue>(
    () => ({
      state,
      isHydrated,
      openLesson,
      completeLesson,
      undoLesson,
      toggleBookmark,
      toggleSavedCourse,
      saveNote,
      deleteNote,
      submitQuiz,
      updateUser,
      resetData,
    }),
    [
      completeLesson,
      deleteNote,
      isHydrated,
      openLesson,
      resetData,
      saveNote,
      state,
      submitQuiz,
      toggleBookmark,
      toggleSavedCourse,
      undoLesson,
      updateUser,
    ],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearningStore() {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error("useLearningStore must be used inside LearningProvider");
  }

  return context;
}
