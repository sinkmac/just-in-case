import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Just In Case",
  description:
    "About Just In Case: a calm, practical emergency food calculator for UK households planning long-life pantry supplies.",
  alternates: { canonical: "https://justincase.scot/about" },
  openGraph: {
    title: "About — Just In Case",
    description:
      "A calm, practical emergency food calculator for UK households planning long-life pantry supplies.",
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
        <h1 className="mt-6 text-3xl font-bold text-[var(--brand-dark)]">About Just In Case</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Just In Case is a calm, practical emergency food calculator for UK households. It helps UK households work out what long-life food to buy, what their budget really covers, and what to print before they shop.
        </p>

        <h2 className="mt-10 text-xl font-bold text-[var(--brand-dark)]">Other tools that might help</h2>
        <p className="mt-3 text-base leading-7 text-[var(--muted)]">
          If you want to compare prices across supermarkets before you shop,{" "}
          <a
            href="https://www.trolley.co.uk/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[var(--brand)]"
          >
            Trolley.co.uk
          </a>{" "}
          is a free, independent tool that does this well. It takes no commission and is not affiliated with this site.
        </p>
        <p className="mt-6 text-base leading-7 text-[var(--muted)]">
          <Link href="/why" className="underline hover:text-[var(--brand)]">
            Why we built it this way
          </Link>
        </p>
      </div>
    </main>
  );
}
