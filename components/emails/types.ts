/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Email-related type definitions
 */

export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  threadId: string;
  classification?: EmailClassification;
  classificationError?: string;
}

export interface EmailClassification {
  priority: "high" | "medium" | "low";
  requires_action: boolean;
  category: "meeting" | "work" | "promo" | "other";
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
  sortMode: "default" | "priority";
  onToggleSort: () => void;
}

export interface PaginationFooterProps {
  currentPage: number;
  emailCount: number;
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}
