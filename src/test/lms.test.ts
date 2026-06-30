import { afterEach, describe, expect, it, vi } from "vitest";
import { courses, quizzes } from "@/data/courses";
import {
  calculateCourseProgress,
  calculateLearningStats,
  getContinueLesson,
} from "@/domain/progress";
import { filterAndSortCourses } from "@/domain/search";
import { scoreQuiz } from "@/domain/quiz";
import { createDefaultLearningState, STORAGE_VERSION } from "@/store/default-state";
import { loadLearningState, resetLearningState, saveLearningState, STORAGE_KEY } from "@/store/storage";

describe("LMS domain logic", () => {
  it("calculates course progress from lesson completion", () => {
    const state = createDefaultLearningState();
    const course = courses.find((item) => item.id === "frontend-foundations");

    expect(course).toBeDefined();
    if (!course) {
      return;
    }

    expect(calculateCourseProgress(course, state)).toMatchObject({
      completed: 3,
      total: 7,
      percent: 43,
    });
  });

  it("resumes the last opened lesson from enrollment state", () => {
    const state = createDefaultLearningState();
    const course = courses[0];

    expect(getContinueLesson(course, state).id).toBe("javascript-basics");
  });

  it("searches across lesson titles and filters by status", () => {
    const state = createDefaultLearningState();
    const results = filterAndSortCourses(courses, state, {
      query: "component thinking",
      category: "All",
      level: "All",
      duration: "All",
      rating: "All",
      status: "in-progress",
      sort: "recommended",
    });

    expect(results.map((course) => course.id)).toEqual(["frontend-foundations"]);
  });

  it("scores quiz attempts and reports passing state", () => {
    const quiz = quizzes[0];
    const answers = {
      "q-semantic": "b",
      "q-layout": "a",
      "q-state": "c",
    };

    expect(scoreQuiz(quiz, answers)).toMatchObject({
      correctCount: 2,
      total: 3,
      score: 67,
      passed: false,
    });
  });

  it("calculates streak and weekly activity from completion dates", () => {
    const state = createDefaultLearningState();
    const stats = calculateLearningStats(courses, state, new Date("2026-06-27T12:30:00.000Z"));

    expect(stats.streak).toBe(3);
    expect(stats.weeklyActivity.some((day) => day.completedLessons > 0)).toBe(true);
  });
});

describe("local storage adapter", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function installStorageMock() {
    const memory = new Map<string, string>();
    const localStorageMock: Pick<Storage, "getItem" | "setItem" | "removeItem"> = {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        memory.set(key, value);
      },
      removeItem: (key) => {
        memory.delete(key);
      },
    };

    vi.stubGlobal("window", { localStorage: localStorageMock });
    return memory;
  }

  it("saves and loads versioned local learning state", () => {
    installStorageMock();
    const state = createDefaultLearningState();
    const updated = {
      ...state,
      notes: [
        {
          id: "note-test",
          courseId: "frontend-foundations",
          lessonId: "javascript-basics",
          body: "A local persistence note",
          createdAt: "2026-06-30T00:00:00.000Z",
          updatedAt: "2026-06-30T00:00:00.000Z",
        },
      ],
    };

    saveLearningState(updated);

    expect(loadLearningState().notes[0]?.body).toBe("A local persistence note");
  });

  it("resets malformed storage to the seeded demo state", () => {
    const memory = installStorageMock();
    memory.set(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION + 1 }));

    const state = loadLearningState();

    expect(state.user.name).toBe("Sairaj Abhale");
    expect(state.version).toBe(STORAGE_VERSION);
  });

  it("removes persisted data when reset is requested", () => {
    const memory = installStorageMock();
    saveLearningState(createDefaultLearningState());

    resetLearningState();

    expect(memory.has(STORAGE_KEY)).toBe(false);
  });
});
