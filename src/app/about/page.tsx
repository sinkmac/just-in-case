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
      </div>
    </main>
  );
}
