import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ideas = [
    {
      category: "practical",
      title: "Growth PM for mission-driven fintech",
      why: "Your edtech + revenue chops port cleanly to regulated flows and onboarding funnels.",
      plan:
        "- Week 1: Map funnel, define drop-offs\n" +
        "- Week 2: Ship A/B on eligibility UX\n" +
        "- Week 3: Activation dashboard\n" +
        "- Week 4: Retention levers tied to underwriting speed",
      opener:
        "I’ve scaled education products to millions and love turning messy funnels into clean growth loops—curious how you’re tackling activation vs. approval latency?"
    },
    {
      category: "creative",
      title: "AI-assisted Claims Coach prototype",
      why: "Bridges your coaching UI experience with guided, high-friction forms.",
      plan:
        "- Week 1: Click-through Figma\n- Week 2: React prototype\n- Week 3: 5 usability tests\n- Week 4: Pilot metrics + rollout",
      opener:
        "I built coaching UIs that reduce cognitive load—imagine that applied to claims. Want a 1-pager on a testable MVP?"
    },
    {
      category: "absurd",
      title: "‘Blue-Sky’ Residency: PM in the Wild",
      why: "Package ambiguity as a 30-day embedded experiment.",
      plan:
        "- Week 1: Shadow ops + unknowns\n- Week 2: 3 bets doc\n- Week 3: Ship a tiny win\n- Week 4: Keep/kill/scale memo",
      opener:
        "Give me 30 days and a sandbox. I’ll ship one needle-moving win and leave you with a crystal-clear growth thesis."
    }
  ];
  return NextResponse.json({ ideas, echo: body }, { status: 200 });
}

