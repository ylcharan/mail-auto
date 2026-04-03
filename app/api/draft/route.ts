// app/api/draft/route.ts
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

  const message = [
    "To: test@example.com",
    "Subject: Draft from Next.js",
    "",
    "Hello from App Router 🚀",
  ].join("\n");

  const encoded = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const draft = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: { raw: encoded },
    },
  });

  return NextResponse.json(draft.data);
}
