import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What We Deliberately Leave Out — Just In Case",
  description:
    "Just In Case is not medical advice, not disaster response planning, and not extreme prepping. A clear statement of what this site does and does not cover.",
  alternates: {
    canonical: "https://justincase.scot/guides/what-we-leave-out",
  },
  openGraph: {
    title: "What We Deliberately Leave Out",
    description:
      "Just In Case is not medical advice, not disaster response planning, and not extreme prepping. A clear statement of scope.",
    url: "https://justincase.scot/guides/what-we-leave-out",
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
          What We Deliberately Leave Out
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            A useful tool needs clear boundaries. This page is a straightforward statement
            of what Just In Case does not cover, and why. Knowing the limits of the advice
            you are reading is as important as knowing what it contains — especially when
            that advice involves food, health, and household resilience.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Not medical advice
          </h2>
          <p>
            Just In Case is a food quantity and budget planning tool. It does not offer
            medical or dietary advice. The calorie figures used in the planner are
            population-level estimates from standard emergency planning guidelines — they
            are not tailored to individual medical conditions, activity levels,
            allergies, or therapeutic dietary requirements.
          </p>
          <p>
            If someone in your household has a medical condition that affects dietary
            needs — diabetes, coeliac disease, kidney disease, an eating disorder, or any
            other condition requiring a controlled diet — the planner&rsquo;s output is
            not a safe substitute for professional guidance. The same applies to infant
            feeding: the child calorie multiplier is a general planning figure, not a
            recommendation for how to feed a baby or toddler. Consult a GP, dietitian, or
            health visitor for medical nutritional advice.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Not disaster or evacuation response
          </h2>
          <p>
            Just In Case plans for a scenario where your household stays at home with
            limited access to shops — a supply chain disruption, a prolonged power outage,
            a period of being housebound. It does not plan for evacuation, flood, fire,
            structural damage to your home, or any situation where staying put is unsafe.
          </p>
          <p>
            Evacuation planning involves very different priorities: lightweight,
            portable supplies, quick-access grab bags, documents, medications, pet
            provisions, and a route plan. The calorie-dense, bulk-pantry approach this
            tool optimises for is the opposite of what you want in a bug-out bag.
            If you are in an area at risk of flooding, wildfire, or industrial incident,
            follow the guidance of the <Link
              href="https://www.gov.uk/government/publications/humanitarian-guidance-planning-for-emergencies"
              className="text-[var(--brand)] underline"
            >
              UK government emergency planning framework
            </Link> for evacuation rather than pantry planning.
          </p>
          <p>
            For your own area&rsquo;s flood risk, the{" "}
            <a
              href="https://www.gov.uk/check-flood-risk"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              UK government&rsquo;s check-your-flood-risk service
            </a>{" "}
            and{" "}
            <a
              href="https://www.sepa.org.uk/environment/water/flooding/"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              SEPA
            </a>{" "}
            (Scotland),{" "}
            <a
              href="https://naturalresources.wales/flooding"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              Natural Resources Wales
            </a>
            , or the{" "}
            <a
              href="https://www.gov.uk/check-flood-risk"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              Environment Agency
            </a>{" "}
            (England) publish free, official risk maps — worth checking directly rather than relying on a general guide.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Not extreme prepping
          </h2>
          <p>
            This site exists in a different space from the prepper community. There is no
            assumption of societal collapse, no multi-year stockpile target, no
            off-grid-self-sufficiency model. The planning horizon is weeks to a few
            months, not years. The budget figures are what a typical UK household can
            spend in a single supermarket trip, not a quarterly provisioning budget.
          </p>
          <p>
            &ldquo;Just in case&rdquo; means &ldquo;what if the shops are hard to reach
            for a while&rdquo; — not &ldquo;what if there are no shops at all.&rdquo; It
            is the difference between a spare tyre and building your own vehicle. Both are
            forms of preparation, but they operate at different scales and serve different
            households. This tool is for people who want the spare tyre, not the workshop.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            What the site is for
          </h2>
          <p>
            Just In Case helps you answer one question: given your household size, your
            budget, and the weeks you want to cover, what long-life food can you buy and
            store in the space you have? It is a calculator and a reality check, not a
            preparedness programme. The numbers are grounded in standard emergency
            planning data. The trade-offs are surfaced honestly so you can make your own
            decisions before you need them.
          </p>
          <p>
            Start with the <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner</Link>. It will show you what fits your budget,
            your cupboard, and your household — and nothing it leaves out will surprise
            you.
          </p>

          <div className="section-divider my-8" />
          <p>
            If things go on longer or get worse than a cupboard can cover,{" "}
            <Link
              href="/guides/if-things-get-really-bad"
              className="text-[var(--brand)] underline"
            >
              there&rsquo;s a separate page about where to turn
            </Link>{" "}
            when that happens.
          </p>
        </div>
      </div>
    </main>
  );
}