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
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">You don't need an account to use Just In Case, and we don't keep anything you enter. The planner and the readiness check work inside your browser. When you refresh or close the page, your answers are gone.</p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">We don't use analytics or tracking cookies, and there are no adverts on the site at the moment. If that ever changes, we'll update this page first.</p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Some gear links go to Amazon. They're marked. If you buy through one, we may earn a small commission at no extra cost to you. Once you're on Amazon's site, their privacy policy applies. See our <Link href="/affiliate-disclosure" className="underline">affiliate disclosure</Link>.</p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">The site is hosted by Netlify, which keeps standard technical logs (such as IP addresses) to run and protect the service.</p>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">Last updated: November 2026</p>
      </div>
    </main>
  );
}
