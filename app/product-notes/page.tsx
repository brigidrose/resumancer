"use client";

import Link from "next/link";

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

export default function ProductNotesPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: COLORS.page, color: COLORS.text }}
    >
      {/* Header */}
      <header className="py-6" data-testid="product-notes-header">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <span
                className="text-4xl"
                role="img"
                aria-label="crystal ball"
              >
                🔮
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: COLORS.h1 }}
              >
                Resumancer
              </span>
            </Link>

            <nav className="flex items-center gap-5 text-sm ml-auto">
  <Link
    href="https://resumancer.app/"
    className="rounded-lg px-5 py-2 font-semibold shadow-sm hover:brightness-95"
    style={{
      backgroundColor: "#D6B3E5",
      color: "#0f172a",
      //border: `1px solid ${COLORS.outline}`,
    }}
  >
    Home
  </Link>

  <Link
    href="https://resumancer.app/resume"
    className="rounded-lg px-5 py-2 font-semibold shadow-sm hover:brightness-95"
    style={{
      backgroundColor: "#D6B3E5",
      color: "#0f172a",
      border: `1px solid ${COLORS.outline}`,
    }}
  >
    Resume
  </Link>

  <a
    href="mailto:brigidrose@gmail.com"
    className="rounded-lg px-5 py-2 font-semibold shadow-sm hover:brightness-95"
    style={{
      backgroundColor: "#D6B3E5",
      color: "#0f172a",
      border: `1px solid ${COLORS.outline}`,
    }}
  >
    Contact
  </a>
