"use client";

import { useState, useCallback } from "react";
import { useEmailFetch } from "./useEmailFetch";
import { EmailSearchBar } from "./EmailSearchBar";
import { EmailList } from "./EmailList";
import { InboxHeader } from "./InboxHeader";
import { PaginationFooter } from "./PaginationFooter";
import { ErrorState } from "./states/ErrorState";
import { LoadingState } from "./states/LoadingState";
import { EmptyState } from "./states/EmptyState";
import type { Email } from "./types";

/**
 * Component: Inbox View
 * Main inbox container with email list, search, and pagination
 */
export function InboxView() {
  const { emails, loading, error, nextPageToken, totalEmails, fetchEmails } =
    useEmailFetch();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortMode, setSortMode] = useState<"default" | "priority">("default");

  const getPriorityRank = (email: Email) => {
    switch (email.classification?.priority) {
      case "high":
        return 0;
      case "medium":
        return 1;
      case "low":
        return 2;
      default:
        return 3;
    }
  };

  // Filter emails based on search query
  const filteredEmails = emails.filter((email) => {
    const query = searchQuery.toLowerCase();
    return (
      email.from.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query)
    );
  });

  const displayedEmails =
    sortMode === "priority"
      ? [...filteredEmails].sort((a, b) => getPriorityRank(a) - getPriorityRank(b))
      : filteredEmails;

  // Handlers
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setSearchQuery("");
    fetchEmails();
  }, [fetchEmails]);

  const handleLoadMore = useCallback(() => {
    if (nextPageToken) {
      setCurrentPage((prev) => prev + 1);
      fetchEmails(nextPageToken);
    }
  }, [nextPageToken, fetchEmails]);

  const handleToggleSort = useCallback(() => {
    setSortMode((prev) => (prev === "default" ? "priority" : "default"));
  }, []);

  // Main inbox view
  return (
    <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <InboxHeader
        totalEmails={totalEmails}
        onRefresh={handleRefresh}
        isLoading={loading}
        sortMode={sortMode}
        onToggleSort={handleToggleSort}
      />

      <EmailSearchBar value={searchQuery} onChange={setSearchQuery} />

      {loading && <LoadingState />}

      {error && <ErrorState message={error} onRetry={handleRefresh} />}

      {!loading && !error && emails.length === 0 && (
        <EmptyState message="No emails found" />
      )}

      {!loading &&
        !error &&
        displayedEmails.length === 0 &&
        emails.length > 0 && (
          <EmptyState message="No emails match your search" />
        )}

      {!loading && !error && displayedEmails.length > 0 && (
        <>
          <div className="mb-6">
            <EmailList emails={displayedEmails} />
          </div>

          <PaginationFooter
            currentPage={currentPage}
            emailCount={displayedEmails.length}
            hasNextPage={!!nextPageToken}
            isLoading={loading}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </section>
  );
}
