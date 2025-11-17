"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = "https://resumancer.app";

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
  category: "creative" | "practical" | "absurd";
  title: string;
  why: string;
  plan: string;
  opener: string;
  suggested_timeframe?: string;
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
  if (cat === "practical") return { backgroundColor: "#28B7EC", color: "#fff", border: "1px solid #28B7EC" } as const;
  if (cat === "creative")  return { backgroundColor: "#BB92DC", color: "#fff", border: "1px solid #BB92DC" } as const;
  return { backgroundColor: "#EE53C7", color: "#fff", border: "1px solid #EE53C7" } as const;
}

function formatShareText(it: Idea) {
  const siteURL = "https://resumancer.app"; // placeholder until live
  const icons: Record<Idea["category"], string> = {
    practical: "🔧",
    creative: "🎨",
    absurd: "🦄",
  };

  return [
    `🚀 Ever feel stuck trying to figure out your next career move?`,
    `I built **Resumancer**, a little AI experiment that mixes realism, optimism, and a bit of delusion to spark new career ideas. Here’s what it came up with for me today 👇`,
    ``,
    `${icons[it.category]} **${capitalize(it.category)} Idea: ${it.title}**`,
    ``,
    `💡 **Why it fits:** ${it.why}`,
    ``,
    `🗓️ **30-Day Plan:**`,
    `${it.plan}`,
    ``,
    `💬 **LinkedIn opener:** "${it.opener}"`,
    ``,
    `🌐 Try it yourself at [Resumancer](${siteURL}) — built by [Brigid Walsh](https://www.linkedin.com/in/brigidrose/).`,
    ``,
    `#CareerPivot #Resumancer #JobSearch #CareerChange #Inspiration`,
  ].join("\n\n");
}


/* ---------- Mood helpers ---------- */
function moodLabel(m: number) { if (m <= 3) return "Creative"; if (m <= 7) return "Practical"; return "Absurd"; }
function moodTagline(m: number) {
  if (m <= 3) return "The sky is blue and I'm full of hope. Let's get creative!";
  if (m <= 7) return "I'm pretty burnt out. Let's make this quick.";
  return "Existence is illusory and I've completely lost the plot.";
}
function auraColor(m: number) { if (m <= 3) return COLORS.unconventional; if (m <= 7) return COLORS.topLink; return COLORS.button; }

/* ---------- Main component ---------- */
export default function Page() {
 // NEW structured inputs
  const [logoOk, setLogoOk] = React.useState(true);
const [skillsStr, setSkillsStr] = React.useState("");
const [interestsStr, setInterestsStr] = React.useState("");
const [mood, setMood] = React.useState(5);
const [ideas, setIdeas] = React.useState<Idea[] | null>(null);
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);
const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);
const prevTitlesRef = React.useRef<string[]>([]);
const [additionalContext, setadditionalContext] = React.useState("");


//Role Suggestions
const ALL_ROLES = [
  // Product
  "Product Manager", "Product Owner", "Growth Product Manager", "Technical Product Manager",
  // Engineering
  "Software Engineer", "Frontend Engineer", "Backend Engineer", "Full-Stack Engineer",
  "Data Engineer", "Machine Learning Engineer", "DevOps Engineer", "QA Engineer",
  // Design & Content
  "UX Designer", "UI Designer", "Product Designer", "Content Strategist", "Copywriter",
  "Technical Writer", "Video Editor",
  // Operations & Admin
  "Operations Manager", "Project Manager", "Program Manager", "Office Administrator",
  "Executive Assistant", "HR Coordinator",
  // Marketing & Sales
  "Marketing Manager", "Growth Marketer", "Content Marketer", "SEO Specialist",
  "Sales Operations Manager", "Customer Success Manager",
  // Education / Misc
  "Instructional Designer", "Research Analyst", "Community Manager"
];

const [targetRole, setTargetRole] = React.useState("");
const [showSuggestions, setShowSuggestions] = React.useState(false);

const filteredRoles = React.useMemo(() => {
  const q = targetRole.toLowerCase();
  if (!q) return ALL_ROLES.slice(0, 8); // short starter list
  return ALL_ROLES.filter((r) => r.toLowerCase().includes(q)).slice(0, 10);
}, [targetRole]);


//Industry Suggestions
const ALL_INDUSTRIES = [
  "EdTech", "Healthcare", "Fintech", "Climate Tech", "AI Tools",
  "E-commerce", "Media", "Gaming", "Travel", "Real Estate",
  "Retail", "Logistics", "Manufacturing", "Energy", "Clean Tech",
  "Nonprofit", "Government", "Legal Tech", "Entertainment",
  "Sports", "Food & Beverage", "Hospitality", "Cybersecurity",
  "MarTech", "HR Tech", "PropTech", "InsurTech"
];

const [industry, setIndustry] = React.useState("");
const [showIndustrySuggestions, setShowIndustrySuggestions] = React.useState(false);

