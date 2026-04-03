import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

/**
 * Component: Error State
 * Displays error message with retry and connect buttons
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
      <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
      <div className="flex gap-3 mt-4">
        <Button
          size="sm"
          onClick={() => (window.location.href = "/api/google/connect")}
        >
          Connect Gmail
        </Button>
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
