/**
 * Component: Detail Field
 * Reusable field component for displaying label-value pairs
 */
export function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  );
}
