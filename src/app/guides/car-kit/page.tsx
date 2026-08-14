import type { Metadata } from "next";
import Link from "next/link";
import GuideFooter from "@/components/guide-footer";
import { ArticleJsonLd } from "@/components/article-json-ld";

export const metadata: Metadata = {
  title: "A Basic Car Kit — Just In Case",
  description:
    "A short, honest list for keeping ordinary things in the boot — most of which you already have if you've read the gear guide.",
  alternates: {
    canonical: "https://justincase.scot/guides/car-kit",
  },
  openGraph: {
    title: "A Basic Car Kit",
    description:
      "Most of this you already have if you've read the gear guide — this is just what to also keep in the boot.",
    url: "https://justincase.scot/guides/car-kit",
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        headline="A Basic Car Kit"
        description="A short, honest list for keeping ordinary things in the boot — most of which you already have if you've read the gear guide."
        url="https://justincase.scot/guides/car-kit"
        datePublished="2026-07-24"
      />
      <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">
          ← Back to Just In Case
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
          Guide
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          A basic car kit
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--secondary)]">
          Most of this you already have if you&rsquo;ve read the <Link href="/guides/gear-worth-having" className="text-[var(--brand)] underline">gear guide</Link> — this is just what to also keep in the boot.
        </p>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Being stuck in a car is a different problem from being stuck at home, and it deserves its own short list rather than being folded into the pantry planner.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            From what you already have
          </h2>
          <p>
            A torch, a basic first aid kit, and a foil blanket all double up perfectly — no need to buy a second set, just keep one in the car if you can spare it.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Worth adding, specifically for the car
          </h2>
          <p>
            A warning triangle and a hi-vis vest, for if you break down somewhere without a hard shoulder. Jump leads or a portable jump-starter. A basic tyre inflator or sealant kit. A phone charger that works from the car&rsquo;s own power.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=warning+triangle+car&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Warning triangle</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=hi-vis+vest&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Hi-vis vest</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=jump+leads+car&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Jump leads or portable jump-starter</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=tyre+inflator+sealant+kit&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Tyre inflator or sealant kit</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=car+phone+charger&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Car phone charger</a></li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            One last thing
          </h2>
          <p>
            None of this needs to be expensive or elaborate — the whole point is having the ordinary, boring things ready before an ordinary, boring problem happens on a cold night on the wrong stretch of road.
          </p>
        </div>

        <GuideFooter currentSlug="car-kit" />
      </div>
    </main>
    </>
  );
}