const filteredIndustries = React.useMemo(() => {
  const q = industry.toLowerCase();
  if (!q) return ALL_INDUSTRIES.slice(0, 8);
  return ALL_INDUSTRIES.filter((x) => x.toLowerCase().includes(q)).slice(0, 10);
}, [industry]);





  // Only call API when user clicks "Inspire me"
  const abortRef = React.useRef<AbortController | null>(null);
  async function generate() {
    // cancel any in-flight request if user double-clicks
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
     const skills = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
const interests = interestsStr.split(",").map(s => s.trim()).filter(Boolean);

const resp = await fetch("/api/ideas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mood,
    targetRole,
    industry,
    skills,
    interests,
    additionalContext,
  }),
  signal: controller.signal,
});


      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`HTTP ${resp.status} ${resp.statusText}${text ? ` — ${text}` : ""}`);
      }

      const data = (await resp.json()) as { ideas?: Idea[]; error?: string; raw?: any };
      if (!data?.ideas || !Array.isArray(data.ideas) || data.ideas.length === 0) {
        // Surface debug info in console if backend returned raw
        if (data?.raw) console.debug("RAW from /api/ideas:", data.raw);
        throw new Error(data?.error || "API returned no ideas");
      }

      setIdeas(data.ideas);
    } catch (err: any) {
      if (err?.name === "AbortError") return; // user triggered a new request
      setIdeas(null);
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
              {/*Resume button*/}
              <a
                href="https://resumancer.app/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl px-4 py-2 text-sm font-semibold shadow hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a" }}
              
              >
                Resume
              </a>
              <a
                href="mailto:brigidrose@gmail.com"
                className="rounded-xl px-4 py-2 text-sm font-semibold shadow hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a" }}
                
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
              Your <span style={{ color: COLORS.unconventional }}>Unconventional</span> Marketability Coach
            </h1>
            <p className="mt-2 italic" style={{ color: "#415a83" }}>
              For the overqualified, under-noticed, and existentially unemployed.
            </p>

            <div className="mt-6 space-y-4 max-w-2xl">
              <p>
               <b> Hi! I am a work in progress! If you want to report a bug, please send your note to <a href="mailto:brigid.walsh@gmail.com?subject=I'd%20like%20to%20hire%20you!%20(and%20I%20found%20a%20bug)">brigidrose@gmail.com</a>, along with a request to interview. &#128578;
                </b>
              </p>
              <p>
                Feeling invisible on LinkedIn? Wondering if you've been tossing your resumes into a blackhole? 
                Realizing your new job manifestations just haven't been delivering? Well my friend, you are not alone.
              </p>
              <p>
                Resumancer will help you find creative, practical and even absurd ways to ressurect your job search from the purgatory in which it currently dwells
                so you can enchant the hiring directors and stand out amongst the crowd!
                Think of it as personal branding reanimation. Somewhere out there is a pay check with your name on it, and we are going to help you find it!
              </p>
            </div>

            <div className="mt-6 h-px w-full" style={{ backgroundColor: "#e8d9b5" }} />

            <div className="mt-6">
              <h3 className="font-semibold" style={{ color: COLORS.h1 }}>How it works:</h3>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Tell me your target role, industry, skills, interests and any other requirements you might have.</li>
                <li>Adjust the slider to choose how realistic or outlandish you your suggestions to be.</li>
                <li>Hit <em>Inspire me</em> and <span className="underline">watch the magic happen</span>!</li>
              </ul>
            </div>

         
          </section>

