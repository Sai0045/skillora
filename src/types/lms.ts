export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseStatus = "not-started" | "in-progress" | "completed" | "saved";

export type LessonKind = "video" | "reading" | "quiz" | "project";

export type ThemePreference = "system" | "light" | "dark";

export type User = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarInitials: string;
  timezone: string;
  weeklyGoalMinutes: number;
  preferredCategories: string[];
  reducedMotion: boolean;
  theme: ThemePreference;
};

export type Instructor = {
  name: string;
  title: string;
  bio: string;
};

export type Resource = {
  id: string;
  title: string;
  kind: "download" | "link";
  href: string;
  description: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  kind: LessonKind;
  isPreview?: boolean;
  unlockAfterLessonId?: string;
  video?: {
    youtubeId: string;
    title: string;
  };
  resources: Resource[];
  transcript: string[];
  quizId?: string;
};

export type CourseSection = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type CourseReview = {
  id: string;
  learner: string;
  rating: number;
  quote: string;
};

export type CourseFaq = {
  question: string;
  answer: string;
};

export type Course = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  level: CourseLevel;
  language: string;
  durationMinutes: number;
  ratingDemo: number;
  learnerCountDemo: number;
  updatedAt: string;
  featured?: boolean;
  thumbnail: {
    accent: "indigo" | "teal" | "violet" | "blue";
    label: string;
  };
  instructor: Instructor;
  outcomes: string[];
  requirements: string[];
  sections: CourseSection[];
  reviews: CourseReview[];
  faq: CourseFaq[];
};

export type Enrollment = {
  courseId: string;
  status: Exclude<CourseStatus, "saved">;
  enrolledAt: string;
  lastLessonId: string;
};

export type LessonProgress = {
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  lastOpenedAt?: string;
};

export type Note = {
  id: string;
  courseId: string;
  lessonId: string;
  body: string;
  timestampSeconds?: number;
  createdAt: string;
  updatedAt: string;
};

export type Bookmark = {
  id: string;
  courseId: string;
  lessonId: string;
  createdAt: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: {
    id: string;
    label: string;
  }[];
  correctOptionId: string;
  feedback: string;
};

export type Quiz = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  courseId: string;
  lessonId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  submittedAt: string;
};

export type Certificate = {
  id: string;
  courseId: string;
  learnerName: string;
  issueDate: string;
  credentialCode: string;
};

export type LearningState = {
  version: number;
  user: User;
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  notes: Note[];
  bookmarks: Bookmark[];
  savedCourseIds: string[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
};
