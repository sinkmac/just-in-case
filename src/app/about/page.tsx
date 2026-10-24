import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Just In Case",
  description:
    "About Just In Case: who runs it, where our advice comes from, how the site is paid for, and your privacy.",
  alternates: { canonical: "https://justincase.scot/about" },
  openGraph: {
    title: "About — Just In Case",
    description:
      "Just In Case helps UK households get ready for a few days of disruption. Who runs it, where our advice comes from, how the site is paid for, and your privacy.",
    url: "https://justincase.scot/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">
          ← Back to Just In Case
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-[var(--brand-dark)]">
          About Just In Case
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Just In Case helps UK households get ready for a few days of
          disruption, starting with the government's three-day advice. It shows
          what your household needs, what you already have, and what's still
          missing.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">
          Who runs it.
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Just In Case is an independent site, made in Scotland.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">
          Where our advice comes from.
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          The UK Government's Be Ready campaign, the Food Standards Agency, and
          real supermarket prices, which we re-check regularly.{" "}
          <Link
            href="/changelog"
            className="underline hover:text-[var(--brand)]"
          >
            See what's changed
          </Link>
          .
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">
          How the site is paid for.
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Some links go to Amazon. As an Amazon Associate I earn from
          qualifying purchases. It costs you nothing extra, and it never
          decides what we recommend. We name the cheapest shop even when it
          pays us nothing.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">
          Your privacy.
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Nothing you enter is stored or sent anywhere.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">
          Other tools that might help
        </h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          Trolley.co.uk compares supermarket prices. It's free, independent,
          and not connected to us.{" "}
          <a
            href="https://www.trolley.co.uk/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[var(--brand)]"
          >
            Trolley.co.uk
          </a>
          .
        </p>
      </div>
    </main>
  );
}
