/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken");

  try {
    const gmail = await getGmailClient(userId);

    // 🔥 STEP 1: Fetch list with pagination
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      pageToken: pageToken || undefined,
    });

    const messages = listRes.data.messages || [];

    // 🔥 STEP 2: Fetch metadata in parallel
    const fullMessages = await Promise.all(
      messages.map(async (msg: any) => {
        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = fullMsg.data.payload?.headers || [];

        return {
          id: msg.id,
          threadId: fullMsg.data.threadId,
          from: headers.find((h: any) => h.name === "From")?.value || "Unknown",
          subject:
            headers.find((h: any) => h.name === "Subject")?.value ||
            "(No subject)",
          date: headers.find((h: any) => h.name === "Date")?.value || "Unknown",
        };
      }),
    );

    // 🔥 STEP 3: Return pagination info
    return NextResponse.json({
      messages: fullMessages,
      nextPageToken: listRes.data.nextPageToken || null,
      total: listRes.data.resultSizeEstimate || 0,
    });
  } catch (error: any) {
    console.error("Gmail API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch emails",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
