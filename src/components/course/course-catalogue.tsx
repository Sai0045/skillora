"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/common/badge";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { CourseCard } from "@/components/course/course-card";
import { courseCategories } from "@/data/courses";
import { defaultCourseFilters, filterAndSortCourses, type CourseFilters } from "@/domain/search";
import { useLearning } from "@/hooks/use-learning";
import type { Course, CourseLevel } from "@/types/lms";

const levels: Array<CourseLevel | "All"> = ["All", "Beginner", "Intermediate", "Advanced"];
const durations: CourseFilters["duration"][] = ["All", "Short", "Medium", "Long"];
const ratings: CourseFilters["rating"][] = ["All", "4.5+"];
const statuses: CourseFilters["status"][] = ["All", "not-started", "in-progress", "completed", "saved"];

function FilterControls({
  filters,
  setFilters,
}: {
  filters: CourseFilters;
  setFilters: (filters: CourseFilters) => void;
}) {
  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium">
        Category
        <select
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
          className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
        >
          {["All", ...courseCategories].map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Level
        <select
          value={filters.level}
          onChange={(event) => setFilters({ ...filters, level: event.target.value as CourseFilters["level"] })}
          className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
        >
          {levels.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Duration
        <select
          value={filters.duration}
          onChange={(event) => setFilters({ ...filters, duration: event.target.value as CourseFilters["duration"] })}
          className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
        >
          {durations.map((duration) => (
            <option key={duration}>{duration}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Rating
        <select
          value={filters.rating}
          onChange={(event) => setFilters({ ...filters, rating: event.target.value as CourseFilters["rating"] })}
          className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
        >
          {ratings.map((rating) => (
            <option key={rating}>{rating}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Status
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value as CourseFilters["status"] })}
          className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All" : status.replace("-", " ")}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function CourseCatalogue({ courses, initialQuery }: { courses: Course[]; initialQuery: string }) {
  const { state } = useLearning();
  const [filters, setFilters] = useState<CourseFilters>({ ...defaultCourseFilters, query: initialQuery });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  const visibleCourses = useMemo(() => filterAndSortCourses(courses, state, filters), [courses, filters, state]);
  const featured = visibleCourses.find((course) => course.featured);
  const standardCourses = featured ? visibleCourses.filter((course) => course.id !== featured.id) : visibleCourses;

  function resetFilters() {
    setFilters(defaultCourseFilters);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge tone="accent">Catalogue</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Find your next course</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Search across course names, instructors, categories, and lesson titles. Ratings and learner counts are demo content.
          </p>
        </div>
        <Button variant="outline" className="md:hidden" onClick={() => setDrawerOpen(true)}>
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters
        </Button>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 lg:block">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>
          <FilterControls filters={filters} setFilters={setFilters} />
        </aside>

        <div className="space-y-5">
          <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[1fr_220px]">
            <label className="grid gap-2 text-sm font-medium">
              Search
              <input
                value={filters.query}
                onChange={(event) => setFilters({ ...filters, query: event.target.value })}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none placeholder:text-[var(--muted)] focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
                placeholder="Course, instructor, category, lesson"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Sort
              <select
                value={filters.sort}
                onChange={(event) => setFilters({ ...filters, sort: event.target.value as CourseFilters["sort"] })}
                className="h-11 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--focus)] focus:ring-2 focus:ring-[var(--focus-soft)]"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest demo rating</option>
                <option value="duration">Shortest first</option>
                <option value="progress">My progress</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
            <span>{visibleCourses.length} courses</span>
            {filters.query ? <Badge tone="neutral">Search: {filters.query}</Badge> : null}
            {filters.category !== "All" ? <Badge tone="neutral">{filters.category}</Badge> : null}
            {filters.status !== "All" ? <Badge tone="neutral">{filters.status.replace("-", " ")}</Badge> : null}
          </div>

          {featured ? <CourseCard course={featured} featured /> : null}

          {visibleCourses.length === 0 ? (
            <EmptyState
              icon={<Search className="size-5" aria-hidden="true" />}
              title="No courses match those filters"
              description="Try a broader search or reset the filters to see the full local catalogue."
              action={<Button onClick={resetFilters}>Reset filters</Button>}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {standardCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="mobile-filters-title" className="text-lg font-semibold">
                Filters
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setDrawerOpen(false)}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </div>
            <FilterControls filters={filters} setFilters={setFilters} />
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                Reset
              </Button>
              <Button className="flex-1" onClick={() => setDrawerOpen(false)}>
                Show courses
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
