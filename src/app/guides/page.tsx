import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides — Just In Case",
  description:
    "Eight plain-written guides on UK emergency food and household preparedness: what to store, where to keep it, what it costs, and what to do when the lights go out.",
  alternates: {
    canonical: "https://justincase.scot/guides",
  },
  openGraph: {
    title: "Guides — Just In Case",
    description:
      "Eight plain-written guides on UK emergency food and household preparedness — free to read.",
    url: "https://justincase.scot/guides",
    type: "website",
  },
};

type Guide = {
  slug: string;
  title: string;
  blurb: string;
};

const WHAT_TO_STORE: Guide[] = [
  {
    slug: "emergency-food-needs",
    title: "How much food does a household actually need",
    blurb:
      "The calorie maths, the child multipliers, and why “stock up” without a number isn’t advice.",
  },
  {
    slug: "storage-without-bunker",
    title: "Storage without a bunker",
    blurb:
      "A shoebox, a shelf, a whole cupboard, under the bed. What fits where, with real volume estimates.",
  },
  {
    slug: "gear-worth-having",
    title: "Gear worth having",
    blurb:
      "The kit that earns its place: sealing, shelving, fire safety. What costs almost nothing and what to skip.",
  },
];

const USING_AND_GETTING_THROUGH: Guide[] = [
  {
    slug: "when-powers-out",
    title: "Power out: what changes in the kitchen",
    blurb:
      "Which foods still work, which need cooking, and the eat-from-the-tin items that need nothing at all.",
  },
  {
    slug: "car-kit",
    title: "Car kit",
    blurb:
      "What to keep in the car, why it’s a different list from the house, and what costs almost nothing.",
  },
  {
    slug: "if-things-get-really-bad",
    title: "If things get really bad",
    blurb:
      "Neighbours, official help, community resilience. What to do today, not later.",
  },
  {
    slug: "when-its-over",
    title: "When it&rsquo;s over: food safety after a disruption",
    blurb:
      "What to keep, what to throw away, what the FSA actually says about thawed food.",
  },
  {
    slug: "what-we-leave-out",
    title: "What we deliberately leave out",
    blurb:
      "The things this site doesn’t cover, and where to find them if you need them.",
  },
];

function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group block rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="heading-serif text-lg leading-snug">{guide.title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--secondary)]">{guide.blurb}</p>
    </Link>
  );
}

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Link className="pt-10 block text-sm text-[var(--brand)] underline" href="/">
        ← Back to Just In Case
      </Link>

      <header className="mt-6 rounded-3xl bg-[var(--success)] px-8 py-12 text-[var(--card)]">
        <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
          Eight guides. Written plainly. Free to read.
        </h1>
        <div className="mt-6 h-1 w-16 rounded-full bg-[var(--brand)]" />
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <section aria-labelledby="what-to-store-heading">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
            How much is enough · Where it actually goes · What it really costs
          </p>
          <h2
            id="what-to-store-heading"
            className="mt-2 font-serif text-2xl font-semibold text-[var(--brand-dark)]"
          >
            What to store and where to keep it
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_TO_STORE.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section aria-labelledby="using-heading" className="mt-12">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
            What it takes to cook it · What to do when it does
          </p>
          <h2
            id="using-heading"
            className="mt-2 font-serif text-2xl font-semibold text-[var(--brand-dark)]"
          >
            Using it and getting through it
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USING_AND_GETTING_THROUGH.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-base leading-7 text-[var(--secondary)]">
            Ready to make a plan? The planner works out what to buy, what it costs,
            and how long it would keep your household fed.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
          >
            Open the planner
          </Link>
        </section>

        <footer className="no-print mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[var(--brand-dark)]">
            Just In Case — justincase.scot
          </p>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
            <a href="/why">Why this exists</a>
            <a href="/changelog">What&rsquo;s changed</a>
            <a href="/guides">Library</a>
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
          </nav>
          <p className="mt-4 text-xs text-[var(--muted)]">
            Some links are affiliate links. We earn a small commission at no cost to you.
          </p>
        </footer>
      </div>
    </main>
  );
}