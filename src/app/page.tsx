import { DashboardView } from "@/components/dashboard/dashboard-view";
import { courses } from "@/data/courses";

export default function Home() {
  return <DashboardView courses={courses} />;
}
