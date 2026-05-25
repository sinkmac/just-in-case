export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--brand-dark)]">About Just In Case</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Just In Case is a calm, practical emergency food calculator for UK households. It helps UK households work out what long-life food to buy, what their budget really covers, and what to print before they shop.
        </p>
      </div>
    </main>
  );
}
