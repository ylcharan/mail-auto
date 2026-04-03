interface EmptyStateProps {
  message: string;
}

/**
 * Component: Empty State
 * Displays empty state message
 */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}