</nav>

          </div>
        </div>
      </header>

      {/* Content */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6 space-y-6">
          {/* Intro */}
          <div className="space-y-2">
            <h1
              className="text-3xl font-bold"
              style={{ color: COLORS.h1 }}
            >
              Product Requirements Document
            </h1>
          </div>

          {/* PRD Body */}
          <div
            className="rounded-2xl p-6 md:p-8 shadow-sm space-y-8"
            style={{
              backgroundColor: COLORS.cardBg,
              border: `1px solid ${COLORS.outline}`,
            }}
          >
            {/* 📋 About This Document */}
<section className="space-y-3">
  <h2 className="text-xl font-semibold">📋 About This Document</h2>
  <p className="text-sm leading-relaxed">
    This page serves as an example of my product documentation style. 
    It uses Resumancer as a lightweight case study to showcase how I approach 
    problem definition, user needs, solution framing, and the end-to-end 
    execution of an AI-powered tool. While Resumancer is a personal side project, 
    the format and structure here reflect the same methods I apply in my 
    professional product management work.
  </p>
</section>
            {/* ⚠️ Problem */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">⚠️ Problem</h2>

              <h3 className="text-sm font-semibold">
                What problem are we solving?
              </h3>
              <p className="text-sm leading-relaxed">
                In today&apos;s oversaturated job market, qualified candidates are
                getting lost in the large volume of applications being generated
                by a new algorithm-driven hiring ecosystem. Many job seekers feel
                stuck, and are tired of recycling the same resume endlessly, only
                to see very few results. Even strong applicants struggle to
                articulate what makes them unique, and are looking for strategies
                that would help them differentiate themselves in ways recruiters
                actually notice.
              </p>

              <h3 className="text-sm font-semibold pt-2">For whom?</h3>
              <p className="text-sm leading-relaxed">
                Resumancer is built for job seekers across different industries who
                feel invisible in the application process. This includes:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  People who are qualified but receiving little traction or
                  interview callbacks.
                </li>
                <li>
                  Candidates who are looking to change industries but aren&apos;t
                  sure how to translate their existing skills.
                </li>
                <li>
                  Applicants who want to find new and creative ways to make
                  themselves more memorable or differentiated but don&apos;t know
                  how to do it strategically.
                </li>
                <li>
                  People overwhelmed by the emotional burnout of job searching and
                  looking for motivation, clarity, and confidence.
                </li>
              </ul>

              <h3 className="text-sm font-semibold pt-2">
                When do they experience this issue?
              </h3>
              <p className="text-sm leading-relaxed">
                They feel this pain most acutely when:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Feeling demoralized by the repetitive, transactional nature of
                  online job boards.
                </li>
                <li>
                  Applying to countless jobs and receiving very few requests to
                  interview.
                </li>
                <li>
                  Trying to pivot roles or industries and struggling to articulate
                  how their background fits.
                </li>
              </ul>

              <h3 className="text-sm font-semibold pt-2">
                What data, research, and feedback do we have?
              </h3>
              <p className="text-sm leading-relaxed">
                Since this application was developed as my own creative method for
                standing out, the primary research I have at this time is my own
                lived experience as a job seeker. Before starting this project, I
                conducted rudimentary market research to see how many tools might
                exist for people experiencing the same problem. From what I
                uncovered, the primary method for solving this issue is working
                1:1 with a career coach, which may be cost prohibitive for some
                applicants.
              </p>
              <p className="text-sm leading-relaxed">
                From a quantitative perspective, I have included basic page view
                analytics in this application. For future iterations, I would
                likely include:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Unique visitors</li>
                <li>Time on site</li>
                <li>Bounce rate</li>
                <li>Ideas generated per session</li>
                <li>Cards shared (or ideally saved) rate</li>
              </ul>

              <h3 className="text-sm font-semibold pt-2">Why is it important?</h3>
              <p className="text-sm leading-relaxed">
                When you&apos;re struggling to find work, the process can feel
                demoralizing, destabilizing, and even frightening if money is
                tight. Career coaches are expensive, and not everyone has the
                resources to pay for personalized support. By creating a free,
                accessible tool that helps users generate new ways to position
                themselves, we give people a sense of control and momentum. It
                allows them to build something tangible and feel progress without
                additional financial strain.
              </p>
              <p className="text-sm leading-relaxed">
                Resumancer aims to empower people to:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Find their unique strengths.</li>
                <li>Communicate their value more clearly.</li>
                <li>Present themselves in memorable, human ways.</li>
                <li>Access practical and creative ideas for marketability.</li>
                <li>
                  Infuse their materials with personal flare that feels authentic.
                </li>
                <li>
                  Receive personalized guidance that actually matches who they are.
                </li>
              </ul>
            </section>

            {/* 💍 Proposal */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">💍 Proposal</h2>

              <h3 className="text-sm font-semibold">
                How are we solving this issue?
              </h3>
              <p className="text-sm leading-relaxed">
                Resumancer gives job seekers personalized, easy-to-use guidance
                that helps them market themselves more clearly, creatively,
                confidently, and inexpensively. Users input their target role,
                industry, and context, and the tool generates tailored ideas in a
                consistent tone based on their selected mood.
              </p>
              <p className="text-sm leading-relaxed">
                Technically, it&apos;s a lightweight Next.js app that sends a
                single optimized request to OpenAI&apos;s API and returns three
                structured idea paths. The interface is simple and performant,
                allowing people to quickly experiment, refine, and build momentum
                in their job search.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                What alternatives did we consider?
              </h3>
              <p className="text-sm leading-relaxed">
                This project began as a way for me to learn AI development while
                creating something memorable to share with recruiters. The first
                version was a tongue-in-cheek &quot;career pivot generator&quot;
                and more of a commentary on job-search frustration than it was a
                genuinely useful tool.
              </p>
              <p className="text-sm leading-relaxed">
                As I iterated, I realized it had the potential to be more than a
                comedic stand-alone application to help recruiters remember me. By
                reframing it as a marketability tool, the concept shifted from
                satire to something that could actually help users stand out, as
                well as be built upon in the future. Instead of just entertaining
                recruiters for my own job search purposes, it now helps people
                generate ideas for their own version of a &quot;Resumancer&quot;:
                a unique, personalized and (sometimes) practical way to boost
                their own self-marketing.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                Why did we land on this?
              </h3>
              <p className="text-sm leading-relaxed">
                Resumancer gives users new angles to explore based on their own
                unique attributes. It meets people emotionally where they are
                (burnt out, optimistic, just trying to have fun) while still
                producing genuinely useful, professional outputs that make them
                more attractive candidates.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                What is the general shape of this solution?
              </h3>
              <p className="text-sm leading-relaxed">
                Resumancer is structured as a simple guided workflow:
              </p>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                <li>
                  <span className="font-semibold">User provides inputs:</span>{" "}
                  target role, industry, additional context, and mood.
                </li>
                <li>
                  <span className="font-semibold">
                    System generates three ideas
                  </span>{" "}
                  (all aligned with the chosen mood): creative, practical, and
                  occasionally absurd.
                </li>
                <li>
                  <span className="font-semibold">
                    User can regenerate, refine, or use ideas
                  </span>{" "}
                  to shape resumes, cover letters, personal branding, and job
                  search strategies.
                </li>
              </ol>

              <h3 className="text-sm font-semibold pt-2">
                Have we considered performance, scalability, and cost?
              </h3>
              <p className="text-sm leading-relaxed">
                Yes. The solution is intentionally lightweight and cost-controlled:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  <span className="font-semibold">Backend:</span> One API call
                  per generation keeps costs predictable. No excessive chaining or
                  embeddings. No heavy database until needed, which keeps
                  infrastructure overhead low.
                </li>
                <li>
                  <span className="font-semibold">Frontend:</span> Next.js 16
                  with Turbopack ensures fast dev and production builds. Minimal
                  client-side libraries reduce bundle size.
                </li>
                <li>
                  <span className="font-semibold">Deployment:</span> Vercel&apos;s
                  edge network provides fast global load times without extra
                  configuration. A static-plus-serverless hybrid approach allows
                  the app to scale without manual intervention.
                </li>
                <li>
                  <span className="font-semibold">Caching (future):</span>{" "}
                  Potential future additions include caching responses for faster
                  load times and lower token usage, especially for repeated or
                  similar queries.
                </li>
              </ul>
            </section>

            {/* ⏭️ Future Steps & Strategic Direction */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">
                ⏭️ Future Steps &amp; Strategic Direction
              </h2>
              <p className="text-sm leading-relaxed">
                Even though Resumancer is a personal project, there&apos;s clear
                room to evolve it into a more robust, user-centered experience.
                Potential next steps include:
              </p>

              <h3 className="text-sm font-semibold">
                1. Add lightweight analytics
              </h3>
              <p className="text-sm leading-relaxed">
                Track unique visitors, time on site, bounce rate, ideas
                generated per session, cards shared, and returning users. This
                would help validate whether the tool drives real value for job
                seekers and identify where users drop off.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                2. Expand the feature set
              </h3>
              <p className="text-sm leading-relaxed">
                Potential additions include:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>&quot;Save this idea&quot; or &quot;Email to myself&quot;.</li>
                <li>A simple idea history page powered by a small database.</li>
                <li>
                  A branded Resumancer profile page and PDF download that users
                  can share with recruiters.
                </li>
                <li>
                  A longer, more in-depth guided version of each recommendation
                  that helps users turn an idea into polished resume or LinkedIn
                  copy.
                </li>
              </ul>

              <h3 className="text-sm font-semibold pt-2">
                3. Improve performance and scalability
              </h3>
              <p className="text-sm leading-relaxed">
                Optimize prompt design, introduce minimal caching to reduce
                latency, and keep the infrastructure lightweight to maintain low
                operational costs even as usage grows.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                4. Refine messaging and positioning
              </h3>
              <p className="text-sm leading-relaxed">
                Clarify how Resumancer helps users stand out, and improve
                onboarding so users instantly understand what it does and how it
                benefits their job search. This may include a short tour,
                example inputs, and before-and-after style demonstrations.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                5. Conduct small-scale user testing
              </h3>
              <p className="text-sm leading-relaxed">
                Run quick, qualitative tests with a handful of job seekers to
                gather feedback on clarity, tone, and usefulness. Use this
                feedback to refine copy, adjust prompting, and improve UX.
              </p>

              <h3 className="text-sm font-semibold pt-2">
                6. Prepare for a broader share-out
              </h3>
              <p className="text-sm leading-relaxed">
                Once V1 feels stable, share Resumancer on LinkedIn, in a
                portfolio, and with recruiters as a demonstration of product
                thinking, UX design, and applied AI. This can also serve as a
                living case study that evolves over time as I incorporate real
                feedback and usage data.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

