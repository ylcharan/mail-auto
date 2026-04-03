"use client";

import { useState, useEffect, useCallback } from "react";
import { Email, EmailsResponse } from "./types";

/**
 * Custom hook for email fetching logic
 */
export const useEmailFetch = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalEmails, setTotalEmails] = useState(0);

  const fetchEmails = useCallback(async (token?: string | null) => {
    try {
      setLoading(true);
      const url = token ? `/api/emails?pageToken=${token}` : "/api/emails";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Gmail not connected. Please connect your Gmail account."
            : "Failed to fetch emails",
        );
      }

      const data: EmailsResponse = await response.json();
      setEmails(data.messages || []);
      setNextPageToken(data.nextPageToken || null);
      setTotalEmails(data.total || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching emails");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callbackError = params.get("error");

    if (callbackError) {
      setError(callbackError);
      setLoading(false);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    fetchEmails();
  }, [fetchEmails]);

  return {
    emails,
    loading,
    error,
    nextPageToken,
    totalEmails,
    fetchEmails,
  };
};
