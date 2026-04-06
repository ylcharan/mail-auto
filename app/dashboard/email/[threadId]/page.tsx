import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";
import SummarizeThreadButton from "@/components/emails/SummarizeThreadButton";
import ReplyBox from "@/components/emails/ReplyBox";

interface ThreadHeader {
  name: string;
  value: string;
}

interface ThreadPayload {
  mimeType: string;
  headers: ThreadHeader[];
  body?: {
    data?: string;
    size: number;
  };
  parts?: Array<{
    mimeType: string;
    headers: ThreadHeader[];
    body?: {
      data?: string;
      size: number;
    };
  }>;
}

interface ThreadMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: ThreadPayload;
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

/**
 * Helper: Decode base64url to text
 */
function decodeBase64Url(data: string): string {
  try {
    const buffer = Buffer.from(data, "base64url");
    return buffer.toString("utf-8");
  } catch {
    return data;
  }
}

/**
 * Helper: Extract message body
 */
function getMessageBody(payload: ThreadPayload): string {
  // Try to get body from main payload
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  // Try to get from parts (for multipart messages)
  let html = "";
  let text = "";
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        html = decodeBase64Url(part.body.data);
      }
      if (part.mimeType === "text/plain" && part.body?.data) {
        text = decodeBase64Url(part.body.data);
      }
    }
  }
  return html || text;
}

/**
 * Helper: Fetch thread from API
 */
// async function fetchThread(threadId: string): Promise<ThreadMessage[] | null> {
//   try {
//     const response = await fetch(`/api/thread/${threadId}`, {
//       cache: "no-store",
//     });
//     if (!response.ok) {
//       console.error(
//         `Failed to fetch thread ${threadId}:`,
//         response.status,
//         response.statusText,
//       );
//       return null;
//     }
//     const data = await response.json();
//     console.log(`Fetched thread ${threadId}:`, data);
//     return Array.isArray(data) ? data : null;
//   } catch (error) {
//     console.error(`Error fetching thread ${threadId}:`, error);
//     return null;
//   }
// }
/**
 * Helper: Fetch thread from Gmail directly on the server
 */
async function fetchThread(threadId: string): Promise<ThreadMessage[] | null> {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const gmail = await getGmailClient(userId as string);
    const thread = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
    });

    return Array.isArray(thread.data.messages)
      ? (thread.data.messages as ThreadMessage[])
      : null;
  } catch (error) {
    console.error(`Error fetching thread ${threadId}:`, error);
    return null;
  }
}

/**
 * Component: Thread Content
 * Displays all messages in a thread as a conversation
 */
function ThreadContent({ messages }: { messages: ThreadMessage[] }) {
  return (
    <div className="space-y-6">
      {messages
        .sort((a, b) => Number(a.internalDate) - Number(b.internalDate))
        .map((msg, index) => {
          const headers = msg.payload.headers;
          const getHeader = (name: string) =>
            headers.find((h) => h.name === name)?.value || "";

          const from = getHeader("From");
          const subject = getHeader("Subject");
          const body = getMessageBody(msg.payload);

          return (
            <div
              key={msg.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5"
            >
              {/* Message header */}
              <div className="mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {from}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {new Date(parseInt(msg.internalDate)).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">
                    Message {index + 1}
                  </span>
                </div>
                {index === 0 && subject && (
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-2">
                    {subject}
                  </p>
                )}
              </div>

              {/* Message body */}
              {body?.includes("<") ? (
                <iframe
                  srcDoc={body}
                  sandbox="allow-same-origin" // blocks scripts, popups, forms
                  className="w-full min-h-50 border-0"
                  style={{ height: "400px" }}
                />
              ) : (
                <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {body || msg.snippet || "(No message body)"}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

/**
 * Loading skeleton for thread
 */
function ThreadSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse"
        >
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 mb-4" />
          <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}

/**
 * Page: Email Thread Detail
 */
export default async function EmailThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await fetchThread(threadId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-black dark:text-white flex px-8 py-8">
      <main className="max-w-4xl w-[70%] mx-auto p-6 sm:p-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              ← Back to Inbox
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">Conversation</h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {thread?.length === 1
                    ? "1 message"
                    : `${thread?.length || 0} messages`}{" "}
                  • Started{" "}
                  {thread?.[0]?.payload?.headers?.find(
                    (h: ThreadHeader) => h.name === "Date",
                  )?.value || "Unknown date"}
                </p>
              </div>
            </div>
          </div>

          <Suspense fallback={<ThreadSkeleton />}>
            {thread && thread.length > 0 ? (
              <ThreadContent messages={thread} />
            ) : (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  Unable to load thread details
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Return to Inbox
                  </Button>
                </Link>
              </div>
            )}
          </Suspense>
        </div>
      </main>{" "}
      <div className="flex flex-col gap-4">
        <SummarizeThreadButton
          className="mt-8 mr-2"
          content={
            thread
              ?.sort((a, b) => Number(a.internalDate) - Number(b.internalDate))
              .map((msg) => {
                const headers = msg.payload.headers;
                const getHeader = (name: string) =>
                  headers.find((h) => h.name === name)?.value || "";

                return `From: ${getHeader("From")}\nDate: ${getHeader(
                  "Date",
                )}\nSubject: ${getHeader("Subject")}\n\n${getMessageBody(
                  msg.payload,
                )}`;
              })
              .join("\n\n---\n\n") || ""
          }
        />
        <ReplyBox
          className="mt-8 mr-2"
          thread={
            thread
              ?.sort((a, b) => Number(a.internalDate) - Number(b.internalDate))
              .map((msg) => {
                const headers = msg.payload.headers;
                const getHeader = (name: string) =>
                  headers.find((h) => h.name === name)?.value || "";

                return `From: ${getHeader("From")}\nDate: ${getHeader(
                  "Date",
                )}\nSubject: ${getHeader("Subject")}\n\n${getMessageBody(
                  msg.payload,
                )}`;
              })
              .join("\n\n---\n\n") || ""
          }
        />
      </div>{" "}
    </div>
  );
}
