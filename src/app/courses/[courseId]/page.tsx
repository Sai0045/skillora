import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetails } from "@/components/course/course-details";
import { courses, getCourse } from "@/data/courses";

export function generateStaticParams() {
  return courses.map((course) => ({ courseId: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    return { title: "Course not found" };
  }

  return {
    title: course.title,
    description: course.tagline,
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetails course={course} />;
}
