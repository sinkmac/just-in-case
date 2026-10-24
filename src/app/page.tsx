import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CupboardIllustration } from "@/components/cupboard-illustration";

export const metadata: Metadata = {
  title: "Be ready for three days — Just In Case",
  description:
    "See what your household needs for three days without shops, power or water, then get a shopping list of what's missing.",
  alternates: { canonical: "https://justincase.scot/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const ESSENTIALS = [
  { id: "water", title: "Water", body: "3 litres each a day to drink" },
  { id: "food", title: "Food", body: "That needs no cooking" },
  { id: "light", title: "Light", body: "A torch and spare batteries" },
  { id: "warmth", title: "Warmth", body: "Blankets and warm layers" },
  { id: "news", title: "News", body: "A battery or wind-up radio" },
  { id: "other", title: "Other essentials", body: "Cash, first aid, medicines" },
] as const;

function EssentialsIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    water: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z" />
      </svg>
    ),
    food: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <ellipse cx="12" cy="6" rx="7" ry="2.5" />
        <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
        <path d="M5 10.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
      </svg>
    ),
    light: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M9 21h6" />
        <path d="M10 17h4" />
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
      </svg>
    ),
    warmth: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M4 7h16v11H4z" />
        <path d="M4 11h16" />
        <path d="M8 7V5h8v2" />
      </svg>
    ),
    news: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <rect x="3" y="9" width="18" height="11" rx="2" />
        <circle cx="9" cy="14.5" r="2.5" />
        <path d="M15 13h3" />
        <path d="M15 16h3" />
        <path d="M7 9l10-5" />
      </svg>
    ),
    other: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    ),
  };
  return <span className="shrink-0 mt-0.5">{icons[id]}</span>;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <p className="mt-2 text-3xl font-semibold text-[var(--brand-dark)] font-serif tracking-tight">
            Just In Case
          </p>
          <nav className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--brand)]">
            <Link
              href="/planner"
              className="underline decoration-1 underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              Planner
            </Link>
            <Link
              href="/guides"
              className="underline decoration-1 underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/why"
              className="underline decoration-1 underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              Why we built this
            </Link>
          </nav>
        </header>

        {/* Headline */}
        <h1 className="mb-8 text-[34px] sm:text-[46px] lg:text-[52px] font-semibold text-[var(--brand-dark)] font-serif leading-tight">
          Be ready for three days.
        </h1>

        {/* Hero: essentials grid, button, supporting line, illustration */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {/* Essentials grid */}
            <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {ESSENTIALS.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <EssentialsIcon id={item.id} />
                  <div>
                    <p className="text-[17px] font-semibold text-[var(--brand-dark)] font-serif">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[17px] text-[var(--brand-dark)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            {/* Main button */}
            {/* mb-3 leaves a little space before the supporting line (less than
                the column's usual gap, so the line still reads with the button). */}
            <Link
              href="/planner?tier=weekend"
              className="mb-3 flex sm:inline-flex w-full sm:w-auto h-[60px] items-center justify-center bg-[var(--brand)] text-white px-8 rounded-full font-medium text-[21px] hover:bg-[var(--brand-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
            >
              Show me what I need &rarr;
            </Link>

            {/* Supporting line */}
            <p className="text-[19px] text-[var(--brand-dark)] leading-7">
              Start with what you have, and build up a little at a time.{" "}
              <Link
                href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
                className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
              >
                Read the official advice
              </Link>
            </p>
          </div>

          {/* Cupboard illustration: desktop beside text */}
          <div className="hidden lg:block flex justify-center">
            <CupboardIllustration />
          </div>
        </div>

        {/* Cupboard illustration: phone below supporting line */}
        <div className="lg:hidden mt-8 flex justify-center">
          <CupboardIllustration className="max-w-xs" />
        </div>

        {/* Band: Get the right amounts */}
        <section className="mt-14">
          <h2 className="mb-4 text-[19px] font-semibold text-[var(--brand-dark)] font-serif">
            Get the right amounts for your household
          </h2>
          <p className="mb-6 text-[19px] text-[var(--brand-dark)]">About five minutes.</p>
          <ol className="space-y-2 text-[19px] text-[var(--brand-dark)] leading-7 list-decimal list-inside font-serif">
            <li>Tell us who&rsquo;s at home.</li>
            <li>Tick what you already have.</li>
            <li>Get your shopping list.</li>
          </ol>
        </section>

        {/* Why Just In Case? */}
        <section className="mt-12">
          <p className="font-serif text-lg sm:text-xl text-[var(--brand-dark)] font-semibold">
            Why Just In Case?
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            The government advises keeping three days of supplies. It's reasonable to ask: why now? Is something about to happen?
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
          The <Link
            href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
            className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
          >
            published advice
          </Link>
          is about being prepared for disruption. It doesn't announce a specific impending emergency. Storms, power cuts and cyberattacks can interrupt water, shopping, payments and communications. You don’t need to know what causes a disruption to be ready for it. Having a few essentials at home gives you some breathing room, and helps emergency services concentrate on people who need them most.
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            We built Just In Case to make that advice useful. What does your household need? How much have you already got? And what's still missing?
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            Start with three days and add things as you can. A longer store is your choice.
          </p>
          <p className="mt-2 text-[21px] text-[var(--brand-dark)] leading-7 font-serif">
            A little preparation now can make a difficult few days easier. Just in case.
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            Link:{" "}
            <Link
              href="/about"
              className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              About us and our approach
            </Link>
          </p>
        </section>

        {/* Side link */}
        <p className="mt-12 text-sm text-[var(--muted)]">
          Already covered?{" "}
          <Link
            href="/planner"
            className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
          >
            Plan a longer store
          </Link>
        </p>

        {/* Footer */}
        <footer className="mt-16 border-t border-[var(--border)] pt-8">
          <p className="text-sm font-semibold text-[var(--brand-dark)]">
            Planning for the future you hope never comes. But just might.
          </p>
          <p className="mt-2 text-xs text-[var(--brand-dark)] leading-5">
            Advice based on the UK Government&rsquo;s Be Ready campaign, 22 October 2026. Nothing you enter is stored.
          </p>
          <p className="mt-4 text-xs text-[var(--brand-dark)]">
            Some wording on this site was drafted with AI and reviewed by us.
          </p>
          <p className="mt-4 text-xs text-[var(--brand-dark)]">
            <a
              href="/changelog"
              className="underline underline-offset-2 hover:text-[var(--brand)] transition-colors"
            >
              What&rsquo;s changed
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
