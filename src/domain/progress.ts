import type { Course, CourseSection, LearningState, Lesson } from "@/types/lms";

const DAY_IN_MS = 86_400_000;

export function getCourseLessons(course: Course) {
  return course.sections.flatMap((section) => section.lessons);
}

export function getLessonIndex(course: Course, lessonId: string) {
  return getCourseLessons(course).findIndex((lesson) => lesson.id === lessonId);
}

export function getCompletedLessonIds(courseId: string, state: LearningState) {
  return new Set(
    state.lessonProgress
      .filter((progress) => progress.courseId === courseId && progress.completed)
      .map((progress) => progress.lessonId),
  );
}

export function isLessonComplete(courseId: string, lessonId: string, state: LearningState) {
  return state.lessonProgress.some(
    (progress) => progress.courseId === courseId && progress.lessonId === lessonId && progress.completed,
  );
}

export function isLessonLocked(course: Course, lesson: Lesson, state: LearningState) {
  if (!lesson.unlockAfterLessonId) {
    return false;
  }

  return !isLessonComplete(course.id, lesson.unlockAfterLessonId, state);
}

export function calculateCourseProgress(course: Course, state: LearningState) {
  const lessons = getCourseLessons(course);
  const completedLessonIds = getCompletedLessonIds(course.id, state);
  const completed = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const total = lessons.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const remainingMinutes = lessons
    .filter((lesson) => !completedLessonIds.has(lesson.id))
    .reduce((sum, lesson) => sum + lesson.durationMinutes, 0);

  return { completed, total, percent, remainingMinutes };
}

export function calculateSectionProgress(courseId: string, section: CourseSection, state: LearningState) {
  const completedLessonIds = getCompletedLessonIds(courseId, state);
  const completed = section.lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  const total = section.lessons.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, total, percent };
}

export function getAdjacentLessons(course: Course, lessonId: string) {
  const lessons = getCourseLessons(course);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);

  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export function getContinueLesson(course: Course, state: LearningState) {
  const enrollment = state.enrollments.find((item) => item.courseId === course.id);
  const lessons = getCourseLessons(course);

  if (enrollment) {
    return lessons.find((lesson) => lesson.id === enrollment.lastLessonId) ?? lessons[0];
  }

  const recentProgress = state.lessonProgress
    .filter((progress) => progress.courseId === course.id && progress.lastOpenedAt)
    .sort((first, second) => (second.lastOpenedAt ?? "").localeCompare(first.lastOpenedAt ?? ""))[0];

  return recentProgress ? lessons.find((lesson) => lesson.id === recentProgress.lessonId) ?? lessons[0] : lessons[0];
}

export function getCourseStatus(course: Course, state: LearningState) {
  const progress = calculateCourseProgress(course, state);
  const enrolled = state.enrollments.some((item) => item.courseId === course.id);

  if (progress.percent === 100) {
    return "completed";
  }

  if (enrolled || progress.completed > 0) {
    return "in-progress";
  }

  if (state.savedCourseIds.includes(course.id)) {
    return "saved";
  }

  return "not-started";
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysAgo(from: Date, value: string) {
  return Math.floor((startOfDay(from) - startOfDay(new Date(value))) / DAY_IN_MS);
}

export function getWeeklyActivity(state: LearningState, today = new Date()) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayTotals = new Map<number, number>();

  state.lessonProgress.forEach((progress) => {
    if (!progress.completedAt) {
      return;
    }

    const completed = new Date(progress.completedAt);
    const age = daysAgo(today, progress.completedAt);

    if (age >= 0 && age < 7) {
      const mondayIndex = (completed.getDay() + 6) % 7;
      dayTotals.set(mondayIndex, (dayTotals.get(mondayIndex) ?? 0) + 1);
    }
  });

  return labels.map((label, index) => ({
    label,
    completedLessons: dayTotals.get(index) ?? 0,
  }));
}

export function calculateLearningStreak(state: LearningState, today = new Date()) {
  const completedDays = new Set(
    state.lessonProgress
      .filter((progress) => progress.completedAt)
      .map((progress) => startOfDay(new Date(progress.completedAt ?? "")).toString()),
  );

  let streak = 0;
  const cursor = new Date(today);

  while (completedDays.has(startOfDay(cursor).toString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateLearningStats(courses: Course[], state: LearningState, today = new Date()) {
  const completedLessons = state.lessonProgress.filter((progress) => progress.completed).length;
  const completedMinutes = courses.reduce((sum, course) => {
    const completedIds = getCompletedLessonIds(course.id, state);
    return (
      sum +
      getCourseLessons(course)
        .filter((lesson) => completedIds.has(lesson.id))
        .reduce((courseSum, lesson) => courseSum + lesson.durationMinutes, 0)
    );
  }, 0);
  const weeklyActivity = getWeeklyActivity(state, today);
  const weeklyCompletedLessons = weeklyActivity.reduce((sum, day) => sum + day.completedLessons, 0);

  return {
    completedLessons,
    completedMinutes,
    weeklyCompletedLessons,
    weeklyActivity,
    streak: calculateLearningStreak(state, today),
  };
}
