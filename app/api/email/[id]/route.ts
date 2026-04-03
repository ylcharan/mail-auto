/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gmail = await getGmailClient(userId);

  const message = await gmail.users.messages.get({
    userId: "me",
    id: params.id,
    format: "full",
  });

  const payload = message.data.payload;

  // 🔥 Extract body
  function getBody(payload: any): string {
    if (!payload) return "";

    if (payload.parts) {
      const part = payload.parts.find((p: any) => p.mimeType === "text/plain");
      if (part) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
    }

    if (payload.body?.data) {
      return Buffer.from(payload.body.data, "base64").toString("utf-8");
    }

    return "";
  }

  const headers = payload?.headers || [];

  const result = {
    id: message.data.id,
    threadId: message.data.threadId,
    subject: headers.find((h: any) => h.name === "Subject")?.value,
    from: headers.find((h: any) => h.name === "From")?.value,
    to: headers.find((h: any) => h.name === "To")?.value,
    date: headers.find((h: any) => h.name === "Date")?.value,
    body: getBody(payload),
  };

  return NextResponse.json(result);
}
