"use client";

import { useMemo, useState } from "react";
import foods from "../../data/foods.json";
import { buildPlan, type FoodItem } from "@/lib/planner";

type DietaryFlags = {
  vegetarian: boolean;
  glutenFree: boolean;
  noDairy: boolean;
};

const categoryLabels: Record<string, string> = {
  staple_carb: "Staple carbs",
  protein: "Protein",
  fat: "Fats",
  vegetable: "Vegetables",
  morale: "Morale",
  micronutrient: "Micronutrients",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}

function buildAmazonHref(item: FoodItem) {
  if (item.amazon_asin && item.amazon_asin !== "XXXXXXXXXX") {
    return `https://www.amazon.co.uk/dp/${item.amazon_asin}?tag=biteforecast2-21`;
  }

  return `https://www.amazon.co.uk/s?k=${encodeURIComponent(item.name)}&tag=biteforecast2-21`;
}

export function PantryPlanner() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [budgetGbp, setBudgetGbp] = useState(120);
  const [weeks, setWeeks] = useState(4);
  const [showDietary, setShowDietary] = useState(false);
  const [dietaryFlags, setDietaryFlags] = useState<DietaryFlags>({
    vegetarian: false,
    glutenFree: false,
    noDairy: false,
  });

  const result = useMemo(
    () =>
      buildPlan(
        {
          adults,
          children,
          budgetGbp,
          weeks,
          dietaryFlags,
        },
        foods as FoodItem[],
      ),
    [adults, children, budgetGbp, weeks, dietaryFlags],
  );

  const grouped = useMemo(() => {
    return result.ranked.reduce<Record<string, typeof result.ranked>>((acc, line) => {
      acc[line.category] ??= [];
      acc[line.category].push(line);
      return acc;
    }, {});
  }, [result]);

  const approxDaysCovered = Math.floor(result.totalCaloriesPlanned / Math.max(1, result.dailyCaloriesNeeded));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 print-shell">
        <header className="no-print mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <h1 className="mt-2 text-3xl font-bold text-[var(--brand-dark)]">Just In Case</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Smart preparation. Just in case.</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Work out what long-life food to buy for your household, how far your budget really goes, and what to print before you shop.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <section className="no-print rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold">Adults</label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={adults}
                  onChange={(event) => setAdults(Number(event.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-[var(--muted)]">{adults} adult{adults > 1 ? "s" : ""}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Children</label>
                <input
                  type="range"
                  min={0}
                  max={6}
                  value={children}
                  onChange={(event) => setChildren(Number(event.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-[var(--muted)]">{children} child{children !== 1 ? "ren" : ""}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Budget</label>
                <input
                  type="range"
                  min={20}
                  max={500}
                  step={5}
                  value={budgetGbp}
                  onChange={(event) => setBudgetGbp(Number(event.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-[var(--muted)]">{formatCurrency(budgetGbp)}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Weeks of supply</label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={weeks}
                  onChange={(event) => setWeeks(Number(event.target.value))}
                  className="w-full"
                />
                <p className="mt-1 text-sm text-[var(--muted)]">{weeks} week{weeks > 1 ? "s" : ""}</p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--accent)] p-4">
                <button
                  type="button"
                  onClick={() => setShowDietary((current) => !current)}
                  className="w-full text-left text-sm font-semibold text-[var(--brand-dark)]"
                >
                  Dietary filters {showDietary ? "−" : "+"}
                </button>
                {showDietary && (
                  <div className="mt-3 space-y-3 text-sm text-[var(--muted)]">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={dietaryFlags.vegetarian}
                        onChange={(event) =>
                          setDietaryFlags((current) => ({ ...current, vegetarian: event.target.checked }))
                        }
                      />
                      Vegetarian
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={dietaryFlags.glutenFree}
                        onChange={(event) =>
                          setDietaryFlags((current) => ({ ...current, glutenFree: event.target.checked }))
                        }
                      />
                      Gluten-free
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={dietaryFlags.noDairy}
                        onChange={(event) =>
                          setDietaryFlags((current) => ({ ...current, noDairy: event.target.checked }))
                        }
                      />
                      No dairy
                    </label>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-full bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)]"
              >
                Print this list
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h2 className="text-2xl font-bold text-[var(--brand-dark)]">Plan your just-in-case pantry</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">What you need for {weeks} week{weeks > 1 ? "s" : ""}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[var(--accent)] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Daily calories needed</p>
                  <p className="mt-1 text-2xl font-bold">{result.dailyCaloriesNeeded.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-[var(--accent)] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Calories planned</p>
                  <p className="mt-1 text-2xl font-bold">{Math.round(result.totalCaloriesPlanned).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-[var(--accent)] p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Budget used</p>
                  <p className="mt-1 text-2xl font-bold">{formatCurrency(result.totalBudgetUsedGbp)}</p>
                </div>
              </div>
              <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[#fff9e6] px-4 py-3 text-sm text-[#6b5500]">
                Your budget covers approximately {approxDaysCovered} day{approxDaysCovered !== 1 ? "s" : ""} of full calories for this household, not the full {weeks}-week target.
              </p>
            </div>

            {Object.entries(grouped).map(([category, lines]) => (
              <section key={category} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
                <h3 className="text-lg font-semibold text-[var(--brand-dark)]">{categoryLabels[category] ?? category}</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                        <th className="pb-2 pr-4">Item</th>
                        <th className="pb-2 pr-4">Calories / unit</th>
                        <th className="pb-2 pr-4">Shelf life</th>
                        <th className="pb-2 pr-4">Cost</th>
                        <th className="pb-2 pr-4">Storage</th>
                        <th className="pb-2 pr-4">Qty</th>
                        <th className="pb-2 pr-4">Buy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.item.id} className="border-b border-[var(--border)] last:border-b-0">
                          <td className="py-3 pr-4 font-medium">{line.item.name}</td>
                          <td className="py-3 pr-4">{Math.round(line.caloriesPerUnit ?? 0).toLocaleString()}</td>
                          <td className="py-3 pr-4">{line.item.shelf_life_months} months</td>
                          <td className="py-3 pr-4">{formatCurrency(line.estimatedCostGbp)}</td>
                          <td className="py-3 pr-4">{line.totalStorageLitres.toFixed(1)}L</td>
                          <td className="py-3 pr-4">{line.quantity}</td>
                          <td className="py-3 pr-4">
                            <a
                              href={buildAmazonHref(line.item)}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border border-[var(--brand)] px-3 py-2 text-xs font-semibold text-[var(--brand)] no-print"
                            >
                              Buy on Amazon
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="text-lg font-semibold text-[var(--brand-dark)]">Essentials and flavour</h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                {result.essentialsAndFlavour.map((item) => (
                  <li key={item.id}>• {item.name}</li>
                ))}
              </ul>
            </section>
          </section>
        </main>

        <footer className="no-print mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[var(--brand-dark)]">Just In Case</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Fixed point in uncertain times</p>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
          </nav>
          <p className="mt-4 text-xs text-[var(--muted)]">Some links are affiliate links. We earn a small commission at no cost to you.</p>
        </footer>
      </div>
    </div>
  );
}
