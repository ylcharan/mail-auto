import { Button } from "@/components/ui/button";
import { DetailField } from "./DetailField";
import type { EmailDetailViewProps } from "./types";

/**
 * Component: Email Detail View
 * Displays full email details with back navigation
 */
export function EmailDetailView({ email, onBack }: EmailDetailViewProps) {
  return (
    <article className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <Button
        size="sm"
        variant="outline"
        onClick={onBack}
        className="mb-4 cursor-pointer"
      >
        ← Back to Inbox
      </Button>

      <div className="space-y-2">
        <DetailField label="From" value={email.from} />
        <DetailField label="Subject" value={email.subject} />
        <DetailField label="Date" value={email.date} />

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Thread ID
          </p>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 break-all">
            {email.threadId}
          </p>
        </div>
      </div>
    </article>
  );
}
