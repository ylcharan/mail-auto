import { EmailListItem } from "./EmailListItem";
import type { Email } from "./types";

interface EmailListProps {
  emails: Email[];
}

/**
 * Component: Email List
 * List container for multiple emails with navigation to thread pages
 */
export function EmailList({ emails }: EmailListProps) {
  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailListItem key={email.id} email={email} />
      ))}
    </div>
  );
}
