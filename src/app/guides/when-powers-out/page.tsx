import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Actually Changes When the Power's Out — Just In Case",
  description:
    "A practical guide to eating during a UK power outage: no-cook versus needs-heat food, how water supply and power interact, and what to plan for before the lights go out.",
  alternates: {
    canonical: "https://justincase.scot/guides/when-powers-out",
  },
  openGraph: {
    title: "What Actually Changes When the Power's Out",
    description:
      "A practical guide to eating during a UK power outage: no-cook food, water scenarios, and what to plan for before the lights go out.",
    url: "https://justincase.scot/guides/when-powers-out",
    type: "article",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          className="text-sm text-[var(--brand)] underline"
          href="/"
        >
          ← Back to Just In Case
        </Link>

        <p className="mt-8 text-xs uppercase tracking-widest text-[var(--muted)] font-medium">
          Guide
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          What Actually Changes When the Power&rsquo;s Out
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Most emergency food advice assumes you have power, running water, and a
            functioning kitchen. But the scenarios that make an emergency food supply
            matter are exactly the ones where one or more of those things stops working.
            A power outage does not just mean the lights go off — it means your cooker,
            microwave, kettle, and refrigerator all stop too. What you can eat changes
            dramatically.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            No-cook versus needs-heat: the first divide
          </h2>
          <p>
            The most useful distinction in emergency food planning is not between healthy
            and indulgent — it is between food you can eat as it comes and food that needs
            cooking. Tinned fish, tinned fruit, crackers, cereal bars, peanut butter,
            pre-cooked rice pouches, and many tinned vegetables are ready to eat at room
            temperature. Dried pasta, dried lentils, raw oats, and most dried beans require
            boiling water and sustained heat to become edible.
          </p>
          <p>
            In a power outage without gas, your needs-heat items are locked away unless
            you have a camping stove, a gas barbecue, or a solid-fuel burner. This is not
            hypothetical planning — UK power outages can last anywhere from a few hours
            after a storm to several days following infrastructure damage. A household that
            stocked only dried beans and brown rice will run into trouble on day one.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Water and power: four combinations
          </h2>
          <p>
            When the power goes out, water may or may not still flow. UK mains water
            supply typically continues during an electrical outage because the pumps run on
            separate infrastructure or backup generators, but a burst main, flood, or
            large-scale incident can interrupt both. That creates four distinct scenarios:
          </p>

          <div className="verdict-panel mt-4 space-y-3">
            <p className="font-bold text-[var(--brand-dark)]">
              Power on, water on
            </p>
            <p className="text-sm leading-6">
              Normal kitchen operation. All food types available. This is the scenario
              most planning assumes, and it is the least likely during the kind of event
              that makes emergency food relevant.
            </p>
          </div>

          <div className="verdict-panel mt-4 space-y-3">
            <p className="font-bold text-[var(--brand-dark)]">
              Power off, water on
            </p>
            <p className="text-sm leading-6">
              You can still boil water if you have a gas hob or camping stove. Needs-heat
              foods remain accessible, and you can prepare dried staples. Your <em>best
              </em> scenario in a real outage, but it still requires a backup heat source.
            </p>
          </div>

          <div className="verdict-panel mt-4 space-y-3">
            <p className="font-bold text-[var(--brand-dark)]">
              Power off, water off
            </p>
            <p className="text-sm leading-6">
              Needs-heat foods are inaccessible without a camping stove. Dry staples
              (pasta, rice, lentils) require stored water to cook. This is the scenario
              where no-cook, ready-to-eat foods become essential — tinned fish, tinned
              fruit, crackers, nut butters, and pre-cooked pouches.
            </p>
          </div>

          <div className="verdict-panel mt-4 space-y-3">
            <p className="font-bold text-[var(--brand-dark)]">
              Power on, water off
            </p>
            <p className="text-sm leading-6">
              Rare but possible (local water main burst). You can cook, but you need
              stored drinking water for both hydration and food preparation. Bottled or
              stored water becomes the limiting factor, not the food itself.
            </p>
          </div>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Planning for the combination you cannot predict
          </h2>
          <p>
            The practical takeaway is that a sensible emergency food supply needs to work
            in the power-off, water-off scenario even if you expect something milder. That
            means at least some no-cook ready-to-eat items, some food that can be prepared
            with cold water (porridge oats left to soak, couscous, some noodles), and
            enough stored drinking water to cover cooking and hydration.
          </p>
          <p>
            The <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner</Link> includes a scenario toggle so you can
            compare a no-cook emergency loadout against a needs-heat plan. The difference
            in weight, volume, and cost is often significant — and seeing it before an
            outage is the point.
          </p>
        </div>
      </div>
    </main>
  );
}