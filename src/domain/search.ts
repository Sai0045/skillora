import type { Course, CourseLevel, LearningState } from "@/types/lms";
import { calculateCourseProgress, getCourseLessons, getCourseStatus } from "@/domain/progress";

export type CourseFilters = {
  query: string;
  category: string;
  level: CourseLevel | "All";
  duration: "All" | "Short" | "Medium" | "Long";
  rating: "All" | "4.5+";
  status: "All" | "not-started" | "in-progress" | "completed" | "saved";
  sort: "recommended" | "rating" | "duration" | "progress";
};

export const defaultCourseFilters: CourseFilters = {
  query: "",
  category: "All",
  level: "All",
  duration: "All",
  rating: "All",
  status: "All",
  sort: "recommended",
};

function matchesQuery(course: Course, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  const searchable = [
    course.title,
    course.description,
    course.category,
    course.level,
    course.instructor.name,
    ...getCourseLessons(course).map((lesson) => lesson.title),
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(normalized);
}

function matchesDuration(course: Course, duration: CourseFilters["duration"]) {
  if (duration === "All") {
    return true;
  }

  if (duration === "Short") {
    return course.durationMinutes < 150;
  }

  if (duration === "Medium") {
    return course.durationMinutes >= 150 && course.durationMinutes <= 220;
  }

  return course.durationMinutes > 220;
}

export function filterAndSortCourses(courses: Course[], state: LearningState, filters: CourseFilters) {
  const filtered = courses.filter((course) => {
    const status = getCourseStatus(course, state);

    return (
      matchesQuery(course, filters.query) &&
      (filters.category === "All" || course.category === filters.category) &&
      (filters.level === "All" || course.level === filters.level) &&
      matchesDuration(course, filters.duration) &&
      (filters.rating === "All" || course.ratingDemo >= 4.5) &&
      (filters.status === "All" || status === filters.status)
    );
  });

  return filtered.sort((first, second) => {
    if (filters.sort === "rating") {
      return second.ratingDemo - first.ratingDemo;
    }

    if (filters.sort === "duration") {
      return first.durationMinutes - second.durationMinutes;
    }

    if (filters.sort === "progress") {
      return calculateCourseProgress(second, state).percent - calculateCourseProgress(first, state).percent;
    }

    const firstFeatured = first.featured ? 1 : 0;
    const secondFeatured = second.featured ? 1 : 0;
    return secondFeatured - firstFeatured || second.ratingDemo - first.ratingDemo;
  });
}
