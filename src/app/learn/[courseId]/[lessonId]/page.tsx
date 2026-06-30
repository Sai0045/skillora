import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningWorkspace } from "@/components/learning/learning-workspace";
import { courses, getCourse, getLesson, getQuiz } from "@/data/courses";

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({
        courseId: course.id,
        lessonId: lesson.id,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}): Promise<Metadata> {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);
  const lesson = course ? getLesson(course, lessonId) : undefined;

  return {
    title: lesson ? lesson.title : "Lesson not found",
    description: lesson?.description,
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  const lesson = getLesson(course, lessonId);

  if (!lesson) {
    notFound();
  }

  const quiz = lesson.quizId ? getQuiz(lesson.quizId) : undefined;

  return <LearningWorkspace course={course} lesson={lesson} quiz={quiz} />;
}
