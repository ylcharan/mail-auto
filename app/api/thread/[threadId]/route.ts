import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getGmailClient } from "@/lib/gmail";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const { userId } = await auth();

  try {
    const { threadId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gmail = await getGmailClient(userId as string);

    const thread = await gmail.users.threads.get({
      userId: "me",
      id: threadId,
    });

    return NextResponse.json(thread.data.messages || []);
  } catch (error) {
    console.error("THREAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch thread" },
      { status: 500 },
    );
  }
}
