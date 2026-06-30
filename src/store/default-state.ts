import { demoUser } from "@/data/user";
import type { LearningState } from "@/types/lms";

export const STORAGE_VERSION = 1;

const baseLearningState: LearningState = {
  version: STORAGE_VERSION,
  user: demoUser,
  enrollments: [
    {
      courseId: "frontend-foundations",
      status: "in-progress",
      enrolledAt: "2026-06-18T08:30:00.000Z",
      lastLessonId: "javascript-basics",
    },
    {
      courseId: "data-storytelling",
      status: "completed",
      enrolledAt: "2026-06-01T08:30:00.000Z",
      lastLessonId: "data-chart-choices",
    },
  ],
  lessonProgress: [
    {
      courseId: "frontend-foundations",
      lessonId: "front-orientation",
      completed: true,
      completedAt: "2026-06-25T10:30:00.000Z",
      lastOpenedAt: "2026-06-25T10:30:00.000Z",
    },
    {
      courseId: "frontend-foundations",
      lessonId: "html-crash-course",
      completed: true,
      completedAt: "2026-06-26T10:20:00.000Z",
      lastOpenedAt: "2026-06-26T10:20:00.000Z",
    },
    {
      courseId: "frontend-foundations",
      lessonId: "css-layout-systems",
      completed: true,
      completedAt: "2026-06-27T12:15:00.000Z",
      lastOpenedAt: "2026-06-27T12:15:00.000Z",
    },
    {
      courseId: "frontend-foundations",
      lessonId: "javascript-basics",
      completed: false,
      lastOpenedAt: "2026-06-29T09:05:00.000Z",
    },
    {
      courseId: "data-storytelling",
      lessonId: "data-question-first",
      completed: true,
      completedAt: "2026-06-20T09:00:00.000Z",
      lastOpenedAt: "2026-06-20T09:00:00.000Z",
    },
    {
      courseId: "data-storytelling",
      lessonId: "data-chart-choices",
      completed: true,
      completedAt: "2026-06-21T09:00:00.000Z",
      lastOpenedAt: "2026-06-21T09:00:00.000Z",
    },
  ],
  notes: [
    {
      id: "note-javascript-behavior",
      courseId: "frontend-foundations",
      lessonId: "javascript-basics",
      body: "Rewatch the section on functions before building the practice card interaction.",
      timestampSeconds: 620,
      createdAt: "2026-06-29T09:12:00.000Z",
      updatedAt: "2026-06-29T09:12:00.000Z",
    },
  ],
  bookmarks: [
    {
      id: "bookmark-react-thinking",
      courseId: "frontend-foundations",
      lessonId: "react-component-thinking",
      createdAt: "2026-06-29T09:18:00.000Z",
    },
  ],
  savedCourseIds: ["design-systems-primer", "ux-research-sprints"],
  quizAttempts: [],
  certificates: [
    {
      id: "certificate-data-storytelling",
      courseId: "data-storytelling",
      learnerName: "Sairaj Abhale",
      issueDate: "2026-06-21",
      credentialCode: "SKL-DA-2026-0621",
    },
  ],
};

export function createDefaultLearningState(): LearningState {
  return {
    ...baseLearningState,
    user: {
      ...baseLearningState.user,
      preferredCategories: [...baseLearningState.user.preferredCategories],
    },
    enrollments: baseLearningState.enrollments.map((item) => ({ ...item })),
    lessonProgress: baseLearningState.lessonProgress.map((item) => ({ ...item })),
    notes: baseLearningState.notes.map((item) => ({ ...item })),
    bookmarks: baseLearningState.bookmarks.map((item) => ({ ...item })),
    savedCourseIds: [...baseLearningState.savedCourseIds],
    quizAttempts: baseLearningState.quizAttempts.map((item) => ({
      ...item,
      answers: { ...item.answers },
    })),
    certificates: baseLearningState.certificates.map((item) => ({ ...item })),
  };
}
