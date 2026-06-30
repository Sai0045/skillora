import { BookOpen, Braces, ChartNoAxesColumnIncreasing, Palette } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Course } from "@/types/lms";

const accentClasses = {
  indigo: "from-[#3147d4] via-[#5b5bd6] to-[#087f8c]",
  teal: "from-[#087f8c] via-[#0ea5a8] to-[#65a30d]",
  violet: "from-[#7434c4] via-[#a43bc4] to-[#e85d45]",
  blue: "from-[#147ac9] via-[#1593d1] to-[#5146d8]",
};

const iconMap = {
  Frontend: Braces,
  "Design Systems": Palette,
  Analytics: ChartNoAxesColumnIncreasing,
  "Product Design": BookOpen,
};

export function CourseThumbnail({
  course,
  compact = false,
  mini = false,
  className,
}: {
  course: Course;
  compact?: boolean;
  mini?: boolean;
  className?: string;
}) {
  const Icon = iconMap[course.category as keyof typeof iconMap] ?? BookOpen;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] bg-linear-to-br p-4 text-white",
        accentClasses[course.thumbnail.accent],
        mini ? "flex size-[72px] shrink-0 items-center justify-center p-2" : compact ? "min-h-28" : "min-h-40",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(135deg,rgba(255,255,255,.28)_0_1px,transparent_1px_12px)]" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-black/12" />
      {mini ? (
        <div className="relative flex flex-col items-center gap-1">
          <span className="rounded-full bg-white/18 px-2 py-1 text-xs font-semibold">{course.thumbnail.label}</span>
          <Icon className="size-5 opacity-90" strokeWidth={1.8} />
        </div>
      ) : (
        <div className="relative flex min-h-24 flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/16 px-2.5 py-1 text-xs font-semibold">{course.thumbnail.label}</span>
            <Icon className="size-7 opacity-90" strokeWidth={1.8} />
          </div>
          <div>
            <p className="max-w-[11rem] text-lg font-semibold leading-tight">{course.category}</p>
            <p className="mt-2 text-xs text-white/80">{course.level} course</p>
          </div>
        </div>
      )}
    </div>
  );
}
