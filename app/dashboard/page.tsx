/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

function EmailDetailView({
  email,
  onBack,
}: {
  email: any;
  onBack: () => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <Button size="sm" variant="outline" onClick={onBack} className="mb-4">
        ← Back to Inbox
      </Button>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            From
          </p>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {email.from}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Subject
          </p>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            {email.subject}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Date
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {email.date}
          </p>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Thread ID
          </p>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 break-all">
            {email.threadId}
          </p>
        </div>
      </div>
    </div>
  );
}

function InboxView() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalEmails, setTotalEmails] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEmails = async (token?: string | null) => {
    try {
      setLoading(true);
      const url = token ? `/api/emails?pageToken=${token}` : "/api/emails";
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Gmail not connected. Please connect your Gmail account.");
        } else {
          setError("Failed to fetch emails");
        }
        return;
      }

      const data = await response.json();
      setEmails(data.messages || []);
      setNextPageToken(data.nextPageToken || null);
      setTotalEmails(data.total || 0);
      setError(null);
      setSelectedEmail(null);
    } catch (err) {
      setError("Error fetching emails");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for error from callback
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");

    if (callbackError) {
      setError(callbackError);
      setLoading(false);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    fetchEmails();
  }, []);

  const filteredEmails = emails.filter((email) => {
    const query = searchQuery.toLowerCase();
    return (
      email.from.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query)
    );
  });

  const handleNextPage = () => {
    if (nextPageToken) {
      setCurrentPage((prev) => prev + 1);
      fetchEmails(nextPageToken);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setNextPageToken(null);
    fetchEmails();
  };

  if (selectedEmail) {
    return (
      <EmailDetailView
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
      />
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Inbox
          </h2>
          {totalEmails > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Total emails: {totalEmails}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search emails by sender or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-6 mr-3" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading emails...</p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 p-4">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          <div className="flex gap-3 mt-4">
            <Button
              size="sm"
              onClick={() => (window.location.href = "/api/google/connect")}
            >
              Connect Gmail
            </Button>
            <Button size="sm" variant="outline" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        </div>
      ) : emails.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400">No emails found</p>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400">
            No emails match your search
          </p>
        </div>
      ) : (
        <div>
          <div className="space-y-3 mb-6">
            {filteredEmails.map((email: any) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className="rounded-lg border border-zinc-100 dark:border-zinc-800 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition"
              >
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
            ))}
          </div>

          {nextPageToken && (
            <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Page {currentPage} • Showing {filteredEmails.length} emails
              </p>
              <Button size="sm" onClick={handleNextPage} disabled={loading}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white">
      <main className="max-w-6xl mx-auto p-6 sm:p-8">
        <h1 className="text-4xl font-bold mb-2">Emails</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Manage and view your Gmail inbox
        </p>
        <InboxView />
      </main>
    </div>
  );
}
