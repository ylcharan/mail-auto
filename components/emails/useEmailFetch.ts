"use client";

import { useState, useEffect, useCallback } from "react";
import { Email, EmailClassification, EmailsResponse } from "./types";

/**
 * Custom hook for email fetching logic
 */
export const useEmailFetch = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalEmails, setTotalEmails] = useState(0);

  const classifyEmail = useCallback(
    async (email: Email): Promise<EmailClassification | null> => {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: `
From: ${email.from}
Subject: ${email.subject}
Date: ${email.date}
          `.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to classify email");
      }

      return response.json();
    },
    [],
  );

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
      const messages = data.messages || [];
      setEmails(messages);
      setNextPageToken(data.nextPageToken || null);
      setTotalEmails(data.total || 0);
      setError(null);

      const classifiedMessages = await Promise.all(
        messages.map(async (email) => {
          try {
            const classification = await classifyEmail(email);

            return {
              ...email,
              classification: classification || undefined,
              classificationError: undefined,
            };
          } catch (classificationError) {
            console.error("Classification Error:", classificationError);

            return {
              ...email,
              classificationError: "Unavailable",
            };
          }
        }),
      );

      setEmails(classifiedMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching emails");
    } finally {
      setLoading(false);
    }
  }, [classifyEmail]);

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
