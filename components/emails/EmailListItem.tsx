import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Email } from "./types";

interface EmailListItemProps {
  email: Email;
}

/**
 * Component: Email List Item
 * Individual email row with link to full thread
 */
export function EmailListItem({ email }: EmailListItemProps) {
  return (
    <Link href={`/dashboard/email/${email.threadId}`}>
      <div className="w-full text-left rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
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

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {email.classification ? (
              <>
                <Badge variant="outline" className="capitalize">
                  {email.classification.priority} priority
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {email.classification.category}
                </Badge>
                <Badge
                  variant={
                    email.classification.requires_action
                      ? "destructive"
                      : "outline"
                  }
                >
                  {email.classification.requires_action
                    ? "Action needed"
                    : "No action"}
                </Badge>
              </>
            ) : (
              <Badge variant="ghost">
                {email.classificationError || "Classifying..."}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
