"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

/* ---------- Theme (your new palette) ---------- */
const COLORS = {
  page: "#EAF6D3 ",          // Background
  topLink: "#678AF4",       // Top link buttons / accents
  h1: "#5D3067",            // H1 text
  unconventional: "#00C588",// 'Unconventional' word
  text: "#224074",          // Body text
  outline: "#224074",       // Borders / outlines
  button: "#A960A1",        // Inspire Me button
  cardBg: "#FFFFFF",        // Card background
  boxBackground: "#B3DD98", // Right-panel card bg
} as const;

/* ---------- Types ---------- */
type Idea = {
  category: "practical" | "creative" | "absurd";
  title: string;
  why: string;
  plan: string;
  opener: string;
};

/* ---------- Inline UI bits ---------- */
function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: COLORS.topLink, animation: `bb-bounce 900ms ${delay} infinite ease-in-out` }}
    />
  );
}
function ThinkingDots() {
  return (
    <div className="flex items-end gap-1" role="status" aria-label="Generating">
      <Dot delay="0ms" />
      <Dot delay="120ms" />
      <Dot delay="240ms" />
    </div>
  );
}
function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div aria-live="assertive" className="fixed inset-0 z-[60] grid place-items-center bg-black/20 backdrop-blur-[2px]">
      <div
        className="rounded-2xl p-6 shadow-xl ring-1 ring-black/5"
        style={{ backgroundColor: COLORS.cardBg, border: `2px solid ${COLORS.outline}` }}
      >
        <div className="flex items-center gap-3">
          <ThinkingDots />
          <div className="text-sm" style={{ color: COLORS.text }}>Cooking up ideas… this can take a few seconds</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function badgeClasses() { return "rounded-full px-2 py-0.5 text-xs capitalize"; }
function badgeStyle(cat: Idea["category"]) {
  if (cat === "practical") return { backgroundColor: COLORS.outline, color: "#fff", border: `1px solid ${COLORS.outline}` } as const;
  if (cat === "creative")  return { backgroundColor: COLORS.topLink, color: "#fff", border: `1px solid ${COLORS.outline}` } as const;
  return { backgroundColor: COLORS.unconventional, color: "#fff", border: `1px solid ${COLORS.outline}` } as const;
}
function formatShareText(it: Idea) {
  return [
    `**${capitalize(it.category)} — ${it.title}**`,
    `**Why it fits:** ${it.why}`,
    `**30-day plan:**\n${it.plan}`,
    `**LinkedIn opener:** ${it.opener}`,
    "\n#CareerPivot #Resumancer",
  ].join("\n\n");
}

/* ---------- Mood helpers ---------- */
function moodLabel(m: number) { if (m <= 3) return "Realistic"; if (m <= 7) return "Optimistic"; return "Delusional"; }
function moodTagline(m: number) {
  if (m <= 3) return "Practical advice for the burnt out job searcher.";
  if (m <= 7) return "Creative advice for the person who is still ready to take on the world despite no paycheck in 6 months.";
  return "Absurd advice. What's the point of working anyways? I think I'll just turn feral.";
}
function auraColor(m: number) { if (m <= 3) return COLORS.unconventional; if (m <= 7) return COLORS.topLink; return COLORS.button; }

/* ---------- Dev fallback ideas (used only if /api/ideas fails) ---------- */
const FALLBACK_IDEAS: Idea[] = [
  {
    category: "practical",
    title: "Growth PM for mission-driven fintech",
    why: "Your edtech + revenue chops port cleanly to regulated onboarding flows.",
    plan: "- Week 1: Map funnel & drop-offs\n- Week 2: A/B eligibility UX\n- Week 3: Activation dashboard\n- Week 4: Retention levers",
    opener: "I’ve scaled education products to millions—curious how you’re tackling activation vs. approval latency?",
  },
  {
    category: "creative",
    title: "AI-assisted Claims Coach prototype",
    why: "Bridges coaching UI experience with guided, high-friction forms.",
    plan: "- Week 1: Click-through Figma\n- Week 2: React prototype\n- Week 3: 5 usability tests\n- Week 4: Pilot metrics + rollout",
    opener: "I built coaching UIs that reduce cognitive load—imagine that applied to claims. Want a testable MVP sketch?",
  },
  {
    category: "absurd",
    title: "‘Blue-Sky’ Residency: PM in the Wild",
    why: "Package ambiguity as a 30-day embedded experiment.",
    plan: "- Week 1: Shadow ops + unknowns\n- Week 2: 3 bets doc\n- Week 3: Ship a tiny win\n- Week 4: Keep/kill/scale memo",
    opener: "Give me 30 days and a sandbox. I’ll ship one needle-moving win and leave a clear growth thesis.",
  },
];

