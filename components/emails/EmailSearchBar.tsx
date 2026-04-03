import { Input } from "@/components/ui/input";
import type { EmailSearchBarProps } from "./types";

/**
 * Component: Email Search Bar
 * Search input for filtering emails
 */
export function EmailSearchBar({
  value,
  onChange,
  placeholder = "Search emails by sender or subject...",
}: EmailSearchBarProps) {
  return (
    <div className="mb-6">
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        aria-label="Search emails"
      />
    </div>
  );
}
