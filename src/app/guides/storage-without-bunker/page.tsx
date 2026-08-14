import type { Metadata } from "next";
import Link from "next/link";
import GuideFooter from "@/components/guide-footer";
import { ArticleJsonLd } from "@/components/article-json-ld";

export const metadata: Metadata = {
  title: "Storage Without a Bunker: Making a Cupboard Do More — Just In Case",
  description:
    "Emergency food storage for UK households who do not have a spare room. How calorie density, volume, and swap logic make a standard kitchen cupboard go further.",
  alternates: {
    canonical: "https://justincase.scot/guides/storage-without-bunker",
  },
  openGraph: {
    title: "Storage Without a Bunker: Making a Cupboard Do More",
    description:
      "How calorie density, volume, and swap logic make a standard kitchen cupboard go further for emergency food storage.",
    url: "https://justincase.scot/guides/storage-without-bunker",
    type: "article",
  },
};

export default function Page() {
  return (
    <>
      <ArticleJsonLd
        headline="Storage Without a Bunker: Making a Cupboard Do More"
        description="Emergency food storage for UK households who do not have a spare room. How calorie density, volume, and swap logic make a standard kitchen cupboard go further."
        url="https://justincase.scot/guides/storage-without-bunker"
        datePublished="2026-07-24"
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
          Storage Without a Bunker: Making a Cupboard Do More
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            The biggest barrier to keeping emergency food in a UK home is not cost — it
            is space. Most households do not have a spare room, a garage shelf, or a
            dedicated pantry. What they have is a standard kitchen cupboard, maybe a
            under-stairs nook, and whatever room is left at the bottom of a wardrobe.
            The question is not &ldquo;how much food should I store?&rdquo; — it is
            &ldquo;how much food fits in the space I actually have?&rdquo;
          </p>

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            The real constraint is living space
          </h2>
          <p>
            A typical UK kitchen base unit is about 50 litres of usable volume — roughly
            the size of a standard pedal bin. Many households find it surprising that a
            month of emergency calories for two adults takes around 80–120 litres of
            storage, depending on the food choices. That means even a focused emergency
            supply spills across more than one cupboard.
          </p>
          <p>
            This is not a problem to solve by buying more storage containers. It is a
            constraint to work with: every litre of cupboard space has a maximum number
            of calories it can hold, and different foods deliver very different densities.
            A litre of pasta provides roughly 1,700 calories. A litre of tinned tomatoes
            provides about 400. Choosing between them is not about preference — it is
            about whether your cupboard can hold enough energy to matter.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Calorie density per volume: the metric that matters
          </h2>
          <p>
            The unit of measurement that makes storage planning useful is calories per
            litre. Dry staples score high: rice (1,800+ cal/L), pasta (1,700+), oats
            (1,900+), lentils (1,500+). Tinned items score lower because the water weight
            takes up volume without contributing calories: baked beans (~600 cal/L), tinned
            tomatoes (~400), tinned carrots (~250). Oils and nut butters are extreme at
            3,500+ cal/L, but they cannot make up the whole diet.
          </p>
          <p>
            This does not mean you should fill your cupboard entirely with dry pasta and
            skip vegetables. But it does mean you need to be deliberate about the mix.
            The <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner</Link> tracks storage volume in litres for every
            item in your basket, so you can see the trade-off in real time. Adding a tin
            of peaches costs 0.5 litres for about 150 calories. Adding a bag of rice costs
            0.3 litres per portion for about 350 calories. The planner makes the density
            visible rather than letting you guess.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            The swap logic
          </h2>
          <p>
            Once you know your cupboard volume, every food choice becomes a swap: what
            does this item cost in space, and what does it deliver in calories, nutrition,
            and morale? A practical swap might be replacing two litres of tinned soup
            (roughly 900 calories total) with one litre of dried lentils (1,500 calories
            plus protein) and one litre of stock cubes and dried herbs (negligible volume
            for flavour). The calorie yield goes up, the volume stays the same, and the
            meal quality does not suffer.
          </p>
          <p>
            The same logic applies to the opposite direction. If your household relies on
            ready-to-eat food (no-cook emergency scenarios), you swap density for
            convenience: tinned fish, pre-cooked rice pouches, and tinned fruit take up
            more space per calorie but need no heat and no water. Knowing that trade-off
            in advance prevents the moment of realising your emergency supply is
            calorie-light because you optimised for ease of preparation rather than
            density.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Making it practical
          </h2>
          <p>
            Start by measuring one cupboard. A rough guide: a standard 45 cm wide, 55 cm
            tall, 50 cm deep base unit gives roughly 100 litres when empty, but shelves,
            pipework, and existing items cut that to 60–70 usable litres. That is enough
            for roughly two weeks of emergency calories for two adults using a balanced
            mix of dry and tinned goods. Adding a second cupboard or a shelf elsewhere
            stretches that to three or four weeks.
          </p>
          <p>
            The key insight is that storage does not need a dedicated room. It needs an
            honest measurement of the space you have and a food selection built to fit it.
            The <Link href="/" className="text-[var(--brand)] underline">
              Just In Case pantry planner</Link> includes a storage estimate for every
            shopping plan, so you can match your food choices to your actual cupboard
            before you buy — no bunker required.
          </p>
        </div>

        <GuideFooter currentSlug="storage-without-bunker" />
      </div>
    </main>
    </>
  );
}