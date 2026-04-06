import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

/**
 * 🧹 Clean email (remove HTML + noise)
 */
function cleanEmail(content: string) {
  return content
    .replace(/<[^>]*>/g, "") // remove HTML
    .replace(/On .* wrote:/g, "") // remove reply chains
    .replace(/From:.*\n/g, "")
    .replace(/Sent:.*\n/g, "")
    .replace(/Subject:.*\n/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/**
 * ✂️ Split text into chunks
 */
function chunkText(text: string, size = 4000) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

/**
 * 🤖 Single OpenAI call
 */
async function callOpenAI(content: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "You summarize emails and extract action items clearly.",
          },
          {
            role: "user",
            content: `
Return ONLY valid JSON:

{
  "summary": ["point1", "point2", "point3"],
  "actions": ["action1", "action2"]
}

Content:
${content}
`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API failed");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return JSON.parse(text); // parse JSON directly
  } catch (error) {
    console.error("callOpenAI error:", error);
    return {
      summary: ["Failed to summarize"],
      actions: [],
    };
  }
}

/**
 * 🧠 Handle long emails (chunking)
 */
async function summarizeLongEmail(content: string) {
  const chunks = chunkText(content);

  const partials = [];

  for (const chunk of chunks) {
    const res = await callOpenAI(chunk);
    partials.push(
      `Summary: ${res.summary.join(", ")} Actions: ${res.actions.join(", ")}`,
    );
  }

  // Final combine step
  return await callOpenAI(partials.join("\n"));
}

/**
 * 🚀 API handler
 */
export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    const cleaned = cleanEmail(content);

    let result;

    if (cleaned.length > 6000) {
      // large email → chunking
      result = await summarizeLongEmail(cleaned);
    } else {
      // normal email
      result = await callOpenAI(cleaned);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
