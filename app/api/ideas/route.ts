import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

type Idea = {
  category: "practical" | "creative" | "absurd";
  title: string;
  why: string;
  plan: string;
  opener: string;
  suggested_timeframe?: string;
};

function moodProfile(mood: number) {
  const m = Math.max(0, Math.min(10, Math.round(mood)));
  const practical = Math.max(0, 1 - m / 6);
  const absurd = Math.max(0, (m - 4) / 6);
  const creative = 1 - Math.abs(m - 5) / 5;
  const sum = practical + creative + absurd || 1;
  const weights = {
    practical: practical / sum,
    creative: creative / sum,
    absurd: absurd / sum,
  };
  const temperature = 0.2 + (m / 10) * 0.6;
  const scope = m < 3 ? "tight, incremental"
            : m < 7 ? "balanced, ambitious but feasible"
                    : "wild, moonshot, rule-bending";
  const budget = m < 3 ? "under $500 and within 1 week"
             : m < 7 ? "reasonable budget within 1–4 weeks"
                     : "ignore budget; optimize for spectacle";
  const risk =  m < 3 ? "minimize risk; high feasibility"
             : m < 7 ? "moderate risk; good upside"
                     : "accept high risk and unknowns";
  return { m, weights, temperature, scope, budget, risk };
}

async function callOpenAI(payload: any, retries = 2, delayMs = 600) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok) return resp.json();

    // If rate limited or transient error, backoff then retry
    if (resp.status === 429 || resp.status >= 500) {
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
    }

    // Non-retryable or out of retries: throw with error text
    const text = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
   const {
  mood = 5,
  targetRole = "",
  industry = "",
  skills = [] as string[],
  interests = [] as string[],
  additionalContext = "",
    } = body;

    const { m, weights, temperature, scope, budget, risk } = moodProfile(mood);

  

    const system = "Return ONLY JSON that matches the schema.";
    const user = `
You are generating ideas for a JOB SEEKER, not a team already in-role.

Context:
- Target role: ${targetRole || "(not provided)"}
- Industry: ${industry || "(not provided)"}
- Skills/strengths: ${skills.length ? skills.join(", ") : "(none)"}
- Interests/hobbies: ${interests.length ? interests.join(", ") : "(none)"}
- Additoinal Context: ${additionalContext || "(none provided)"}
- Mood: ${m} (scope=${scope}; budget=${budget}; risk=${risk})
- Weights: practical=${weights.practical.toFixed(2)}, creative=${weights.creative.toFixed(2)}, absurd=${weights.absurd.toFixed(2)}

Previous idea titles (avoid repeating or rephrasing): ${Array.isArray(body.previousTitles) && body.previousTitles.length ? body.previousTitles.join(" | ") : "(none)"}
Novelty seed (nondeterminism hint): ${body.noveltySeed ?? "none"}

INSTRUCTIONS (tailored for transitioners / job seekers):
- Output exactly 3 ideas: categories = practical, creative, absurd.
- For each idea, include "suggested_timeframe" as a realistic duration (e.g., "2 weeks", "30–45 days", "3–6 months") based on the scope you propose.
- Each idea must help the job seeker create PUBLIC PROOF (a portfolio artifact) that hiring managers can see within the time horizon.
- Optimize for RESUME bullets, LINKEDIN posts, and a SHAREABLE LINK (GitHub, Notion, Figma, Loom, live demo).
- Tie each idea directly to the target role + industry. Name concrete tools (Figma, Mixpanel, Amplitude, SQL, Python, Airtable, Bubble, Retool, Webflow, etc) and artifacts (case study, teardown, dashboard, prototype, experiment readout).
- Respect constraints: if remote only → remote-friendly artifact; if no coding → no-code tools; if part-time → scope down.
- Avoid generic “do research / network” advice. Be specific: audience, data sources, steps, and a success metric.
- Ideas must be materially different from each other and from "Previous idea titles".

Return JSON with exactly 3 objects, in this order:
[
  { "category":"practical","title":"...","why":"...","plan":"...","opener":"..." },
  { "category":"creative","title":"...","why":"...","plan":"...","opener":"..." },
  { "category":"absurd","title":"...","why":"...","plan":"...","opener":"..." }
]

Definitions:
- "plan": 5–8 short lines outlining the artifact to build, tools to use, scope of work, distribution strategy (where it will be shared), and a measurable outcome (e.g., 50 survey completes, 1k views, 2 recruiter replies, 1 demo booked).
- "opener": a punchy LinkedIn opener to share the artifact and invite feedback.
- "suggested_timeframe": a realistic duration for completing the idea (e.g., "2 weeks", "30 days", "3–6 months") based on the scope of work you propose.

`;

    // ... keep your existing payload with response_format: json_schema ...
    // (no change needed except swapping the `user` content above)


    const payload = {
      model: "gpt-4o-mini",
      temperature,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ideas",
          schema: {
            type: "object",
            properties: {
              ideas: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string", enum: ["practical", "creative", "absurd"] },
                    title: { type: "string" },
                    why: { type: "string" },
                    plan: { type: "string" },
                    opener: { type: "string" },
                    suggested_timeframe: { type: "string" },
                  },
                  required: ["category","title","why","plan","opener","suggested_timeframe"],
                  additionalProperties: false
                }
              }
            },
            required: ["ideas"],
            additionalProperties: false
          }
        }
      },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ]
    };

    const data = await callOpenAI(payload);
    const content = data?.choices?.[0]?.message?.content ?? "";

    // Parse safely (schema should already guarantee shape)
    let ideas: Idea[] = [];
    try {
      const parsed = JSON.parse(content);
      ideas = parsed.ideas as Idea[];
    } catch (e) {
      // As a fallback, try to parse a bare array
      try {
        const arr = JSON.parse(content);
        ideas = Array.isArray(arr) ? arr : [];
      } catch {
        ideas = [];
      }
    }

    if (!ideas || ideas.length !== 3) {
      // Helpful debug response to see what came back
      return NextResponse.json(
        { error: "API returned no ideas", raw: content, mood: m },
        { status: 200 }
      );
    }

    return NextResponse.json({ ideas, mood: m, temperature });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
