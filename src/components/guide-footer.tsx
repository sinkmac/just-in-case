import Link from "next/link";

type GuideLink = {
  slug: string;
  title: string;
};

const ALL_GUIDES: GuideLink[] = [
  { slug: "emergency-food-needs", title: "How much food does a household actually need" },
  { slug: "storage-without-bunker", title: "Storage without a bunker" },
  { slug: "gear-worth-having", title: "Gear worth having" },
  { slug: "when-powers-out", title: "Power out: what changes in the kitchen" },
  { slug: "car-kit", title: "Car kit" },
  { slug: "if-things-get-really-bad", title: "If things get really bad" },
  { slug: "when-its-over", title: "When it’s over: food safety after a disruption" },
  { slug: "what-we-leave-out", title: "What we deliberately leave out" },
];

export default function GuideFooter({ currentSlug }: { currentSlug: string }) {
  const others = ALL_GUIDES.filter((g) => g.slug !== currentSlug);

  return (
    <>
      <nav
        aria-label="More guides"
        className="no-print mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      >
        <p className="text-sm font-semibold text-[var(--brand-dark)]">More guides</p>
        <ul className="mt-3 space-y-2 text-sm leading-snug">
          {others.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="text-[var(--brand)] underline">
                {g.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/guides" className="font-medium text-[var(--brand)] underline">
              Back to the full library
            </Link>
          </li>
        </ul>
      </nav>

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
    </>
  );
}