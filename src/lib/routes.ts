export const routes = {
  dashboard: "/",
  courses: "/courses",
  course: (courseId: string) => `/courses/${courseId}`,
  learn: (courseId: string, lessonId: string) => `/learn/${courseId}/${lessonId}`,
  certificates: "/certificates",
  profile: "/profile",
};
