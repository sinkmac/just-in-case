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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c-3.5 0-6 3.3-6 7.5 0 2.5 2 5 5 6.5 3-1.5 5-4 5-6.5 0-4.2-2.5-7.5-6-7.5Z" />
      </svg>
    ),
    food: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="4" width="8" height="14" rx="1" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    light: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="4" width="4" height="10" rx="0.5" />
        <path d="M12 14v6" />
        <path d="M10 14h4" />
      </svg>
    ),
    warmth: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="6" width="16" height="12" rx="1" />
        <path d="M4 10h16" />
        <path d="M4 14h16" />
      </svg>
    ),
    news: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="8" width="14" height="6" rx="1" />
        <circle cx="12" cy="16" r="1" fill="#8A4B2E" />
        <path d="M12 18v2" />
      </svg>
    ),
    other: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A4B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="4" width="4" height="16" />
        <rect x="4" y="10" width="16" height="4" />
      </svg>
    ),
  };
  return <span className="shrink-0 mt-0.5">{icons[id]}</span>;
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h2 className="mt-2 text-3xl font-semibold text-[var(--brand-dark)] font-serif tracking-tight">
            Just In Case
          </h2>
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
                    <p className="text-sm font-semibold text-[var(--brand-dark)] font-serif">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--muted)]">{item.body}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Main button */}
            <Link href="/planner?tier=weekend">
              <button
                className="w-full sm:w-auto min-h-[44px] bg-[var(--brand)] text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-[var(--brand-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              >
                Show me what I need &rarr;
              </button>
            </Link>

            {/* Supporting line */}
            <p className="text-sm text-[var(--muted)] leading-6">
              Start with what you have, and build up a little at a time. Storms, power cuts and cyberattacks can stop the services we all rely on, which is why the government advises every household to be ready for three days.{" "}
              <Link
                href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
                className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
              >
                Read the official advice
              </Link>
              .
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

        {/* Band */}
        <section className="mt-14 border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 rounded-lg">
          <p className="text-sm font-semibold text-[var(--brand-dark)] uppercase tracking-wider">
            Get the right amounts for your household
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">About five minutes.</p>
          <ol className="mt-4 space-y-2 text-sm text-[var(--secondary)] leading-6 list-decimal list-inside">
            <li>Tell us who&rsquo;s at home.</li>
            <li>Tick what you already have.</li>
            <li>Get your shopping list.</li>
          </ol>
        </section>

        {/* Why three days */}
        <section className="mt-12">
          <p className="font-serif text-lg sm:text-xl text-[var(--brand-dark)] font-semibold">
            Why three days?
          </p>
          <p className="mt-2 text-sm text-[var(--muted)] leading-6">
            A power cut, the water going off, a road snowed in. If most households can manage for three days on their own, help can reach the people who need it most.
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
          <p className="mt-2 text-xs text-[var(--muted)] leading-5">
            Advice based on the UK Government&rsquo;s Be Ready campaign, 22 October 2026. Nothing you enter is stored.
          </p>
          <p className="mt-4 text-xs text-[var(--muted)]">
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
