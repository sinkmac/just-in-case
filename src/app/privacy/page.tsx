import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Just In Case",
  description: "Just In Case does not require an account. The calculator runs in your browser and uses the household size, budget, weeks and dietary filters you choos",
  alternates: { canonical: "https://justincase.scot/privacy" },
  openGraph: { title: "Privacy — Just In Case", description: "Just In Case does not require an account. The calculator runs in your browser and uses the household size, budget, weeks and dietary filters you choos", url: "https://justincase.scot/privacy", type: "website" },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">← Back to Just In Case</Link>
        <h1 className="mt-6 text-3xl font-bold text-[var(--brand-dark)]">Privacy</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Just In Case does not require an account. The calculator runs in your browser and uses the household size, budget, weeks and dietary filters you choose to generate a pantry plan. The site is hosted on Netlify, which may process standard technical logs.</p>
      </div>
    </main>
  );
}
