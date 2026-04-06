// app/api/google/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/google";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "No code" }, { status: 400 });
  }

  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    return NextResponse.json(
      {
        error: "No refresh token",
      },
      { status: 400 },
    );
  }

  // ✅ UPSERT into Supabase
  const { error } = await supabase.from("google_accounts").upsert({
    clerk_user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`);
}
