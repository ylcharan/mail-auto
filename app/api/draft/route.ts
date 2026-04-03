// app/api/draft/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export async function POST() {
  const { userId } = await auth();

  const gmail = await getGmailClient(userId!);

  const message = [
    "To: test@example.com",
    "Subject: Supabase Draft",
    "",
    "Hello from Supabase 🚀",
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
