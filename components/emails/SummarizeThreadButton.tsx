"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface SummaryResult {
  summary: string[];
  actions: string[];
}

interface SummarizeThreadButtonProps {
  content: string;
  className?: string;
}

export default function SummarizeThreadButton({
  content,
  className,
}: SummarizeThreadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // GSAP animation for dropdown
  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpen) {
      // Animate in
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          scale: 0.85,
          y: -10,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.35,
          ease: "back.out(1.5)",
        },
      );

      // Stagger content items
      gsap.fromTo(
        dropdownRef.current.querySelectorAll("li, .space-y-3 > div"),
        {
          opacity: 0,
          x: -15,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.1,
        },
      );
    } else {
      // Animate out
      gsap.to(dropdownRef.current, {
        opacity: 0,
        scale: 0.85,
        y: -10,
        duration: 0.25,
        ease: "back.in(1.2)",
      });
    }
  }, [isOpen]);

  async function fetchSummary() {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.error || "Failed to summarize");
      }

      const result = await response.json();
      setSummary(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to summarize message",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggle() {
    const opening = !isOpen;
    setIsOpen(opening);

    // Only fetch on first open, and only if no summary or error
    if (opening && !summary && !error && !isLoading) {
      fetchSummary();
    }
  }

  function handleRetry() {
    setSummary(null);
    setError(null);
    fetchSummary();
  }

  const statusLabel = summary ? "Ready" : isLoading ? "Loading..." : "Pending";

  return (
    <div
      className={`relative inline-flex flex-col items-start ${className || ""}`}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={handleToggle}
        disabled={isLoading}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-full border cursor-pointer border-blue-950 bg-white px-4 py-2 text-sm font-semibold text-blue-950 transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {isLoading ? "Summarizing..." : isOpen ? "Hide Summary" : "Summarize"}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="mt-2 min-w-70 rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Summary
            </p>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {statusLabel}
            </span>
          </div>

          {isLoading ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              Summarizing the thread...
            </p>
          ) : error ? (
            <div className="space-y-2">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={handleRetry}
                className="text-xs text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
              >
                Retry
              </button>
            </div>
          ) : summary ? (
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Key Points
                </p>
                <ul className="space-y-1">
                  {summary.summary.map((point, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="mt-0.5 text-zinc-400">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {summary.actions.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Action Items
                  </p>
                  <ul className="space-y-1">
                    {summary.actions.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-zinc-700 dark:text-zinc-300"
                      >
                        <span className="mt-0.5 text-blue-400">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              Click the button to generate a summary for this thread.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
