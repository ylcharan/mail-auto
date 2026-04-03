// lib/gmail.ts
import { google } from "googleapis";
import { supabase } from "./supabase";
import { getOAuthClient } from "./google";

export async function getGmailClient(userId: string) {
  const { data, error } = await supabase
    .from("google_accounts")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !data) {
    throw new Error("Gmail not connected");
  }

  const client = getOAuthClient();

  client.setCredentials({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expiry_date,
  });

  // 🔥 auto refresh
  client.on("tokens", async (tokens) => {
    await supabase
      .from("google_accounts")
      .update({
        access_token: tokens.access_token ?? data.access_token,
        expiry_date: tokens.expiry_date ?? data.expiry_date,
        refresh_token: tokens.refresh_token ?? data.refresh_token,
      })
      .eq("clerk_user_id", userId);
  });

  return google.gmail({ version: "v1", auth: client });
}
