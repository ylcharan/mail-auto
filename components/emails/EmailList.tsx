import { EmailListItem } from "./EmailListItem";
import type { EmailListProps } from "./types";

/**
 * Component: Email List
 * List container for multiple emails
 */
export function EmailList({ emails, onSelectEmail }: EmailListProps) {
  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailListItem key={email.id} email={email} onSelect={onSelectEmail} />
      ))}
    </div>
  );
}