/* ---------- Main component ---------- */
export default function Page() {
  const [background, setBackground] = React.useState(
    "Full-stack engineer turned product strategist; shipped 3 SaaS tools; loves rapid prototyping."
  );
  const [interests, setInterests] = React.useState("climate tech, fintech, edtech, open source");
  const [mood, setMood] = React.useState(5); // <-- use mood everywhere (API + results badge)
  const [loading, setLoading] = React.useState(false);
  const [ideas, setIdeas] = React.useState<Idea[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [logoOk, setLogoOk] = React.useState(true);
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  async function generate() {
  setLoading(true);
  setError(null);

  try {
    const resp = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ background, interests, mood }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`HTTP ${resp.status} ${resp.statusText}${text ? ` — ${text}` : ""}`);
    }

    const data = (await resp.json()) as { ideas?: Idea[] };
    if (!data?.ideas || !Array.isArray(data.ideas) || data.ideas.length === 0) {
      throw new Error("API returned no ideas");
    }

    setIdeas(data.ideas);
  } catch (err: any) {
    setIdeas(null); // no more fallback; just show error
    setError(err?.message || "Failed to fetch ideas");
  } finally {
    setLoading(false);
  }
}


  function shareIdea(it: Idea, idx: number) {
    const text = formatShareText(it);
    (async () => {
      try {
        if (
          typeof window !== "undefined" &&
          (window.isSecureContext || location.hostname === "localhost") &&
          navigator.clipboard?.writeText
        ) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("execCommand copy failed");
        }
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1200);
      } catch {
        window.prompt?.("Copy and paste this:", text);
      }
    })();
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: COLORS.page, color: COLORS.text }}>
      {/* Header */}
      <header className="py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              {logoOk ? (
                <Image
                  src="/logo-shield.png"
                  alt="Resumancer logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <div className="h-10 w-10 rounded-full" style={{ backgroundColor: COLORS.outline }} />
              )}
              <span className="text-2xl font-extrabold" style={{ color: COLORS.h1 }}>
                Resumancer
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              <a
                href="#"
                className="rounded-xl px-4 py-2 text-sm font-semibold shadow hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a" }}
                onClick={(e) => e.preventDefault()}
              >
                Resume
              </a>
              <a
                href="#"
                className="rounded-xl px-4 py-2 text-sm font-semibold shadow hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a" }}
                onClick={(e) => e.preventDefault()}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <section>
            <h1 className="text-5xl font-extrabold leading-tight" style={{ color: COLORS.h1 }}>
              Your <span style={{ color: COLORS.unconventional }}>Unconventional</span> Career Coach
            </h1>
            <p className="mt-2 italic" style={{ color: "#415a83" }}>
              For those who are ready to embrace their true calling!
            </p>

            <div className="mt-6 space-y-4 max-w-2xl">
              <p>
                Job search got you down? Tired of tossing your résumé into a black hole? Wondering if it’s finally time to
                follow that dream of becoming a professional beekeeper? You’re not alone, friend.
              </p>
              <p>
                That’s why we built a tiny tool to help you get unstuck and choose your next job adventure. Somewhere out
                there, there’s a paycheck with your name on it, and we’re going to help you find it.
              </p>
            </div>

            <div className="mt-6 h-px w-full" style={{ backgroundColor: "#e8d9b5" }} />

            <div className="mt-6">
              <h3 className="font-semibold" style={{ color: COLORS.h1 }}>How it works:</h3>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Tell me your background and interests.</li>
                <li>Adjust the slider to choose how realistic or outlandish you want the ideas.</li>
                <li>Hit <em>Inspire me</em> and <span className="underline">watch the magic happen</span>.</li>
                <li>
                  Get three directions: <strong>realistic</strong>, <strong>optimistic</strong>, and{" "}
                  <strong>delusional</strong>.
                </li>
              </ul>
            </div>

            <footer className="mt-10 text-sm" style={{ color: "#5a708f" }}>
              Built by Brigid Walsh. Fueled by caffeine and the belief that when the going gets weird, the weird turn pro.
            </footer>
          </section>

          {/* RIGHT: Inputs Card */}
          <aside>
            <div className="rounded-2xl p-6 shadow-md" style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}>
              <label className="block">
                <span className="font-medium" style={{ color: COLORS.h1 }}>Your background (one-liner is fine)</span>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
                  style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
                  rows={3}
                />
              </label>

              <label className="mt-6 block">
                <span className="font-medium" style={{ color: COLORS.h1 }}>Interests (comma-separated)</span>
                <input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
                  style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
                />
              </label>

              {/* ---- Mood Slider (inline; NO border, emojis tight, fixed-height text) ---- */}
              <div className="w-full rounded-2xl mt-6">
                {/* Header: left = bold title, right = dynamic label */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold leading-none">Mood Slider</h3>
                  <div className="text-sm md:text-base">{moodLabel(mood)}</div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value, 10))}
                  className="w-full"
                  aria-label="Mood slider from 0 to 10"
                />

                {/* Emoji ticks: left/middle/right, close to slider */}
                <div className="pt-[3px] flex w-full justify-between text-xl select-none">
                  <span aria-hidden="true">😑</span>
                  <span aria-hidden="true">😁</span>
                  <span aria-hidden="true">🤪</span>
                </div>

                {/* Under-slider copy (no heading word, fixed height so card doesn't jump) */}
                <div className="mt-3 h-[48px] overflow-hidden">
                  <p className="text-sm md:text-base leading-snug">
                    {moodTagline(mood)}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-white shadow-md hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 transition"
                  style={{ backgroundColor: COLORS.button }}
                  aria-busy={loading}
                >
                  {loading ? (<><Spinner className="h-4 w-4" />Generating…</>) : ("Inspire me")}
                </button>
                {error && <span className="ml-3 text-sm" style={{ color: COLORS.unconventional }}>Error: {error}</span>}
              </div>
            </div>
          </aside>
        </div>

        {/* Results */}
        {ideas && (
          <section className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: COLORS.h1 }}>Your ideas</h2>
              <span className="text-xs" style={{ color: auraColor(mood) }}>{moodLabel(mood)}</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((it, i) => (
                <article
                  key={i}
                  className="rounded-2xl p-5 shadow-sm flex flex-col min-h-[260px]"
                  style={{ backgroundColor: COLORS.cardBg, border: `2px solid ${COLORS.outline}` }}
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="text-lg font-semibold" style={{ color: COLORS.h1 }}>{i + 1}) {it.title}</h3>
                      <span className={badgeClasses()} style={badgeStyle(it.category)}>{it.category}</span>
                    </div>
                    <p className="text-sm"><span className="font-medium" style={{ color: COLORS.h1 }}>Why it fits:</span> {it.why}</p>
                    <p className="mt-2 whitespace-pre-line text-sm"><span className="font-medium" style={{ color: COLORS.h1 }}>30-day plan:</span>{"\n"}{it.plan}</p>
                    <p className="mt-2 text-sm"><span className="font-medium" style={{ color: COLORS.h1 }}>LinkedIn opener:</span> <span style={{ color: COLORS.unconventional }}>{it.opener}</span></p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => shareIdea(it, i)}
                      className="rounded-lg px-3 py-1.5 text-sm hover:bg-black/5 focus:outline-none focus:ring-2"
                      style={{ border: `1px solid ${COLORS.outline}`, color: COLORS.text, outlineColor: COLORS.topLink }}
                    >
                      {copiedIdx === i ? "Copied!" : "Share"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Full-screen overlay + keyframes */}
      <LoadingOverlay show={loading} />
      <style>{`@keyframes bb-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .6; } 40% { transform: translateY(-6px); opacity: 1; } }`}</style>
    </main>
  );
}
