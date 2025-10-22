"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

/* ---------- Theme (new palette) ---------- */
const COLORS = {
  page: "#B3DD98",          // page background
  topLink: "#678AF4",       // top nav links
  h1: "#000000",            // H1 color
  unconventional: "#651A4B",// "Unconventional" accent
  text: "#000000",          // general body text
  outline: "#194D32",       // borders/outlines
  button: "#A960A1",        // Inspire me button
  boxBackground: "#E9F7DF", // card/box background
} as const;

/* ---------- UI bits ---------- */
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
        style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}
      >
        <div className="flex items-center gap-3">
          <ThinkingDots />
          <div className="text-sm" style={{ color: COLORS.text }}>Cooking up ideas… this can take a few seconds</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Types + helpers ---------- */
type Idea = {
  category: "practical" | "creative" | "absurd";
  title: string;
  why: string;
  plan: string;
  opener: string;
};
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function badgeStyle(cat: Idea["category"]) {
  if (cat === "practical") return { backgroundColor: COLORS.outline, color: "#FFFFFF", border: `1px solid ${COLORS.outline}` } as const;
  if (cat === "creative")  return { backgroundColor: COLORS.topLink, color: "#FFFFFF", border: `1px solid ${COLORS.outline}` } as const;
  return { backgroundColor: COLORS.unconventional, color: "#FFFFFF", border: `1px solid ${COLORS.outline}` } as const;
}
function badgeClasses() {
  return "rounded-full px-2 py-0.5 text-xs capitalize";
}
function formatShareText(it: Idea) {
  return [
    `**${capitalize(it.category)} — ${it.title}**`,
    `**Why it fits:** ${it.why}`,
    `**30-day plan:**\n${it.plan}`,
    `**LinkedIn opener:** ${it.opener}`,
    "\n#CareerPivot #BrigidBot",
  ].join("\n\n");
}

/* ---------- Mood helpers ---------- */
function moodLabel(m: number) {
  if (m <= 3) return "Realistic";
  if (m <= 7) return "Optimistic";
  return "Delusional";
}
function moodTagline(m: number) {
  if (m <= 3) return "I’m burnt out from searching for jobs. Help me pivot quickly.";
  if (m <= 7) return "Unemployment can’t steal my shine! Let’s shake things up!";
  return "Some say I’ve lost the plot, but I call it blue sky thinking!";
}
function auraColor(m: number) {
  if (m <= 3) return COLORS.unconventional;
  if (m <= 7) return COLORS.topLink;
  return COLORS.button;
}

/* ---------- Main component ---------- */
export default function BrigidBotPage() {
  const [background, setBackground] = React.useState(
    "Full-stack engineer turned product strategist; shipped 3 SaaS tools; loves rapid prototyping."
  );
  const [interests, setInterests] = React.useState("climate tech, fintech, edtech, open source");
  const [mood, setMood] = React.useState(5);

  const [loading, setLoading] = React.useState(false);
  const [ideas, setIdeas] = React.useState<Idea[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [logoOk, setLogoOk] = React.useState(true);
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setIdeas(null);
    try {
      const resp = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, interests, mood }),
      });
      if (!resp.ok) {
        const { error, detail } = await resp.json().catch(() => ({}));
        throw new Error(error || `HTTP ${resp.status} ${resp.statusText}${detail ? `: ${detail}` : ""}`);
      }
      const data = await resp.json();
      setIdeas(data.ideas);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
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
          ta.focus();
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
      <header className="py-3">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center h-16 gap-6 justify-between">
            <Link href="/" className="flex items-center gap-3">
              {logoOk ? (
                <Image src="/logo-shield.png" alt="Resumancer logo" width={46} height={46}
                  className="h-[46px] w-[46px]" onError={() => setLogoOk(false)} />
              ) : (
                <div className="h-[46px] w-[46px] rounded-full" style={{ backgroundColor: COLORS.outline }} />
              )}
              <span className="text-2xl font-extrabold" style={{ color: COLORS.h1 }}>
                Resumancer <span style={{ color: COLORS.unconventional }}>Bot</span>
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              {["Home", "About", "Contact"].map((t) => (
                <Link key={t} href="#" className="text-sm font-semibold hover:underline"
                  style={{ color: COLORS.topLink }}>
                  {t}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT */}
          <section className="flex flex-col">
            <header className="mb-6">
              <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: COLORS.h1 }}>
                Your <span className="font-bold" style={{ color: COLORS.unconventional }}>Unconventional</span> Career Coach
              </h1>
              <p className="mt-1 text-sm italic" style={{ color: COLORS.text }}>
                For those who are ready to embrace their true calling!
              </p>
            </header>
          </section>

          {/* RIGHT: Inputs */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}>
              <label className="block">
                <span className="font-medium" style={{ color: COLORS.text }}>Your background (one-liner is fine)</span>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", color: COLORS.text, border: `1px solid ${COLORS.outline}`, outlineColor: COLORS.topLink }}
                  rows={3}
                />
              </label>

              <label className="mt-5 block">
                <span className="font-medium" style={{ color: COLORS.text }}>Interests (comma-separated)</span>
                <input
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", color: COLORS.text, border: `1px solid ${COLORS.outline}`, outlineColor: COLORS.topLink }}
                />
              </label>

              {/* Mood Slider + emoji + bottom text */}
              <div className="mt-5">
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="mt-2 w-full"
                  style={{ accentColor: COLORS.topLink }}
                />
                <div className="mt-2 flex justify-between text-base">
                  <span>😑</span><span>😁</span><span>🤪</span>
                </div>
                <div className="mt-2 flex justify-between text-xs" style={{ color: COLORS.text }}>
                  <span className="w-1/3 text-left pr-2 leading-snug">
                    I’m burnt out from searching for jobs.<br />Help me pivot quickly.
                  </span>
                  <span className="w-1/3 text-center leading-snug">
                    Unemployment can’t steal my shine!<br />Let’s shake things up!
                  </span>
                  <span className="w-1/3 text-right pl-2 leading-snug">
                    Some call me crazy.<br />I call me innovative.
                  </span>
                </div>

                <div className="mt-4 text-left">
                  <p className="font-extrabold text-xl" style={{ color: auraColor(mood) }}>{moodLabel(mood)}</p>
                  <p className="text-sm italic" style={{ color: COLORS.text }}>{moodTagline(mood)}</p>
                </div>
              </div>

              {/* Button with spinner */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={generate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white shadow-sm hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2"
                  style={{ backgroundColor: COLORS.button, outlineColor: COLORS.button }}
                  aria-busy={loading}
                >
                  {loading ? (<><Spinner className="h-4 w-4" />Generating…</>) : ("Inspire me")}
                </button>
                {error && <span className="text-sm" style={{ color: COLORS.unconventional }}>Error: {error}</span>}
              </div>
            </div>

            {!ideas && (
              <div className="rounded-2xl p-5 shadow-sm"
                   style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}>
                <p style={{ color: COLORS.text }}>Your ideas will appear below after you click Inspire me.</p>
              </div>
            )}
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
                <article key={i}
                  className="rounded-2xl p-5 shadow-sm flex flex-col min-h-[260px]"
                  style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}>
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

        <footer className="mt-6 text-xs" style={{ color: COLORS.text }}>
          Built by Brigid Walsh. Fueled by caffeine and the belief that when the going gets weird, the weird turn pro.
        </footer>
      </div>

      {/* Loading overlay + keyframes */}
      <LoadingOverlay show={loading} />
      <style>{`@keyframes bb-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .6; } 40% { transform: translateY(-6px); opacity: 1; } }`}</style>
    </main>
  );
}

