"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

/* --------------------------------------------------------------------------
   Resumancer Color Palette applied to the ORIGINAL resume layout
   Fix: ensure COLORS object has valid JS syntax (no stray '#'), all values hex.
--------------------------------------------------------------------------- */
const COLORS = {
  page: "#EAF6D3",           // Page background
  topLink: "#678AF4",        // Accent links / pills
  h1: "#5D3067",             // Headings
  unconventional: "#00C588", // Accent highlight
  text: "#224074",           // Body text
  outline: "#224074",         // Borders / outlines
  button: "#A960A1",         // Buttons
  cardBg: "#FFFFFF",         // Card background
  boxBackground: "#B3DD98",  // Subtle card bg
} as const;

/* ------------------------------ Lightweight Tests ------------------------------
   These run once on mount in the browser to catch shape/syntax/layout regressions.
   DO NOT remove; add more tests below if needed. They are non-blocking in prod.
----------------------------------------------------------------------------- */
function hex(x: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(x);
}

function runSelfTests() {
  const requiredKeys = [
    "page",
    "topLink",
    "h1",
    "unconventional",
    "text",
    "outline",
    "button",
    "cardBg",
    "boxBackground",
  ] as const;

  requiredKeys.forEach((k) => {
    if (!(k in COLORS)) throw new Error(`COLORS missing key: ${k}`);
  });

  (Object.entries(COLORS) as [keyof typeof COLORS, string][]).forEach(([k, v]) => {
    if (typeof v !== "string" || !hex(v) || v[0] !== "#") {
      throw new Error(`COLORS.${String(k)} is not a valid hex color: ${String(v)}`);
    }
  });

  const header = document.querySelector('[data-testid="resume-header"]');
  const bio = document.querySelector('[data-testid="bio-card"]');
  const photo = document.querySelector('[data-testid="photo-card"]');
  const pdf = document.querySelector('[data-testid="pdf-object"]');
  if (!header || !bio || !photo || !pdf) {
    throw new Error("Layout elements missing: header/bio/photo/pdf");
  }

  // New: ensure PDF object has expected fixed height
  if (pdf instanceof HTMLElement) {
    const h = (pdf.getAttribute("height") || "").trim();
    if (h !== "900") throw new Error(`PDF height expected 900, found '${h}'`);
  }

  return "OK";
}

export default function ResumePage() {
  // Run tests once in the browser
  useEffect(() => {
    try {
      const res = runSelfTests();
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.info("ResumePage self-tests:", res);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw e;
    }
  }, []);

  return (
    <main className="min-h-screen" style={{ backgroundColor: COLORS.page, color: COLORS.text }}>
      {/* Header (exact layout from original page) */}
      <header className="py-3" data-testid="resume-header">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center h-16 gap-6 justify-start">
            <Link href="/" className="flex items-center gap-3" aria-label="Resumancer Home">
              <Image
                src="/logo-shield.png"
                alt="Resumancer logo"
                width={46}
                height={46}
                className="h-[46px] w-[46px]"
                priority
              />
              {/* Confirmed by user: brand reads 'Resumancer' */}
              <span className="text-2xl font-extrabold" style={{ color: COLORS.h1 }}>
                Resum<span style={{ color: COLORS.unconventional }}>ancer</span>
              </span>
            </Link>

            <nav className="flex items-center gap-5 text-sm ml-auto">
              <Link
                href="/"
                className="rounded-lg px-5 py-2 font-semibold shadow-sm hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a", border: `1px solid ${COLORS.outline}` }}
              >
                Home
              </Link>
              <a
                href="mailto:brigidrose@gmail.com"
                className="rounded-lg px-5 py-2 font-semibold shadow-sm hover:brightness-95"
                style={{ backgroundColor: "#d9ecff", color: "#0f172a", border: `1px solid ${COLORS.outline}` }}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Bio + Photo (equal-height cards on md+) */}
        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {/* Bio card (2/3) */}
          <div
            className="rounded-2xl p-6 shadow-sm h-[420px] md:col-span-2 overflow-auto"
            style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.outline}` }}
            data-testid="bio-card"
          >
            <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.h1 }}>
              Meet My Maker
            </h2>

            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Hi there! I’m Brigid, the maker of this quirky little web app that I hope you have enjoyed. I have been a Product Manager for close to a decade, and I love what I do! As a former start up CTO and a lifetime art lover, I love a creative and technical challenge and I care deeply about bringing things into the world that thrill and delight people. Whether that be new and innovative products like a smart charm bracelet, or quirky art projects like a talking chair, or this here web app. As a seasoned teacher, I am also passionate about education and mentorship. I love to empower others to explore their passions and to recognize their potential. If you are looking for someone who doubles as an experienced professional as well as the company personality hire, then look no further!
              </p>
              <p>
                Reach out me and we can have a chat about what value I can bring to your company. I can’t wait to hear from you!
              </p>
            </div>

            <div className="mt-4 text-sm">
              Checkout my{' '}
              <a
                href="https://www.linkedin.com/in/brigidrose/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
                style={{ color: COLORS.topLink }}
              >
                LinkedIn
              </a>
              .
            </div>
          </div>

          {/* Photo card (1/3) */}
          <div
            className="rounded-2xl p-4 shadow-sm h-[420px] md:col-span-1 flex items-center justify-center relative"
            style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.outline}` }}
            data-testid="photo-card"
          >
            <Image
              src="/brigid-headshot.png"
              alt="Brigid Walsh headshot"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
              className="rounded-2xl object-contain"
              priority
            />
          </div>
        </section>

        {/* PDF Viewer — Confirmed height = 900px */}
        <section
          className="rounded-2xl p-6 shadow-sm"
          style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.outline}` }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: COLORS.h1 }}>Resume (PDF)</h2>
            <a
              href="/brigid-resume.pdf"
              download
              className="text-sm rounded-lg px-3 py-1.5 hover:bg-black/5"
              style={{ border: `1px solid ${COLORS.outline}`, color: COLORS.text }}
            >
              Download PDF
            </a>
          </div>

          {/* Inline PDF viewer with graceful fallback */}
          <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.outline}` }}>
            <object
              data="/brigid-resume.pdf#view=FitH"
              type="application/pdf"
              width="100%"
              height="900"
              aria-label="Embedded resume PDF"
              data-testid="pdf-object"
            >
              <p className="p-4 text-sm opacity-80" style={{ color: COLORS.text }}>
                Can’t display the PDF here.{' '}
                <a className="underline" href="/brigid-resume.pdf" target="_blank" rel="noreferrer" style={{ color: COLORS.topLink }}>
                  Open it in a new tab
                </a>.
              </p>
            </object>
          </div>
        </section>

        <footer className="mt-8 text-xs opacity-80" style={{ color: COLORS.text }}>
          If the PDF doesn’t load on mobile, use the Download button above.
        </footer>
      </div>
    </main>
  );
}

