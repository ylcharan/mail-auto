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
}: InboxHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
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
  );
}
