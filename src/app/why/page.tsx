import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why This Exists — Just In Case",
  description:
    "Why Just In Case exists: calm, honest, for everyone, specific, yours. A quiet statement of what we actually believe and what we built because of it.",
  alternates: {
    canonical: "https://justincase.scot/why",
  },
  openGraph: {
    title: "Why This Exists",
    description:
      "Calm, honest, for everyone, specific, yours — a quiet statement of what we actually believe.",
    url: "https://justincase.scot/why",
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
          Manifesto
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--brand-dark)] font-serif">
          Why this exists
        </h1>

        <div className="mt-8 space-y-6 text-base leading-7 text-[var(--secondary)]">
          <p>
            Most preparedness advice assumes the worst about you — that you&rsquo;re either an expert or you&rsquo;re helpless, that you need a bunker or you need nothing. We don&rsquo;t think that&rsquo;s true.
          </p>
          <p>
            We think you&rsquo;re a sensible adult who&rsquo;d rather have this sorted quietly, on an ordinary Tuesday, than think about it at all during a bad week.
          </p>
          <p>
            So here&rsquo;s what we actually believe, and what we&rsquo;ve built because of it:
          </p>

          <p>
            <strong>Calm, not frightened.</strong> We won&rsquo;t use the word &ldquo;survival&rdquo; if &ldquo;cope&rdquo; will do. A power cut is a power cut, not the end of the world — and treating it that way helps nobody plan for it.
          </p>

          <p>
            <strong>Honest, not padded.</strong> If own-brand tinned beans from your nearest supermarket are genuinely the cheapest way to eat well, we&rsquo;ll say so — even though we make nothing when you buy them. We&rsquo;d rather be right than paid.
          </p>

          <p>
            <strong>For everyone, not just the well-off.</strong> Being ready shouldn&rsquo;t depend on having money spare. That&rsquo;s why there&rsquo;s a mode that shows you the actual floor — the least you could spend and still genuinely cope, no padding, no upsell. And why you don&rsquo;t have to find it all in one big shop: spread it over a few weeks instead, a little at a time, and print the list.
          </p>

          <p>
            <strong>Specific, not vague.</strong> &ldquo;Store some food&rdquo; isn&rsquo;t advice. We try to say exactly what, how much, and what it costs — because vague reassurance doesn&rsquo;t actually help anyone.
          </p>

          <p>
            <strong>Yours, not ours.</strong> Nothing you tell this site is stored, sold, or seen by us — not your answers, not your plan, not even which mode you used. We don&rsquo;t need your data to help you.
          </p>

          <p>
            We&rsquo;re not trying to sell you fear. We&rsquo;re trying to make sure that if a bad week comes, you&rsquo;ve already quietly handled it.
          </p>
        </div>
      </div>
    </main>
  );
}
