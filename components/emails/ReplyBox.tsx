"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "@phosphor-icons/react";
import gsap from "gsap";

interface ReplyBoxProps {
  thread: string;
  className?: string;
}

export default function ReplyBox({ thread, className }: ReplyBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
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
        dropdownRef.current.querySelectorAll("textarea, .space-y-3 > div"),
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

  async function generateReply() {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-reply", {
        method: "POST",
        body: JSON.stringify({ thread }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.error || "Failed to generate reply");
      }

      const data = await res.json();
      setReply(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate reply");
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggle() {
    const opening = !isOpen;
    setIsOpen(opening);

    // Only generate on first open, and only if no reply or error
    if (opening && !reply && !error && !isLoading) {
      generateReply();
    }
  }

  function handleRetry() {
    setReply(null);
    setError(null);
    generateReply();
  }

  function copyToClipboard() {
    if (reply) {
      navigator.clipboard.writeText(reply);
      // You could add a toast notification here
    }
  }

  const statusLabel = reply ? "Ready" : isLoading ? "Loading..." : "Pending";

  const getStatusColor = () => {
    if (error)
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    if (reply)
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    if (isLoading)
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
  };

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
        {isLoading ? "Generating..." : isOpen ? "Hide Reply" : "Generate Reply"}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="mt-2 min-w-100 rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Generated Reply
            </p>
            <div className="flex items-center gap-2">
              {reply && (
                <button
                  onClick={copyToClipboard}
                  className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              )}
              <span
                className={`rounded-full px-2 py-1 text-xs ${getStatusColor()}`}
              >
                {statusLabel}
              </span>
            </div>
          </div>

          {isLoading ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              Generating reply...
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
          ) : reply ? (
            <textarea
              className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              rows={8}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Generated reply will appear here..."
            />
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              Click the button to generate a reply for this thread.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
