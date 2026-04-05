import Link from "next/link";
import type { Email } from "./types";

interface EmailListItemProps {
  email: Email;
}

/**
 * Component: Email List Item
 * Individual email row with link to full thread
 */
export function EmailListItem({ email }: EmailListItemProps) {
  console.log("Rendering EmailListItem for email:", email); // Debug log
  return (
    <Link href={`/dashboard/email/${email.threadId}`}>
      <div className="w-full text-left rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {email.from}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {email.subject}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {email.date}
        </p>
      </div>
    </Link>
  );
}
