import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "When It's Over — Just In Case",
  description:
    "What to do the morning after a disruption ends: check the freezer, restock in order, rotate the cupboard, and write down what you learned before you forget.",
  alternates: {
    canonical: "https://justincase.scot/guides/when-its-over",
  },
  openGraph: {
    title: "When It's Over — Just In Case",
    description:
      "What to do the morning after a disruption ends: check the freezer, restock in order, rotate the cupboard, and write down what you learned.",
    url: "https://justincase.scot/guides/when-its-over",
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
          When it&rsquo;s over
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Every disruption ends. The power comes back. The taps run clear. The shops
            restock and the road reopens and the week after that, it is mostly a story
            you tell.
          </p>
          <p>
            Almost nothing written about emergencies covers that morning. The official
            guidance takes you up to the event and stops. So does most of what you will
            find online, and so, until now, did this site.
          </p>
          <p>
            That is a strange gap, because the morning after is when people throw away
            food that was perfectly good, drink water they should have run off first, and
            spend money they have not got replacing things they already own.
          </p>
          <p>Here is what to do.</p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            First, check what you still have
          </h2>
          <p>
            Do this before you write a shopping list. Most of what you think you lost,
            you probably did not.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            If the power was off.
          </p>
          <p>
            Keep the doors shut, and open the freezer last rather than first.
          </p>
          <p>
            If the cut lasted under four hours, the Food Standards Agency&rsquo;s
            position is that your chilled and frozen food is unlikely to have been
            affected at all. For most power cuts that is the whole answer &mdash; go
            straight down to the restocking and leave the rest of this section be.
          </p>
          <p>
            Longer than that, and the working figures are: a fridge stays cold for about
            four hours, a full freezer keeps food frozen for up to forty-eight, and a
            half-empty one for around twenty-four. Treat those as estimates rather than
            promises. They move with the make of the appliance, how full it was, how warm
            the room is, and how many times somebody opened the door to have a look.
          </p>
          <p>
            When you do open it, anything still frozen solid is fine and goes straight
            back in. Anything that has thawed should be treated as fridge food from that
            moment on &mdash; cook it and eat it rather than putting it back in the
            freezer.
          </p>
          <p>
            The fridge is the more delicate case. During a power cut the FSA will accept
            fridge food kept under 8&deg;C, but once it has been sitting at 8&deg;C or
            above, eat the things that normally live in the fridge within four hours, and
            eat them first. The cupboard can wait. Tins, dried goods and anything that
            normally sits at room temperature are unaffected by any of this and will still
            be there tomorrow.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            And one thing almost nobody thinks of.
          </p>
          <p>
            If it is properly cold outside &mdash; below 8&deg;C &mdash; you can move
            fridge food out there. In a sealed box, out of direct sunlight, somewhere no
            animal can get at it. For a good part of the Scottish year that is a free
            fridge sitting just past your back door.
          </p>

          <p>
            Do not taste anything to check. Taste tells you nothing useful about the
            bacteria that matter, and it puts the thing you are unsure about directly in
            your mouth.
          </p>
          <p>
            If you are unsure about a particular food, the{" "}
            <a
              href="https://food.gov.uk/safety-hygiene/food-safety-in-a-power-cut-advice-for-consumers"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--brand)] underline"
            >
              Food Standards Agency
            </a>{" "}
            is the authority. Check with them rather than take our word for it.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            If the water was off.
          </p>
          <p>
            Run the cold tap for a few minutes before you drink or cook with anything.
            Water coming back into an empty pipe pushes sediment ahead of it, so
            discoloured or cloudy water at first is common and usually harmless &mdash;
            but wait until it runs clear. Run it through before you fill the kettle,
            before you fill a pan, and before you fill the pet bowl.
          </p>
          <p>
            If your supplier has issued a boil-water notice, keep boiling until they tell
            you to stop. Not until the water looks right &mdash; until they say so. That
            is their call and they will make it publicly.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            If neither was off,
          </p>
          <p>
            and this was a supply problem rather than a utility one &mdash; empty
            shelves, a road shut, a week you could not get to a shop &mdash; then your
            food is fine and your water is fine, and that is genuinely the end of this
            section for you. Put anything you decanted back into something sealed, check
            the dates on whatever you opened, and go on to the next part. Restocking is
            the whole of your job.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Then restock, in this order
          </h2>
          <p>
            Not everything at once. In order, so that if you have to stop partway you
            have stopped in the right place.
          </p>
          <ol className="list-decimal space-y-3 pl-6">
            <li>
              <strong>Water.</strong> Whatever you drank, drank down or poured away. It
              is the cheapest thing on the list and the first thing you would miss.
            </li>
            <li>
              <strong>The staples you actually ate.</strong> Not the ones you meant to
              eat. Rice, pasta, oats, tins, whatever came out of the cupboard first.
              Those are the things that earn their place, and they are the cheapest
              calories you can buy.
            </li>
            <li>
              <strong>The one thing that ran out.</strong> There is nearly always one,
              and it is nearly always small. Tea, salt, milk of some kind, the cooking
              oil. Write it down now, while you are still annoyed about it, because in a
              fortnight you will have forgotten.
            </li>
            <li>
              <strong>Everything else, whenever.</strong> Over the next few normal shops.
              There is no rush and there is no prize for finishing this week.
            </li>
          </ol>
          <p>
            If money is tighter after this than it was before &mdash; and for a lot of
            households it will be, because disruptions cost &mdash; then work down that
            list and stop where you need to stop. A partly restocked cupboard is not a
            failed one. It is a cupboard with the important part done.
          </p>
          <p>
            Our{" "}
            <Link href="/" className="text-[var(--brand)] underline">
              planner
            </Link>{" "}
            will do the sums again if it helps. If you are rebuilding on less than you
            had, the cheapest-possible plan will tell you the floor for your household
            rather than asking you for a budget you may not have.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Now write down what you learned
          </h2>
          <p>
            This is the part that only you can do, and the part that makes the next one
            easier. It takes five minutes and it is worth more than anything else on this
            page.
          </p>
          <p>Three questions:</p>

          <p className="font-bold text-[var(--foreground)]">
            What ran out first?
          </p>
          <p>
            That is the thing you keep more of next time. Not more of everything &mdash;
            more of that.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            What did you never touch?
          </p>
          <p>
            If it sat there all week, it is not a food you eat under pressure, whatever
            it says on the tin. Swap it for something you will.
          </p>

          <p className="font-bold text-[var(--foreground)]">
            What did you wish you had?
          </p>
          <p>
            Not a fantasy list. The specific, ordinary, slightly embarrassing thing you
            kept reaching for and not finding. This is usually where the equipment turns
            up rather than the food &mdash; the torch with dead batteries in it, the tin
            opener you were sure you had two of.
          </p>

          <p>
            Write the answers on the back of your{" "}
            <Link href="/" className="text-[var(--brand)] underline">
              build-up schedule
            </Link>
            , or on anything you will find again, and pin it inside the cupboard door. We
            do not store this for you and never will &mdash; it is yours, it lives in
            your house, and it is more use there than it would ever be on our server.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Rotate. Do not rebuild.
          </h2>
          <p>
            The mistake after a disruption is to buy a big pile of long-life food, put it
            at the back of the cupboard, feel prepared, and then find it four years later,
            out of date, having eaten none of it.
          </p>
          <p>
            The cupboard that works is the one you are always eating. Use the oldest tins
            and packets first, replace them on your normal shop, and let the whole thing
            turn over slowly. That way nothing expires, nothing is wasted, and you never
            have to do a big frightening restock again &mdash; including after the next
            disruption, whenever that is.
          </p>
          <p>
            Start this week. If you already have a{" "}
            <Link href="/" className="text-[var(--brand)] underline">
              build-up schedule
            </Link>
            , rotate from that. If you do not &mdash; and if this was your first
            disruption, you almost certainly do not &mdash; then pull the three oldest
            tins or packets out of the back of the cupboard and eat them before Sunday.
            That is the habit. There is nothing more to it than that.
          </p>
          <p>
            If you want it laid out week by week from there, the{" "}
            <Link href="/" className="text-[var(--brand)] underline">
              build-up schedule
            </Link>{" "}
            does exactly this, and you can print it.
          </p>

          <div className="section-divider my-8" />

          <h2 className="mt-8 text-xl font-bold text-[var(--foreground)] font-serif">
            Do this today
          </h2>
          <ul className="list-disc space-y-3 pl-6">
            <li>
              Check the freezer before you throw anything away &mdash; if it is still
              frozen solid, it is fine.
            </li>
            <li>
              Run the cold tap until it runs clear.
            </li>
            <li>
              Write down the one thing that ran out first.
            </li>
            <li>
              Buy that one thing.
            </li>
          </ul>
          <p>
            That is the whole job. The rest can wait for a normal week.
          </p>
        </div>
      </div>
    </main>
  );
}