{/* RIGHT: Inputs Card */}
<aside>
  <div
    className="rounded-2xl p-6 shadow-md"
    style={{ backgroundColor: COLORS.boxBackground, border: `2px solid ${COLORS.outline}` }}
  >
    {/* NEW: structured inputs */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0">

      {/* Target role with typeahead */}
      <label className="block md:col-span-2 relative">
        <span className="font-medium" style={{ color: COLORS.h1 }}>🎯 Target role</span>
        <input
          value={targetRole}
          onChange={(e) => {
            setTargetRole(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Product Manager, Software Engineer, Wizard"
          className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
        />

        {showSuggestions && filteredRoles.length > 0 && (
          <ul
            className="absolute z-10 mt-1 w-full rounded-2xl border shadow-sm max-h-48 overflow-y-auto text-sm"
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.outline }}
          >
            {filteredRoles.map((role) => (
              <li
                key={role}
                onMouseDown={() => { setTargetRole(role); setShowSuggestions(false); }}
                className="px-3 py-2 hover:bg-black/5 cursor-pointer"
              >
                {role}
              </li>
            ))}
          </ul>
        )}
      </label>

      {/* Industry combobox */}
      <label className="block md:col-span-2 relative w-full">
        <span className="font-medium" style={{ color: COLORS.h1 }}>💼 Industry</span>
        <input
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
            setShowIndustrySuggestions(true);
          }}
          onFocus={() => setShowIndustrySuggestions(true)}
          onBlur={() => setTimeout(() => setShowIndustrySuggestions(false), 150)}
          placeholder="Media, Fintech, Paranormal Investigation"
          className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
        />

        {showIndustrySuggestions && filteredIndustries.length > 0 && (
          <ul
            className="absolute z-10 mt-1 w-full rounded-2xl border shadow-sm max-h-48 overflow-y-auto text-sm"
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.outline }}
          >
            {filteredIndustries.map((opt) => (
              <li
                key={opt}
                onMouseDown={() => { setIndustry(opt); setShowIndustrySuggestions(false); }}
                className="px-3 py-2 hover:bg-black/5 cursor-pointer"
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </label>

      {/* Skills */}
      <label className="block md:col-span-2">
        <span className="font-medium" style={{ color: COLORS.h1 }}>🧠 Skills & Strengths (comma-separated)</span>
        <input
          value={skillsStr}
          onChange={(e) => setSkillsStr(e.target.value)}
          placeholder="UX/UI, analytics, necromancy"
          className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
        />
      </label>

      {/* Interests */}
      <label className="block md:col-span-2">
        <span className="font-medium" style={{ color: COLORS.h1 }}>⚡ Interests / hobbies (comma-separated)</span>
        <input
          value={interestsStr}
          onChange={(e) => setInterestsStr(e.target.value)}
          placeholder="wearables, neuroscience, ouija boards"
          className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
        />
      </label>

      {/* Additional context */}
      <label className="block md:col-span-2">
        <span className="font-medium" style={{ color: COLORS.h1 }}>🧱 Additional context</span>
        <input
          value={additionalContext}
          onChange={(e) => setadditionalContext(e.target.value)}
          placeholder="low budget, no code, requires spell work"
          className="mt-2 w-full rounded-2xl p-3 placeholder-black/50 focus:outline-none focus:ring-2 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, color: COLORS.text, border: `1px solid ${COLORS.outline}` }}
        />
      </label>

           {/* Mood slider card */}
      <div className="md:col-span-2 mt-2">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium" style={{ color: COLORS.h1 }}>
              Mood Slider
            </span>
            <span className="text-sm font-semibold" style={{ color: COLORS.text }}>
              {moodLabel(mood)}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="mt-3 w-full"
          />

          {/* Emoji row under the slider */}
          <div className="mt-3 flex items-center justify-between text-2xl">
            <span>😑</span>
            <span>😁</span>
            <span>🤪</span>
          </div>

          {/* Tagline text */}
          <p className="mt-3 text-sm" style={{ color: COLORS.text }}>
            {moodTagline(mood)}
          </p>

          {/* Inspire button inside the card */}
          <div className="mt-4">
            <button
              onClick={generate}
              disabled={loading}
              className="rounded-xl px-4 py-3 font-semibold shadow hover:brightness-95 disabled:opacity-60"
              style={{ backgroundColor: COLORS.button, color: "#fff" }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-5 w-5" /> Generating…
                </div>
              ) : (
                "Inspire me"
              )}
            </button>
            {error && (
              <span className="ml-3 text-sm" style={{ color: "#b00020" }}>
                Error: {error}
              </span>
            )}
          </div>
        </div>
      </div>


    </div>{/* end inner grid */}
  </div>{/* end card */}
</aside>
</div>{/* end .grid grid-cols-1 ... lg:grid-cols-2 */}


        {/* Results */}
        {ideas && (
          <section className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: COLORS.h1 }}>Your ideas</h2>
              
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((it, i) => (
               <article
  key={i}
  className="relative rounded-2xl p-5 shadow-sm flex flex-col min-h-[260px]"
  style={{ backgroundColor: COLORS.cardBg, border: `2px solid ${COLORS.outline}` }}
>
  {/* fixed-position pill */}
  <span
    className={`${badgeClasses()} absolute top-4 right-4`}
    style={badgeStyle(it.category)}
  >
    {it.category}
  </span>

  <div className="flex-1">
    <div className="mb-1">
      <h3 className="pr-20 text-lg font-semibold" style={{ color: COLORS.h1 }}>
        {i + 1}) {it.title}
      </h3>
    </div>
    <p className="text-sm opacity-80">
  Suggested timeframe: {it.suggested_timeframe || "—"}
</p>


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
{ideas && (
  <p className="mt-10 text-sm text-center" style={{ color: "#5a708f" }}>
    Resumancer: An absurist take on the state of the job market and a <i>potentially</i> helpful tool. Built by Brigid Walsh.
  </p>
)}

      </div>

      {/* Full-screen overlay + keyframes */}
      <LoadingOverlay show={loading} />
      <style>{`@keyframes bb-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: .6; } 40% { transform: translateY(-6px); opacity: 1; } }`}</style>
    </main>
  );
}