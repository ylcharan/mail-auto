// Export all email-related components and utilities
export { EmailDetailView } from "./EmailDetailView";
export { EmailList } from "./EmailList";
export { EmailListItem } from "./EmailListItem";
export { EmailSearchBar } from "./EmailSearchBar";
export { DetailField } from "./DetailField";
export { InboxHeader } from "./InboxHeader";
export { InboxView } from "./InboxView";
export { PaginationFooter } from "./PaginationFooter";
export { ErrorState } from "./states/ErrorState";
export { LoadingState } from "./states/LoadingState";
export { EmptyState } from "./states/EmptyState";
export { useEmailFetch } from "./useEmailFetch";
export type {
  Email,
  EmailsResponse,
  EmailDetailViewProps,
  EmailListProps,
  EmailSearchBarProps,
  InboxHeaderProps,
  PaginationFooterProps,
} from "./types";
