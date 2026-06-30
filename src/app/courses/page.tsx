import type { Metadata } from "next";
import { CourseCatalogue } from "@/components/course/course-catalogue";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Courses",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  return <CourseCatalogue key={query} courses={courses} initialQuery={query} />;
}
