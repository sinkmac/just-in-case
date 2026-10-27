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

        {/* Hero: starting point, button, official advice, illustration */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            {/* Starting point: what three days involves */}
            <section className="space-y-4">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-[var(--brand-dark)] font-serif leading-snug">
                Three days starts with things you already use.
              </h2>
              <p className="text-[19px] text-[var(--brand-dark)] leading-8">
                Familiar food you can eat without cooking, drinking water, a torch and a way to keep
                your phone charged. Add your household&rsquo;s essentials, such as medicines, baby
                supplies or pet food.
              </p>
              <p className="text-[19px] text-[var(--brand-dark)] leading-8">
                You may already have much of it. Check your cupboards first, then build up a little at
                a time.
              </p>
            </section>

            {/* Main button */}
            {/* mb-3 leaves a little space before the supporting line (less than
                the column's usual gap, so the line still reads with the button). */}
            <div className="mb-3 flex flex-col gap-3">
              <Link
                href="/planner?tier=weekend"
                className="flex sm:inline-flex w-full sm:w-auto self-start min-h-[60px] py-3 items-center justify-center text-center leading-snug bg-[var(--brand)] text-white px-8 rounded-full font-medium text-[20px] sm:text-[21px] sm:whitespace-nowrap hover:bg-[var(--brand-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              >
                See what your household needs &rarr;
              </Link>
              <span className="text-[17px] text-[var(--brand-dark)]">
                Takes about five minutes.
              </span>
            </div>

            {/* Supporting line */}
            <p className="text-[19px] text-[var(--brand-dark)] leading-7">
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
          <ol className="space-y-2 text-[19px] text-[var(--brand-dark)] leading-7 list-decimal list-inside font-serif">
            <li>Tell us who&rsquo;s at home.</li>
            <li>Tick what you already have.</li>
            <li>Get your shopping list.</li>
          </ol>
        </section>

        {/* And if it lasts longer? */}
        <section className="mt-12 border-t border-dashed border-[var(--border)] pt-8">
          <h2 className="text-[22px] sm:text-[24px] font-semibold text-[var(--brand-dark)] font-serif">
            And if it lasts longer?
          </h2>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            Once you&rsquo;ve covered three days,{" "}
            <Link
              href="/planner?tier=fortnight"
              className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              explore what a longer plan would involve
            </Link>
            .
          </p>
        </section>

        {/* Why Just In Case? */}
        <section className="mt-12">
          <p className="font-serif text-lg sm:text-xl text-[var(--brand-dark)] font-semibold">
            Why Just In Case?
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            The UK government advises households to prepare for three days of disruption. This is general{" "}
            <Link
              href="https://beready.campaign.gov.uk/be-ready-for-emergencies/"
              className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              preparedness advice
            </Link>
            , rather than an announcement of a specific impending emergency.
          </p>
          <p className="mt-2 text-[19px] text-[var(--brand-dark)] leading-7">
            Storms, power cuts and cyberattacks can interrupt water, shopping, payments and communications. You don’t need to know what causes a disruption to be ready for it. Having a few essentials at home gives you some breathing room, and helps emergency services concentrate on people who need them most.
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
            <Link
              href="/about"
              className="text-[var(--brand)] underline underline-offset-2 hover:text-[var(--brand-dark)] transition-colors"
            >
              About us and our approach &rarr;
            </Link>
          </p>
        </section>

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
