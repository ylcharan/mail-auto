import { Spinner } from "@/components/ui/spinner";

/**
 * Component: Loading State
 * Displays loading spinner with text
 */
export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="size-6 mr-3" />
      <p className="text-zinc-500 dark:text-zinc-400">Loading emails...</p>
    </div>
  );
}
