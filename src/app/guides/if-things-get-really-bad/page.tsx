import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "If Things Get Really Bad — Just In Case",
  description:
    "When a cupboard isn't the whole answer — where to turn, who to trust, and what to do before you ever need to.",
  alternates: {
    canonical: "https://justincase.scot/guides/if-things-get-really-bad",
  },
  openGraph: {
    title: "If Things Get Really Bad — Just In Case",
    description:
      "When a cupboard isn't the whole answer — where to turn, who to trust, and what to do before you ever need to.",
    url: "https://justincase.scot/guides/if-things-get-really-bad",
    type: "article",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          className="text-sm text-[var(--brand)] underline"
          href="/"
        >
          ← Back to Just In Case
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
          Guide
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          If Things Get Really Bad
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Everything on Just In Case is built for the disruptions most households
            actually face — a rough weekend without power, a supply hiccup, a bad
            fortnight. A long season&rsquo;s worth of food covers a lot of ground.
          </p>
          <p>
            But we won&rsquo;t pretend a cupboard is the whole answer if things go
            on longer, or get worse, than that. Being honest about where our answer
            runs out is part of what we&rsquo;re for.
          </p>

          <div className="section-divider my-8" />

          <p className="font-bold text-[var(--foreground)]">
            A cupboard and good neighbours aren&rsquo;t alternatives. A cupboard buys
            you time. Time is what lets everything else work.
          </p>
          <p>
            This page is worth reading now — before any disruption — so that when you
            need to know where the other doors are, you already do.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            The people nearest you
          </h2>
          <p>
            If you don&rsquo;t know your neighbours yet, that&rsquo;s worth more
            than another shelf of food.
          </p>
          <p>
            In every real, prolonged disruption — flooding, extended power loss,
            severe weather — the households that cope best tend to be the ones who
            know who&rsquo;s around them. Knowing who&rsquo;s elderly, who&rsquo;s
            got a baby, who has a working landline or a spare generator: none of that
            costs anything, and it can&rsquo;t be bought in a panic. A cupboard
            handles the first stretch. People handle the rest.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Official help is built for exactly this
          </h2>
          <p>
            Local authorities, the Scottish Government, and emergency services have
            resilience plans for prolonged disruptions — evacuation routes, rest
            centres, welfare support, supply distribution. This infrastructure exists
            and is tested. It works better than any single household going it alone,
            and it&rsquo;s designed to reach people who need it.
          </p>
          <p>
            The place to start is{" "}
            <a
              href="https://ready.scot"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              Ready Scotland
            </a>{" "}
            — the Scottish Government&rsquo;s official preparedness guidance, written
            plainly for households. From there, your local council&rsquo;s emergency
            planning page (search &ldquo;[council name] emergency plan&rdquo;) will
            tell you what&rsquo;s specific to your area. For UK-wide guidance,{" "}
            <a
              href="https://www.gov.uk/prepare"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              gov.uk/prepare
            </a>{" "}
            covers the same ground for England, Wales, and Northern Ireland.
          </p>
          <p>
            Find these once, bookmark them, and you&rsquo;ve done something that
            matters.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Community resilience
          </h2>
          <p>
            Many areas have community resilience groups — often set up after a
            previous local flood, storm, or power outage — with people who know the
            area&rsquo;s specific risks and coordinate faster than any individual
            household could. Some councils run voluntary flood warden or community
            response programmes. Worth a quick search to find out if yours has one.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            What we won&rsquo;t tell you to do
          </h2>
          <p>
            We won&rsquo;t tell you to stockpile beyond a long season, arm yourself,
            or plan to go it alone and unseen. That&rsquo;s not because those things
            definitely don&rsquo;t help in every scenario — it&rsquo;s because Just
            In Case is for ordinary households getting through disruptions together
            with the people around them. If that&rsquo;s not the kind of preparedness
            you&rsquo;re looking for, this isn&rsquo;t the right site for it, and
            we&rsquo;d rather say so plainly than pretend otherwise.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Do this today
          </h2>
          <p>
            Three things, once, that take about five minutes:
          </p>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              <strong>Bookmark{" "}
                <a
                  href="https://ready.scot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--brand)] underline"
                >
                  ready.scot
                </a>
              </strong> — so you have it when you need it, not when you&rsquo;re
              searching for it.
            </li>
            <li>
              <strong>Find your council&rsquo;s emergency planning page</strong> —
              search &ldquo;[your council name] emergency plan.&rdquo; Save the link.
            </li>
            <li>
              <strong>Tell one neighbour this site exists</strong> — not because they
              need to read every page, but because knowing who around you is thinking
              about this stuff is where community resilience actually starts.
            </li>
          </ol>
        </div>
      </div>
    </main>
  );
}