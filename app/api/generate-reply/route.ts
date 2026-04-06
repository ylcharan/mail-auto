import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { thread } = await req.json();

    if (!thread) {
      return NextResponse.json({ error: "Missing thread" }, { status: 400 });
    }

    const prompt = `
You are an AI email assistant.

Write a professional email reply.

Tone: concise and friendly.

Context:
${thread}

Instructions:
- Be clear and helpful
- Keep it short (5–8 lines max)
- If action items exist, address them
- Do not repeat the original email
- End politely
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await res.json();

    const reply =
      data.choices?.[0]?.message?.content || "Failed to generate reply";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
