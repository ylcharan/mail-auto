// app/api/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { oauth2Client } from "@/lib/google";
import { tokenStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/dashboard?error=No authorization code", req.url),
    );
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    // ✅ TEMP store
    tokenStore.userTokens = tokens;

    console.log("TOKENS:", tokens);

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=Failed to authenticate", req.url),
    );
  }
}
