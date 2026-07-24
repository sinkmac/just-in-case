import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gear Worth Having — Just In Case",
  description:
    "A short companion to the pantry — not a shopping list to work through, a reference for when you need it. Free options first, nothing recommended just because it's easy to sell.",
  alternates: {
    canonical: "https://justincase.scot/guides/gear-worth-having",
  },
  openGraph: {
    title: "Gear Worth Having",
    description:
      "A short companion to the pantry — free options first, nothing recommended just because it's easy to sell.",
    url: "https://justincase.scot/guides/gear-worth-having",
    type: "article",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link className="text-sm text-[var(--brand)] underline" href="/">
          ← Back to Just In Case
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
          Guide
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          Gear worth having
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--secondary)]">
          A short companion to the pantry — not a shopping list to work through, a reference for when you need it.
        </p>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Everything here follows the same rule as the rest of the site: free options come first, and nothing gets recommended just because it&rsquo;s easy to sell.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Light &amp; power
          </h2>
          <p>
            A decent torch and spare batteries — not just your phone. A power bank, or a way to charge from a car, matters more than people think once the mains are off for more than a day.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=torch&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Torch</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=spare+batteries+AA+AAA&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Spare batteries</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=power+bank&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Power bank</a></li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Warmth
          </h2>
          <p>
            A foil emergency blanket costs almost nothing and packs flat — genuinely useful if heating fails. Most households already own enough ordinary blankets; the honest advice is to check you have enough for everyone and know where they are, not to buy more.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=emergency+space+blanket&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Foil / space blanket</a></li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Water
          </h2>
          <p>
            A few large containers for storing tapped-off water are worth having before you need them. If you&rsquo;d ever be drawing from an unclear source — not just a dry tap — purification tablets or a filter make it safe to drink; tablets handle a broader range of risks, filters are faster but miss some viruses.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=water+storage+containers&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Water storage containers</a></li>
            <li><a href="https://www.amazon.co.uk/s?k=water+purification+tablets&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Water purification tablets or filter</a> (reused from the planner&rsquo;s water gear section)</li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Fire safety
          </h2>
          <p>
            A fire blanket is the sensible starting point — cheap, no training needed, and it covers the most common household fire (a pan going up). An ABC powder extinguisher is a reasonable step up if you want broader coverage.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=fire+blanket+kitchen&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Fire blanket</a> (reused from the planner&rsquo;s Space Audit section)</li>
            <li><a href="https://www.amazon.co.uk/s?k=ABC+powder+fire+extinguisher&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">ABC powder fire extinguisher</a> (reused from the planner&rsquo;s Space Audit section)</li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            First aid
          </h2>
          <p>
            A basic kit — plasters, antiseptic wipes, gauze, a thermometer — covers most of what you&rsquo;ll actually need. We won&rsquo;t tell you what medicine to take or how much; ask your pharmacist or GP, and keep a small buffer of any regular prescriptions topped up.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=basic+first+aid+kit&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Basic first-aid kit</a></li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Storage
          </h2>
          <p>
            If your food doesn&rsquo;t fit where you thought it would, a plain wire shelving unit or a set of under-bed boxes solves it cheaply — no need for anything fancier.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=wire+shelving+unit&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Wire shelving unit</a> (reused from the planner&rsquo;s Space Audit section)</li>
            <li><a href="https://www.amazon.co.uk/s?k=under+bed+storage+boxes&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Under-bed storage boxes</a> (reused from the planner&rsquo;s Space Audit section)</li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Freshness, cheaply
          </h2>
          <p>
            Two weeks or more into stored food, a spoonful of dried lentils or peas in a jar of water will sprout fresh greens in days — no soil, no garden, nothing to buy if you already have the lentils.
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><a href="https://www.amazon.co.uk/s?k=sprouting+jar+kit&tag=biteforecast2-21" target="_blank" rel="noreferrer" className="text-[var(--brand)] underline">Sprouting jar kit</a> (optional — free method described above, reused from the planner&rsquo;s micronutrient section)</li>
          </ul>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Related
          </h2>
          <p>
            If you drive, you might also want the <Link href="/guides/car-kit" className="text-[var(--brand)] underline">basic car kit</Link> — most of it overlaps with what&rsquo;s listed here.
          </p>
        </div>
      </div>
    </main>
  );
}
