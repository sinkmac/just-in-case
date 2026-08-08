import type { Metadata } from "next";
import Link from "next/link";
import changelog from "../../../data/changelog.json";

export const metadata: Metadata = {
  title: "What's Changed — Just In Case",
  description:
    "A quiet record of updates to Just In Case: new items, price changes, and re-verification passes. The site's 'last checked' signal.",
  alternates: {
    canonical: "https://justincase.scot/changelog",
  },
  openGraph: {
    title: "What's Changed",
    description:
      "New items, price changes, and re-verification passes — the quiet record behind Just In Case.",
    url: "https://justincase.scot/changelog",
    type: "website",
  },
};

const KIND_LABELS: Record<string, string> = {
  item: "New item",
  price: "Price change",
  recheck: "Re-verified",
  gear: "Gear",
  copy: "Copy",
  guide: "Guide",
};

function formatMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${y}`;
}

function formatEntryDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">
          ← Back to Just In Case
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
          Changelog
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          What&rsquo;s changed
        </h1>

        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          A quiet record of updates &mdash; new items, price changes, and
          re-verification passes. Prices and guidance were last checked in{" "}
          {formatMonth(changelog.lastChecked)}.
        </p>

        <div className="mt-8 space-y-6">
          {changelog.entries.map((entry) => (
            <div
              key={`${entry.date}-${entry.text.slice(0, 24)}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[var(--brand-dark)]">
                  {formatEntryDate(entry.date)}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]">
                  {KIND_LABELS[entry.kind] ?? entry.kind}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {entry.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-[var(--muted)]">
          This page is the honest record: if something changes, it appears here.
          Nothing is added to look busier than the site really is.
        </p>
      </div>
    </main>
  );
}
