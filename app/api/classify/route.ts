import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const prompt = `
You are an email classification system.

Analyze the email and return STRICT JSON only.

Schema:
{
  "priority": "high | medium | low",
  "requires_action": true | false,
  "category": "meeting | work | promo | other"
}

Rules:
- High → urgent, deadlines, meetings, boss/client
- Medium → important but not urgent
- Low → newsletters, promos, FYI

Email:
${email}
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
      }),
    });

    const data = await res.json();

    let output = data.choices?.[0]?.message?.content || "{}";

    // 🛡️ Safe JSON parsing
    try {
      output = JSON.parse(output);
    } catch {
      output = {
        priority: "low",
        requires_action: false,
        category: "other",
      };
    }

    return NextResponse.json(output);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Classification failed" },
      { status: 500 },
    );
  }
}
