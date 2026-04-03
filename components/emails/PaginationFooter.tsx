import { Button } from "@/components/ui/button";
import type { PaginationFooterProps } from "./types";

/**
 * Component: Pagination Footer
 * Pagination controls with page info
 */
export function PaginationFooter({
  currentPage,
  emailCount,
  hasNextPage,
  isLoading,
  onLoadMore,
}: PaginationFooterProps) {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Page {currentPage} • Showing {emailCount} emails
      </p>
      <Button
        size="sm"
        onClick={onLoadMore}
        disabled={isLoading}
        aria-label="Load more emails"
      >
        Load More
      </Button>
    </div>
  );
}
