import type { Quiz, QuizAttempt } from "@/types/lms";

export function scoreQuiz(quiz: Quiz, answers: Record<string, string>) {
  const correctCount = quiz.questions.reduce((count, question) => {
    return answers[question.id] === question.correctOptionId ? count + 1 : count;
  }, 0);
  const score = Math.round((correctCount / quiz.questions.length) * 100);

  return {
    correctCount,
    total: quiz.questions.length,
    score,
    passed: score >= quiz.passingScore,
  };
}

export function getLatestQuizAttempt(attempts: QuizAttempt[], quizId: string) {
  return attempts
    .filter((attempt) => attempt.quizId === quizId)
    .sort((first, second) => second.submittedAt.localeCompare(first.submittedAt))[0];
}
