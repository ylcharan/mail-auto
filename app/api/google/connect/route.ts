// app/api/google/connect/route.ts
import { NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/google";

export const runtime = "nodejs";

export async function GET() {
  const client = getOAuthClient();

  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  });

  return NextResponse.redirect(url);
}
