import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate disclosure — Just In Case",
  description: "Just In Case includes Amazon Associates links. As an Amazon Associate, AI Scotland Productions may earn from qualifying purchases. Links appear inside",
  alternates: { canonical: "https://justincase.scot/affiliate-disclosure" },
  openGraph: { title: "Affiliate disclosure — Just In Case", description: "Just In Case includes Amazon Associates links. As an Amazon Associate, AI Scotland Productions may earn from qualifying purchases. Links appear inside", url: "https://justincase.scot/affiliate-disclosure", type: "website" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">← Back to Just In Case</Link>
        <h1 className="mt-6 text-3xl font-bold text-[var(--brand-dark)]">Affiliate disclosure</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Just In Case includes Amazon Associates links. As an Amazon Associate, AI Scotland Productions may earn from qualifying purchases. Links appear inside the shopping table after the planner output and do not change the calculation logic.</p>
      </div>
    </main>
  );
}
