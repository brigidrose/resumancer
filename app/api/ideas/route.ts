// app/api/ideas/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Idea = {
  category: "practical" | "creative" | "absurd";
  title: string;
  why: string;
  plan: string;   // 4 short lines separated by \n
  opener: string; // one-sentence DM-style opener
};

export async function POST(req: Request) {
  try {
    const { background, interests, mood } = await req.json();

    if (!background || !interests || typeof mood !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: background, interests, mood (number 0–10)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const bucket = mood <= 3 ? "realistic" : mood <= 7 ? "optimistic" : "delusional";

    const system = `
You are a careers strategist. Respond ONLY with JSON matching:
{"ideas":[{"category":"practical"|"creative"|"absurd","title":string,"why":string,"plan":string,"opener":string}, ...]}
Rules:
- Exactly 3 ideas: one practical, one creative, one absurd.
- "plan" is a concise 4-step 30-day plan; each step on its own line separated by \\n.
- Tailor to the user details; keep it specific and useful.
`.trim();

    const user = `
Background: ${background}
Interests: ${interests}
Mood bucket: ${bucket}
`.trim();

    // Call OpenAI chat completions with JSON response
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json(
        { error: `OpenAI error ${resp.status} ${resp.statusText}${text ? ` — ${text}` : ""}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No content from model" }, { status: 502 });
    }

    let parsed: { ideas?: Idea[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Model returned non-JSON content" }, { status: 502 });
    }

    const ideas = parsed?.ideas;
    if (!ideas || !Array.isArray(ideas) || ideas.length !== 3) {
      return NextResponse.json({ error: "Malformed ideas payload (need 3 items)" }, { status: 502 });
    }

    // Light validation for categories presence
    const cats = new Set(ideas.map(i => i.category));
    if (!cats.has("practical") || !cats.has("creative") || !cats.has("absurd")) {
      return NextResponse.json(
        { error: "Ideas must include categories: practical, creative, absurd" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ideas }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

