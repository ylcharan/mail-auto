/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/emails/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { oauth2Client } from "@/lib/google";
import { tokenStore } from "@/lib/store";

export async function GET(req: Request) {
  if (!tokenStore.userTokens) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken");

  oauth2Client.setCredentials(tokenStore.userTokens);

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  try {
    // 🔥 STEP 1: Fetch list with pageToken
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      pageToken: pageToken || undefined,
    });

    const messages = listRes.data.messages || [];

    // 🔥 STEP 2: Fetch metadata (parallel)
    const fullMessages = await Promise.all(
      messages.map(async (msg: any) => {
        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = fullMsg.data.payload?.headers || [];

        return {
          id: msg.id,
          from: headers.find((h: any) => h.name === "From")?.value || "Unknown",
          subject:
            headers.find((h: any) => h.name === "Subject")?.value ||
            "(No subject)",
          date: headers.find((h: any) => h.name === "Date")?.value || "Unknown",
          threadId: fullMsg.data.threadId,
        };
      }),
    );

    // 🔥 STEP 3: Return nextPageToken
    return NextResponse.json({
      messages: fullMessages,
      nextPageToken: listRes.data.nextPageToken || null,
      total: listRes.data.resultSizeEstimate,
    });
  } catch (error: any) {
    console.error("Gmail API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 },
    );
  }
}
