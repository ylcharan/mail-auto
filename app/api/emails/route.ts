/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/emails/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { oauth2Client } from "@/lib/google";
import { tokenStore } from "@/lib/store";

export async function GET() {
  if (!tokenStore.userTokens) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  oauth2Client.setCredentials(tokenStore.userTokens);

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  try {
    // Get list of messages
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = listRes.data.messages || [];

    // Fetch full message details for each email
    const fullMessages = await Promise.all(
      messages.slice(0, 5).map(async (msg: any) => {
        const fullMsg = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = fullMsg.data.payload?.headers || [];
        const from =
          headers.find((h: any) => h.name === "From")?.value || "Unknown";
        const subject =
          headers.find((h: any) => h.name === "Subject")?.value ||
          "(No subject)";
        const date =
          headers.find((h: any) => h.name === "Date")?.value || "Unknown";

        return {
          id: msg.id,
          from,
          subject,
          date,
          threadId: fullMsg.data.threadId,
        };
      }),
    );

    return NextResponse.json({
      messages: fullMessages,
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
