import type { Metadata } from "next";
import Link from "next/link";
import GuideFooter from "@/components/guide-footer";
import { ArticleJsonLd } from "@/components/article-json-ld";

export const metadata: Metadata = {
  title: "How Much Emergency Food Does Your Household Actually Need — Just In Case",
  description:
    "The honest starting point for UK household emergency food planning: calories per person, why child assumptions differ, and the budget constraint that shapes every decision.",
  alternates: {
    canonical: "https://justincase.scot/guides/emergency-food-needs",
  },
  openGraph: {
    title: "How Much Emergency Food Does Your Household Actually Need",
    description:
      "The honest starting point for UK household emergency food planning: calories, child assumptions, and why budget is the real constraint.",
    url: "https://justincase.scot/guides/emergency-food-needs",
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        headline="How Much Emergency Food Does Your Household Actually Need"
        description="The honest starting point for UK household emergency food planning: calories per person, why child assumptions differ, and the budget constraint that shapes every decision."
        url="https://justincase.scot/guides/emergency-food-needs"
        datePublished="2026-05-03"
      />
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
          How Much Emergency Food Does Your Household Actually Need
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Every UK household that starts thinking about emergency food asks the same
            question: how much is enough? The honest answer is usually &ldquo;a bit more than you
            think,&rdquo; but the useful answer depends on three things nobody likes to confront
            directly — the actual calorie demand of your household, the shelf space you
            have, and the budget you can spend all at once.
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            The calorie baseline
          </h2>
          <p>
            A moderately active adult needs roughly 2,000 calories per day to maintain
            weight and energy. That is the standard reference used by the UK government&rsquo;s
            emergency planning guidance and by most humanitarian food ration calculators.
            It is not a precise metabolic prescription — it is a practical baseline that
            accounts for the fact that during a supply disruption you are unlikely to be
            exercising heavily, but you still need enough energy to go about daily life,
            keep warm, and think clearly.
          </p>
          <p>
            Children, however, are not simply small adults. The <Link
              href="https://www.gov.uk/government/publications/humanitarian-guidance-planning-for-emergencies"
              className="text-[var(--brand)] underline"
            >
              UK Humanitarian Guidance
            </Link> notes that child calorie requirements vary significantly by age. A
            toddler needs around 1,000 calories per day; a teenager going through a growth
            spurt can exceed 2,500. For a household planning tool, using a flat child
            multiplier of 0.6 adult-equivalent (roughly 1,200 calories per day) is a
            deliberate middle-ground choice. It is cautious enough that a family of four
            with two young children will not be caught short, and honest enough that the
            teenager who eats everything in sight is not a surprise you discover on day
            three.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Why child calorie assumptions matter
          </h2>
          <p>
            A planner that treats every household member as a full adult overestimates
            food needs by 30–40 percent for families with young children. That sounds
            cautious, but it creates a real problem: the estimated total pushes people
            toward a budget number that feels impossible, so they give up before they
            start. Conversely, a planner that ignores the difference between a nine-year-old
            and a nursing infant underestimates needs and leaves a gap on the shelf.
          </p>
          <p>
            The 0.6 multiplier is not perfect — no single number can cover every child
            from age one to sixteen — but it sits in the sensible middle. In practice it
            means a two-adult, two-child household has a daily target of about 6,400
            calories rather than the 8,000 an adult-only model would suggest. Over a
            four-week supply that is the difference between roughly 180,000 and 224,000
            calories, and that gap changes what fits in a standard kitchen cupboard.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            The budget constraint is the real gate
          </h2>
          <p>
            Most conversations about emergency food start with weeks of supply and end
            with a budget number. But in practice the budget is what determines everything
            else. A household that can spend £200 on long-life food will make very different
            choices from one with £50, even if both aim for the same two-week window.
          </p>
          <p>
            The <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner
            </Link> works from budget first, then weeks, then calories — in that order.
            That is the honest direction: start with what you can actually spend, then let
            the weeks and calories fall where they may. A £50 budget stretched across four
            weeks for four people will not cover the same basket as £200 across the same
            period. The tool makes that visible rather than pretending all budgets are
            equal.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            A bit more than you think
          </h2>
          <p>
            The reason the honest answer is usually &ldquo;a bit more than you think&rdquo;
            comes down to calorie density. Most people imagine emergency food as tinned
            soup and baked beans, both of which are mostly water. A 400g tin of baked
            beans provides roughly 320 calories — about one-sixth of an adult&rsquo;s daily
            need. To cover one adult for one week you would need roughly 44 tins, which
            is a lot of cupboard space and a lot of weight to carry home.
          </p>
          <p>
            This is why the planner leans on calorie-dense staples — rice, pasta, oats,
            oil, peanut butter — alongside the tinned goods that provide vegetables,
            protein, and morale. A bag of rice stores more energy per litre than almost
            any tinned item. Getting the balance right between density and variety is the
            difference between a cupboard that looks full and a cupboard that actually
            feeds your household.
          </p>
          <p>
            Start with the <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner</Link> to see how the numbers land for your
            household. The planner shows the cost, calorie total, and storage volume for
            every item so you can adjust before you shop — rather than discovering the gap
            when you need the food.
          </p>
        </div>

        <GuideFooter currentSlug="emergency-food-needs" />
      </div>
    </main>
    </>
  );
}