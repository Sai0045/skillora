import { createDefaultLearningState, STORAGE_VERSION } from "@/store/default-state";
import type { LearningState } from "@/types/lms";

export const STORAGE_KEY = "skillora.learning-state.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLearningState(value: unknown): value is LearningState {
  if (!isRecord(value) || value.version !== STORAGE_VERSION || !isRecord(value.user)) {
    return false;
  }

  return (
    typeof value.user.name === "string" &&
    Array.isArray(value.enrollments) &&
    Array.isArray(value.lessonProgress) &&
    Array.isArray(value.notes) &&
    Array.isArray(value.bookmarks) &&
    Array.isArray(value.savedCourseIds) &&
    Array.isArray(value.quizAttempts) &&
    Array.isArray(value.certificates)
  );
}

export function loadLearningState() {
  if (typeof window === "undefined") {
    return createDefaultLearningState();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createDefaultLearningState();
  }

  try {
    const parsed: unknown = JSON.parse(stored);
    if (isLearningState(parsed)) {
      const fallback = createDefaultLearningState();
      return {
        ...fallback,
        ...parsed,
        user: {
          ...fallback.user,
          ...parsed.user,
        },
      };
    }
  } catch {
    return createDefaultLearningState();
  }

  return createDefaultLearningState();
}

export function saveLearningState(state: LearningState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetLearningState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return createDefaultLearningState();
}
