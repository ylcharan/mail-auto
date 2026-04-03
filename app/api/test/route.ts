// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("google_accounts")
    .select("*")
    .limit(1);

  if (error) {
    console.error("DB ERROR:", error);
    return NextResponse.json({ connected: false, error });
  }

  return NextResponse.json({
    connected: true,
    data,
  });
}
