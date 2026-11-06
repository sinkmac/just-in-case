import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Just In Case",
  description: "For corrections, source updates, affiliate questions or partnership enquiries about Just In Case, contact AI Scotland Productions through the current ",
  alternates: { canonical: "https://justincase.scot/contact" },
  openGraph: { title: "Contact — Just In Case", description: "For corrections, source updates, affiliate questions or partnership enquiries about Just In Case, contact AI Scotland Productions through the current ", url: "https://justincase.scot/contact", type: "website" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">← Back to Just In Case</Link>
        <h1 className="mt-6 text-3xl font-bold text-[var(--brand-dark)]">Contact</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Spotted a mistake, a price that's changed, or advice that's out of date? Please tell us. Corrections are the most useful thing you can send.</p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Email: <a href="mailto:hello@justincase.scot" className="underline">hello@justincase.scot</a></p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Just In Case is an independent site, made in Scotland. We read everything, but we can't give personal emergency advice. In an emergency, call 999.</p>
      </div>
    </main>
  );
}
