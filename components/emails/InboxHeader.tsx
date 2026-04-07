import { Button } from "@/components/ui/button";
import type { InboxHeaderProps } from "./types";

/**
 * Component: Inbox Header
 * Header with title, email count, and refresh button
 */
export function InboxHeader({
  totalEmails,
  onRefresh,
  isLoading,
  sortMode,
  onToggleSort,
}: InboxHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Inbox
        </h2>
        {totalEmails > 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Total emails: {totalEmails}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={sortMode === "priority" ? "default" : "outline"}
          onClick={onToggleSort}
          disabled={isLoading}
          aria-label="Toggle sorting"
        >
          {sortMode === "priority" ? "Sort on" : "Sort off"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh inbox"
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
