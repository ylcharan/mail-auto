/**
 * Email-related type definitions
 */

export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  threadId: string;
}

export interface EmailsResponse {
  messages: Email[];
  nextPageToken?: string | null;
  total?: number;
}

export interface EmailDetailViewProps {
  email: Email;
  onBack: () => void;
}

export interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
}

export interface EmailSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface InboxHeaderProps {
  totalEmails: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export interface PaginationFooterProps {
  currentPage: number;
  emailCount: number;
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}
