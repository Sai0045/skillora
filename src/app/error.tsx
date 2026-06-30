"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertTriangle className="size-5" aria-hidden="true" />}
      title="Something went wrong"
      description={error.digest ? `Reference: ${error.digest}` : "Skillora could not render this view. Try again from the same local state."}
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
