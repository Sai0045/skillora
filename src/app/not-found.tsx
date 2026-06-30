import { Compass } from "lucide-react";
import { LinkButton } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <EmptyState
      icon={<Compass className="size-5" aria-hidden="true" />}
      title="This Skillora page is not available"
      description="The course, lesson, or route may not exist in the local prototype."
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <LinkButton href={routes.dashboard}>Dashboard</LinkButton>
          <LinkButton href={routes.courses} variant="outline">
            Browse courses
          </LinkButton>
        </div>
      }
    />
  );
}
