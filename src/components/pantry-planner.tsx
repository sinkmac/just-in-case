"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import foods from "../../data/foods.json";
import { buildPlan, buildCheapestPlan, type FoodItem, type CheapestPlanResult } from "@/lib/planner";

type DietaryFlags = {
  vegetarian: boolean;
  glutenFree: boolean;
  noDairy: boolean;
};

type DurationTier = "weekend" | "fortnight" | "month" | "season";

const TIER_DATA: Record<DurationTier, { label: string; weeks: number; register: string; pictogram: string }> = {
  weekend: {
    label: "A rough weekend",
    weeks: 3 / 7,
    register: "Power cut, burst main, snowed in. The official-guidance level, and one shop covers it entirely.",
    pictogram: "▦",
  },
  fortnight: {
    label: "A bad fortnight",
    weeks: 2,
    register: "Empty shelves, a supply hiccup that drags. Enough depth that a strange fortnight is an inconvenience, not a crisis.",
    pictogram: "▣",
  },
  month: {
    label: "A hard month",
    weeks: 4,
    register: "A serious disruption. This is where most households should aim — and it still fits in one cupboard.",
    pictogram: "▣ 📦",
  },
  season: {
    label: "A long season",
    weeks: 12,
    register: "This is three months of food — too much to buy in one trip. Add a little extra each time you do your normal shop. Always eat your oldest tins and packets first, and replace them as you buy more, so nothing sits going out of date at the back of a cupboard. You'll need real shelving for this, not just a shelf.",
    pictogram: "🏗️",
  },
};

const categoryLabels: Record<string, string> = {
  staple_carb: "Staple carbs",
  protein: "Protein",
  fat: "Fats",
  vegetable: "Vegetables",
  morale: "Morale",
  micronutrient: "Micronutrients",
};

const categoryIntros: Record<string, string> = {
  fat: "The most calories per pound and per litre of anything you can store. One jar of vegetable oil quietly outworks a whole shelf of tins — own-brand rapeseed oil is the best value here. Lard costs more per litre but adds cooking options when oil won't do.",
  staple_carb: "The bulk of every plan: cheap, dense, and boring on purpose. Plain rice and pasta are the cheapest calories in the whole plan — own-brand at any supermarket is fine. Instant and specialty noodles cost several times more per kg for convenience and flavour variety; they're worth having for a change of pace, but don't let them push out the basics.",
  protein: "Tinned beans, chickpeas, and lentils are the cheapest protein you can store — own-brand at Aldi or Lidl consistently leads on price. Tinned fish costs more per gram but adds variety and needs no cooking. Prices change, so always worth checking what's cheapest at your local shop.",
  vegetable: "Not for calories — for staying human. Tinned tomatoes, sweetcorn, and peas are cheap year-round, and own-brand is just as good as anything branded. Buy whatever's on offer at your local supermarket.",
  micronutrient: "Calories keep you alive. These keep you well. Dried fruit and tinned fruit are the most affordable sources here — own-brand dried apricots and raisins are a solid choice. A basic multivitamin fills any gaps without needing to think about it. If you're two weeks or more into stored food, you can grow fresh greens with almost nothing: a spoonful of dried red lentils or peas in a jar of water will sprout in 3–5 days — no soil, no garden, no special kit needed. A tray of microgreens on a windowsill takes 7–14 days and gives you fresh, nutrient-dense leaves from the same approach. A proper sprouting jar or microgreens tray makes it easier, but the jar-of-water method costs nothing beyond what's already in your cupboard.",
  morale: "A crisis pantry without chocolate gets abandoned. This is not a joke category — food you look forward to is food you'll actually rotate and eat. Own-brand chocolate and instant coffee are fine; honey keeps indefinitely.",
};

function litresToShelfTerms(litres: number): string {
  if (litres < 5) return "a shoebox";
  if (litres < 15) return "half a cupboard shelf";
  if (litres < 30) return "roughly one cupboard shelf";
  if (litres < 60) return "two cupboard shelves, or one under-bed box";
  return "a full cupboard — or one cheap shelving unit in a hall or garage";
}

type SpaceOption = "shoebox" | "half-shelf" | "one-shelf" | "cupboard";

const SPACE_LITRES: Record<SpaceOption, number> = {
  "shoebox": 8,
  "half-shelf": 15,
  "one-shelf": 30,
  "cupboard": 60,
};

const BUTTON_LABELS: Record<SpaceOption, string> = {
  "shoebox": "A shoebox",
  "half-shelf": "Half a shelf",
  "one-shelf": "One shelf",
  "cupboard": "A whole cupboard",
};

const SPACE_LABELS: Record<SpaceOption, string> = {
  "shoebox": "a shoebox",
  "half-shelf": "half a shelf",
  "one-shelf": "one shelf",
  "cupboard": "a whole cupboard",
};

type SwapEntry = {
  id: string;
  fromName: string;
  toName: string;
  litresReclaimedPerUnit: number;
  badgeText?: string;
  tradeOff: string;
};

const SWAPS: SwapEntry[] = [
  {
    id: "chickpeas-to-lentils",
    fromName: "Tinned chickpeas",
    toName: "Red lentils",
    litresReclaimedPerUnit: 0.25,
    tradeOff: "Red lentils need water and about 20 minutes of heat. Tinned chickpeas you open and eat.",
  },
  {
    id: "oats-to-rice",
    fromName: "Rolled oats",
    toName: "White rice",
    litresReclaimedPerUnit: 0.7,
    tradeOff: "Rice is more compact than oats but less versatile for breakfast. You give up porridge for shelf space.",
  },
  {
    id: "lentils-to-beans",
    fromName: "Red lentils",
    toName: "Tinned beans",
    litresReclaimedPerUnit: 0,
    badgeText: "ready without heat",
    tradeOff: "Takes up more shelf space — but it's a meal you can eat straight from the tin when the hob's out of action.",
  },
];

function sumCategoryLitres(lines: { totalStorageLitres: number }[]): number {
  return lines.reduce((sum, line) => sum + line.totalStorageLitres, 0);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value);
}

// "A small comfort" fixed-inclusion line — added as a flat extra to every plan's
// till total. Not part of the optimised category tables, and never competes for
// calorie budget or is swapped by the solver. Scenario Mode tags it needs-heat
// when the power's out, exactly like the table items.
const COMFORT_TEA_NAME = "Tea bags, 80-pack";
const COMFORT_TEA_COST = 1.45;

function buildAmazonHref(item: FoodItem) {
  if (item.amazon_asin && item.amazon_asin !== "XXXXXXXXXX") {
    return `https://www.amazon.co.uk/dp/${item.amazon_asin}?tag=biteforecast2-21`;
  }

  return `https://www.amazon.co.uk/s?k=${encodeURIComponent(item.name)}&tag=biteforecast2-21`;
}

function TierPictogram({ tier, reducedFill }: { tier: DurationTier; reducedFill?: number }) {
  const cabinet = (
    <>
      <rect x="2" y="2" width="48" height="60" rx="3" fill="#F7F1E3" stroke="#5C4630" strokeWidth="2"/>
    </>
  );

  const shelf = (y: number, filled: boolean) => (
    <rect x="6" y={y} width="40" height="7" rx="1" fill={filled ? "#8A4B2E" : "#E9DFC8"}/>
  );

  const SHELF_Y = [53, 42, 31, 20, 9];

  let fillCount: number;
  if (reducedFill !== undefined) {
    fillCount = Math.round(reducedFill * 5);
  } else {
    const fillMap: Record<DurationTier, number> = { weekend: 1, fortnight: 2, month: 3, season: 5 };
    fillCount = fillMap[tier];
  }

  if (tier === "season" && reducedFill === undefined) {
    // season default — two cabinets, both fully filled
    return (
      <svg width="78" height="64" viewBox="0 0 78 64" role="img" aria-label="Two cupboards pictogram, both fully filled, representing a season's worth of storage" className="inline-block align-middle">
        <rect x="2" y="2" width="48" height="60" rx="3" fill="#F7F1E3" stroke="#5C4630" strokeWidth="2"/>
        {SHELF_Y.map((y) => shelf(y, true))}
        <rect x="54" y="14" width="22" height="48" rx="3" fill="#F7F1E3" stroke="#5C4630" strokeWidth="2"/>
        <rect x="57" y="47" width="16" height="7" rx="1" fill="#8A4B2E"/>
        <rect x="57" y="36" width="16" height="7" rx="1" fill="#8A4B2E"/>
        <rect x="57" y="25" width="16" height="7" rx="1" fill="#8A4B2E"/>
      </svg>
    );
  }

  // Single cabinet, fill controlled by fillCount
  const clamped = Math.max(0, Math.min(5, fillCount));
  const label = `${clamped} of five shelves filled`;
  return (
    <svg width="52" height="64" viewBox="0 0 52 64" role="img" aria-label={`Cupboard pictogram, ${label}`} className="inline-block align-middle">
      {cabinet}
      {SHELF_Y.map((y, i) => shelf(y, i < clamped))}
    </svg>
  );
}

export function PantryPlanner() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [budgetGbp, setBudgetGbp] = useState(120);
  const [tier, setTier] = useState<DurationTier>("month");
  const [showDietary, setShowDietary] = useState(false);
  const [dietaryFlags, setDietaryFlags] = useState<DietaryFlags>({
    vegetarian: false,
    glutenFree: false,
    noDairy: false,
  });
  const [childCalorieRatio, setChildCalorieRatio] = useState(0.6);
  const [showAgeBands, setShowAgeBands] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<SpaceOption | null>(null);
  const [activeSwaps, setActiveSwaps] = useState<Set<string>>(new Set());
  const [powerState, setPowerState] = useState<"working" | "out">("working");
  const [waterState, setWaterState] = useState<"running" | "limited" | "none">("running");
  const [floorMode, setFloorMode] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);

  const result = useMemo(
    () =>
      buildPlan(
        {
          adults,
          children,
          budgetGbp,
          weeks: TIER_DATA[tier].weeks,
          dietaryFlags,
          childCalorieRatio,
        },
        foods as FoodItem[],
      ),
    [adults, children, budgetGbp, tier, dietaryFlags, childCalorieRatio],
  );

  const cheapestPlan = useMemo(
    () =>
      buildCheapestPlan(
        {
          adults,
          children,
          weeks: TIER_DATA[tier].weeks,
          dietaryFlags,
          childCalorieRatio,
        },
        foods as FoodItem[],
      ),
    [adults, children, tier, dietaryFlags, childCalorieRatio],
  );

  const activeResult = floorMode ? cheapestPlan : result;

  // Single source of truth for money spent on the page: the food plan's till
    // total plus the flat small-comfort addition. Every spend figure derives from
    // these two numbers, so they cannot disagree. The solver's calorie figures are
    // untouched.
    const planTotalSpend = result.totalBudgetUsedGbp + COMFORT_TEA_COST;
    const planRemaining = Math.max(0, budgetGbp - planTotalSpend);
    const tillMinCost = cheapestPlan.totalCostGbp + COMFORT_TEA_COST;

  const activeGrouped = useMemo(() => {
    return activeResult.ranked.reduce<Record<string, typeof activeResult.ranked>>((acc, line) => {
      acc[line.category] ??= [];
      acc[line.category].push(line);
      return acc;
    }, {});
  }, [activeResult]);

  const grouped = useMemo(() => {
    return result.ranked.reduce<Record<string, typeof result.ranked>>((acc, line) => {
      acc[line.category] ??= [];
      acc[line.category].push(line);
      return acc;
    }, {});
  }, [result]);

  const tierWeeks = TIER_DATA[tier].weeks;
  const tierLabel = TIER_DATA[tier].label;
  const tierLabelLower = tierLabel.toLowerCase().replace(/^a /, "");

  const totalLitres = useMemo(() => {
    return Object.values(grouped).reduce((sum, lines) => sum + sumCategoryLitres(lines), 0);
  }, [grouped]);

  const swapReclaimed = useMemo(() => {
    let total = 0;
    for (const swap of SWAPS) {
      if (activeSwaps.has(swap.id)) {
        const matched = result.ranked.find((r) => r.item.name === swap.fromName);
        if (matched) {
          total += matched.quantity * swap.litresReclaimedPerUnit;
        }
      }
    }
    return total;
  }, [result.ranked, activeSwaps]);

  const schedule = useMemo(() => {
    const items = activeResult.ranked
      .map((r) => ({ name: r.item.name, qty: r.quantity, cost: r.estimatedCostGbp }))
      .sort((a, b) => a.cost - b.cost);
    const totalCost = items.reduce((s, i) => s + i.cost, 0);

    if (items.length === 0 || totalCost === 0) return { weeks: [] as { label: string; items: typeof items; cost: number; runningTotal: number }[], totalWeeks: 0, totalCost: 0 };

    let numWeeks = Math.max(1, Math.min(Math.round((totalCost + COMFORT_TEA_COST) / 20), 8));
    if (tier === "weekend") numWeeks = Math.min(numWeeks, 1);
    if (numWeeks < 1) numWeeks = 1;

    const weeks: { label: string; items: typeof items; cost: number; runningTotal: number }[] = [];
    for (let w = 0; w < numWeeks; w++) {
      weeks.push({ label: `Week ${w + 1}`, items: [], cost: 0, runningTotal: 0 });
    }

    let itemIdx = 0;
    for (const item of items) {
      for (let q = 0; q < item.qty; q++) {
        const unitCost = item.cost / item.qty;
        weeks[itemIdx % numWeeks].items.push({ ...item, qty: 1, cost: unitCost });
        weeks[itemIdx % numWeeks].cost += unitCost;
        itemIdx++;
      }
    }

    // Sort each week's items by cost descending (most expensive first)
    for (const w of weeks) {
      w.items.sort((a, b) => b.cost - a.cost);
    }

    // Compute running totals
    let rt = 0;
    for (const w of weeks) {
      rt += w.cost;
      w.runningTotal = rt;
    }

    return { weeks, totalWeeks: numWeeks, totalCost };
  }, [activeResult, tier]);

  const reducedLitres = Math.max(0, totalLitres - swapReclaimed);

  const scenarioCounts = useMemo(() => {
    const needsHeat = result.ranked.filter((r) => r.item.prep === "needs-heat").length;
    const needsHeatNoCookSwap = result.ranked.filter(
      (r) => r.item.prep === "needs-heat" && SWAPS.some((s) => s.fromName === r.item.name),
    ).length;
    return { needsHeat, needsHeatNoCookSwap };
  }, [result.ranked]);

  const verdict = useMemo(() => {
    const coveredDays = Math.floor(result.totalCaloriesPlanned / Math.max(1, result.dailyCaloriesNeeded));
    const targetDays = tierWeeks * 7;

    // Shortfall — budget runs out before meeting the target
    if (coveredDays < targetDays) {
      const shortfallDays = targetDays - coveredDays;
      const costPerDay = result.totalBudgetUsedGbp / Math.max(1, coveredDays);
      const gap = Math.round(costPerDay * shortfallDays);

      const modifiers: string[] = [];
      if (result.varietyDisclosure) {
        modifiers.push("Concentrated on fewer items to fit your budget.");
      }
      if (result.droppedCategories.length > 0) {
        modifiers.push(`No ${result.droppedCategories.join(", ")} could be included within your budget.`);
      }

      return {
        state: "short" as const,
        message: `Your \u00A3${budgetGbp} covers about ${coveredDays} day${coveredDays !== 1 ? "s" : ""} of full meals for this household — ${shortfallDays} day${shortfallDays !== 1 ? "s" : ""} short of your ${tierLabelLower} target. You could close the gap for roughly \u00A3${gap} more — or start here, and top up on your next shop. Either way, you're further along than most households ever get.`,
        modifiers,
      };
    }

    const spare = planRemaining;

    // Exceeds target comfortably — significant budget leftover
    if (spare > budgetGbp * 0.15) {
      return {
        state: "exceeds" as const,
        message: `Your \u00A3${budgetGbp} covers your ${tierLabelLower} target with about \u00A3${spare} to spare. Before extending further: check your water. Most households run out of stored water long before stored food.`,
        modifiers: [] as string[],
      };
    }

    // Meets target — fully covered with modest leftover
    return {
      state: "meets" as const,
      message: `Your \u00A3${budgetGbp} fully covers ${tierLabel.toLowerCase()} for this household, with about \u00A3${spare.toFixed(2)} left over. Spend the rest on the Essentials list below — that's what turns stored calories into actual dinners.`,
      modifiers: [] as string[],
    };
  }, [result, tierWeeks, tierLabel, budgetGbp]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 print-shell">
        <header className="no-print mb-8">
          <h1 className="mt-2 text-3xl font-bold text-[var(--brand-dark)]">Just In Case</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Planning for the future you hope never comes. But just might.</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            There are really only two big decisions here: what you're going to buy, and where you're going to keep it. Get those right and everything else follows.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Most emergency food advice skips straight past both — it just tells you to "stock up." We don't think that's much use on its own. So below, you'll find plans built around what actually keeps well, feeds a household properly, and fits the space most people really have — not a bunker, just a cupboard, a shelf, maybe a bit under the bed.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Tell us who's in your house and what you can spend. We'll show you what long-life food to buy, why each thing earns its place, and how long it would actually keep your household fed. No bunker required — this all fits in a cupboard.
          </p>
        </header>

        <div className="no-print mb-6 bg-[var(--accent)] p-4">
          <p className="text-sm font-medium text-[var(--brand-dark)]">
            Not sure where to start?{" "}
            <Link
              href="/ready"
              className="underline decoration-1 underline-offset-2 hover:text-[var(--brand)] transition-colors"
            >
              Take the readiness check
            </Link>
            {" "}— seventeen quick questions, about three minutes, and an honest picture of where your household stands right now.
          </p>
        </div>

        <main className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
          <section className="no-print rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm lg:sticky lg:top-6">
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
                {floorMode ? (
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--accent)] p-3">
                    <p className="text-xs text-[var(--muted)]">Minimum needed</p>
                    <p className="mt-1 text-lg font-bold text-[var(--brand-dark)]">
                      {formatCurrency(tillMinCost)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                      {cheapestPlan.totalCostGbp < 20
                        ? `Good news — ${tierLabel.toLowerCase()} costs next to nothing to cover properly for this household.`
                        : `The least this household could spend and still cope for ${tierLabelLower} is about ${formatCurrency(tillMinCost)}.`
                      }
                    </p>
                    <button
                      type="button"
                      onClick={() => setFloorMode(false)}
                      className="mt-2 text-xs font-medium text-[var(--brand)] underline"
                    >
                      Set a budget instead
                    </button>
                  </div>
                ) : (
                  <>
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
                    <button
                      type="button"
                      onClick={() => setFloorMode(true)}
                      className="mt-2 text-xs font-medium text-[var(--brand)] underline"
                    >
                      What's the least I need to spend?
                    </button>
                  </>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["weekend", "fortnight", "month", "season"] as DurationTier[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        tier === t
                          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]"
                      }`}
                    >
                      <span className="block text-xs font-semibold">{TIER_DATA[t].label}</span>
                      <span className="mt-0.5 block text-[11px] leading-tight opacity-80">{TIER_DATA[t].register}</span>
                    </button>
                  ))}
                </div>
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

              <div className="pt-2 border-t border-dashed border-[var(--border)]">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-full bg-[var(--brand)] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              >
                🖨 Print this list
              </button>
            </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h2 className="heading-serif text-2xl">Plan your just-in-case pantry</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                <span className="mr-2"><TierPictogram tier={tier} reducedFill={activeSwaps.size > 0 ? reducedLitres / Math.max(1, totalLitres) : undefined} /></span>
                                {tierLabel}
                              </p>
                              {(() => {
                                const days = Math.floor(result.totalCaloriesPlanned / Math.max(1, result.dailyCaloriesNeeded));
                                return (
                                  <p className="mt-4 text-sm font-medium text-[var(--brand-dark)]">
                                    This covers your household for about {days} day{days !== 1 ? "s" : ""} — in one cupboard, for {formatCurrency(planTotalSpend)}, with {formatCurrency(planRemaining)} left.
                                  </p>
                                );
                              })()}
                              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[var(--accent)] p-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[var(--muted)]">
                      Daily calories needed
                    </p>
                    {children > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAgeBands((v) => !v)}
                        className="text-[10px] text-[var(--brand)] underline hover:text-[var(--brand-dark)]"
                      >
                        {showAgeBands ? "hide" : "change"}
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-2xl font-bold">{result.dailyCaloriesNeeded.toLocaleString()}</p>
                  {children > 0 && (
                    <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                      assumes {childCalorieRatio === 0.5 ? "toddler" : childCalorieRatio === 0.8 ? "teen" : "school-age"} child
                    </p>
                  )}
                  {showAgeBands && children > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <p className="mb-2 text-[11px] font-semibold text-[var(--muted)]">Child age band</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: "Toddler", sub: "1–3", ratio: 0.5 },
                          { label: "School-age", sub: "4–10", ratio: 0.6 },
                          { label: "Teen", sub: "11–17", ratio: 0.8 },
                        ].map((band) => (
                          <label
                            key={band.ratio}
                            className={`flex cursor-pointer flex-col items-center rounded-lg border px-2 py-1.5 text-center transition-colors ${
                              childCalorieRatio === band.ratio
                                ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand-dark)]"
                                : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="childCalorieRatio"
                              value={band.ratio}
                              checked={childCalorieRatio === band.ratio}
                              onChange={() => setChildCalorieRatio(band.ratio)}
                              className="sr-only"
                            />
                            <span className="text-[11px] font-medium leading-tight">{band.label}</span>
                            <span className="text-[10px] opacity-75">{band.sub}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded-2xl bg-[var(--accent)] p-4">
                  <p className="text-xs text-[var(--muted)]">Calories planned</p>
                  <p className="mt-1 text-2xl font-bold">{Math.round(activeResult.totalCaloriesPlanned).toLocaleString()}</p>
                </div>
                {floorMode ? (
                  <div className="rounded-2xl bg-[var(--accent)] p-4">
                    <p className="text-xs text-[var(--muted)]">Minimum spend</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(tillMinCost)}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[var(--accent)] p-4">
                    <p className="text-xs text-[var(--muted)]">Budget used</p>
                    <p className="mt-1 text-2xl font-bold">{formatCurrency(planTotalSpend)}</p>
                  </div>
                )}
              </div>
              {floorMode ? (
                <div className="verdict-panel">
                  <p className="font-medium">
                    {cheapestPlan.totalCostGbp < 4
                      ? `Good news — for this household, ${tierLabelLower} costs next to nothing to cover properly. ${formatCurrency(tillMinCost)} and you're covered.`
                      : `The least you could spend and still cope for ${tierLabelLower} is about ${formatCurrency(tillMinCost)} — here's exactly what that buys.`
                    }
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    This is the minimum, not the goal — spend more if you can, but this is what genuinely covers you if that's all there is.
                  </p>
                </div>
              ) : (
                <div className="verdict-panel">
                  <p className="font-medium">{verdict.message}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="heading-serif text-sm">Space audit</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">What storage space do you have? It's the most honest constraint — most households find the space before they find the money.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["shoebox", "half-shelf", "one-shelf", "cupboard"] as SpaceOption[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSpace(selectedSpace === s ? null : s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedSpace === s
                        ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]"
                    }`}
                  >
                    {BUTTON_LABELS[s]}
                  </button>
                ))}
              </div>

              {selectedSpace && (
                <>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {SPACE_LABELS[selectedSpace].charAt(0).toUpperCase() + SPACE_LABELS[selectedSpace].slice(1)} holds about{" "}
                    {Math.round((SPACE_LITRES[selectedSpace] / Math.max(1, totalLitres)) * 100)}% of this plan.
                  </p>

                  {(() => {
                    const ranked = [...SWAPS]
                      .map((swap) => {
                        const matched = result.ranked.find((r) => r.item.name === swap.fromName);
                        const qty = matched?.quantity ?? 0;
                        const reclaimed = qty * swap.litresReclaimedPerUnit;
                        return { ...swap, qty, reclaimed };
                      })
                      .filter((s) => s.qty > 0)
                      .filter((s) => s.litresReclaimedPerUnit > 0)
                      .sort((a, b) => b.reclaimed - a.reclaimed)
                      .slice(0, 2);

                    if (ranked.length === 0) return null;

                    return (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                          Suggested swaps
                        </p>
                        {ranked.map((swap) => {
                          const isActive = activeSwaps.has(swap.id);
                          return (
                            <div
                              key={swap.id}
                              className={`rounded-xl border p-3 text-sm transition-colors ${
                                isActive
                                  ? "border-[var(--brand)] bg-[var(--brand)]/5"
                                  : "border-[var(--border)] bg-[var(--card)]"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-[var(--brand-dark)]">
                                    {swap.fromName} &rarr; {swap.toName}
                                  </p>
                                  <p className="mt-0.5 text-xs text-[var(--brand)]">
                                    {swap.badgeText ?? `Reclaims ${litresToShelfTerms(swap.reclaimed)}`}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = new Set(activeSwaps);
                                    if (isActive) next.delete(swap.id);
                                    else next.add(swap.id);
                                    setActiveSwaps(next);
                                  }}
                                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                    isActive
                                      ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                      : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--accent)]"
                                  }`}
                                >
                                  {isActive ? "Applied" : "See this applied"}
                                </button>
                              </div>
                              <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                                {swap.tradeOff}
                              </p>
                            </div>
                          );
                        })}
                        {activeSwaps.size > 0 && (
                          <p className="mt-2 text-xs text-[var(--muted)] italic">
                            Applying {activeSwaps.size === 1 ? "this swap" : "these swaps"} would fit this plan in
                            your {SPACE_LABELS[selectedSpace]}, with{" "}
                            {litresToShelfTerms(Math.max(0, SPACE_LITRES[selectedSpace] - reducedLitres))} left over.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}

              <div className="mt-4 space-y-3">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                  Space-saving gear
                </p>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--brand-dark)]">Vacuum storage bags or sealer</p>
                      <p className="mt-0.5 text-xs text-[var(--brand)]">The same food, using less space</p>
                    </div>
                    <a
                      href="https://www.amazon.co.uk/s?k=vacuum+food+sealer&tag=biteforecast2-21"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                    >
                      See on Amazon
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                    Don't vacuum-seal loose rice or pasta directly in shrink bags — sharp grain edges can pierce the film over time. The safer method is a rigid container with a vacuum valve lid.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--brand-dark)]">Foil / space emergency blanket</p>
                      <p className="mt-0.5 text-xs text-[var(--brand)]">Compact, lightweight heat retention</p>
                    </div>
                    <a
                      href="https://www.amazon.co.uk/s?k=emergency+space+blanket&tag=biteforecast2-21"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                    >
                      See on Amazon
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                    A compact, lightweight way to retain body heat if normal heating fails. Costs a few pounds and takes up almost no space.
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--brand-dark)]">Fire blanket</p>
                      <p className="mt-0.5 text-xs text-[var(--brand)]">The simplest kitchen fire safety tool</p>
                    </div>
                    <a
                      href="https://www.amazon.co.uk/s?k=fire+blanket+kitchen&tag=biteforecast2-21"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                    >
                      See on Amazon
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                    A fire blanket is the more universal starting point — cheaper than an extinguisher, needs no training, and covers the most common domestic fire type (pan fires).
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--brand-dark)]">ABC powder fire extinguisher</p>
                      <p className="mt-0.5 text-xs text-[var(--brand)]">Broader coverage for households who want it</p>
                    </div>
                    <a
                      href="https://www.amazon.co.uk/s?k=ABC+powder+fire+extinguisher&tag=biteforecast2-21"
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                    >
                      See on Amazon
                    </a>
                  </div>
                  <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                    A step up from the fire blanket — covers wood, paper, flammable liquids, and electrical fires. One extinguisher per floor is the standard recommendation.
                  </p>
                </div>
              </div>
              {selectedSpace && SPACE_LITRES[selectedSpace] < totalLitres && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                    Need more space?
                  </p>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--brand-dark)]">Wire / metal shelving unit</p>
                        <p className="mt-0.5 text-xs text-[var(--brand)]">The cheapest way to get from a shelf to a shelving unit</p>
                      </div>
                      <a
                        href="https://www.amazon.co.uk/s?k=wire+shelving+unit&tag=biteforecast2-21"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                      >
                        See on Amazon
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                      A plain multi-tier shelf unit is the cheapest way to get from "a shelf" to "a shelving unit" — no need for anything fancier. Basic wire or metal shelving runs about £15–£30, is floor-standing, and holds several times what a single cupboard shelf can.
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--brand-dark)]">Under-bed storage boxes</p>
                        <p className="mt-0.5 text-xs text-[var(--brand)]">Use space you already have — zero extra floor space</p>
                      </div>
                      <a
                        href="https://www.amazon.co.uk/s?k=under+bed+storage+boxes&tag=biteforecast2-21"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                      >
                        See on Amazon
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                      If you don't have room for a shelf, under-bed boxes use space you already have and take up nothing extra. Stackable, cheap, and they keep tins and packets out of sight but still organised.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="heading-serif text-sm">Scenario</h3>
              <p className="mt-1 text-xs text-[var(--muted)]">What are your utilities like?</p>

              <div className="mt-4">
                <p className="text-xs font-medium text-[var(--muted)] mb-2">Power</p>
                <div className="flex flex-wrap gap-2">
                  {(["working", "out"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPowerState(p)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        powerState === p
                          ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]"
                      }`}
                    >
                      {p === "working" ? "Working" : "Out"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-[var(--muted)] mb-2">Running water</p>
                <div className="flex flex-wrap gap-2">
                  {(["running", "limited", "none"] as const).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWaterState(w)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        waterState === w
                          ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--accent)]"
                      }`}
                    >
                      {w === "running" ? "Running" : w === "limited" ? "Limited" : "None"}
                    </button>
                  ))}
                </div>
              </div>

              {(powerState !== "working" || waterState !== "running") && (
                <div className="mt-4 verdict-panel">
                  <p>
                    {powerState === "out" && waterState === "running" && (
                      <>No power means no cooking. {scenarioCounts.needsHeat} item{scenarioCounts.needsHeat !== 1 ? "s" : ""} below need{scenarioCounts.needsHeat === 1 ? "s" : ""} a hob or kettle — they're flagged, and we've suggested {scenarioCounts.needsHeatNoCookSwap} ready-to-eat swap{scenarioCounts.needsHeatNoCookSwap !== 1 ? "s" : ""} that {scenarioCounts.needsHeatNoCookSwap === 1 ? "needs nothing done to it" : "need nothing done to them"}.</>
                    )}
                    {powerState === "working" && waterState === "limited" && (
                      <>Limited water means cooking is possible but rationed. Dried foods that need boiling now cost you stored water too — check the flagged items below.</>
                    )}
                    {powerState === "working" && waterState === "none" && (
                      <>No running water changes the maths on everything dried. At 3 litres a person a day just to drink, water becomes the real constraint — not food.</>
                    )}
                    {powerState === "out" && waterState === "none" && (
                      <>With neither power nor water, only ready-to-eat food works. {scenarioCounts.needsHeat} item{scenarioCounts.needsHeat !== 1 ? "s" : ""} below need{scenarioCounts.needsHeat === 1 ? "s" : ""} cooking water or heat and {scenarioCounts.needsHeat === 1 ? "isn't" : "aren't"} realistic right now.</>
                    )}
                    {powerState === "out" && waterState === "limited" && (
                      <>No power means no cooking. {scenarioCounts.needsHeat} item{scenarioCounts.needsHeat !== 1 ? "s" : ""} below need{scenarioCounts.needsHeat === 1 ? "s" : ""} a hob or kettle. Limited water means dried foods that need boiling also cost you stored water.</>
                    )}
                  </p>
                </div>
              )}

              {(waterState === "limited" || waterState === "none") && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                    Water gear
                  </p>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--brand-dark)]">Water purification tablets or filter</p>
                        <p className="mt-0.5 text-xs text-[var(--brand)]">Necessary for treating an unclear or untreated source</p>
                      </div>
                      <a
                        href="https://www.amazon.co.uk/s?k=water+purification+tablets&tag=biteforecast2-21"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                      >
                        See on Amazon
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                      Filters remove bacteria and protozoa but not all viruses. Chlorine dioxide tablets handle a broader range but take longer to act. If you're treating from an unknown source, tablets are the safer bet.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--brand-dark)]">Water butt for rainwater collection</p>
                        <p className="mt-0.5 text-xs text-[var(--brand)]">A backup source when mains water is disrupted</p>
                      </div>
                      <a
                        href="https://www.amazon.co.uk/s?k=water+butt+rainwater+collection&tag=biteforecast2-21"
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
                      >
                        See on Amazon
                      </a>
                    </div>
                    <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                      A water butt collects rainwater for use when mains water is disrupted. Some UK councils and charities give water butts away free to households in fuel or water poverty — worth checking local schemes before buying, if you're eligible.
                    </p>
                  </div>
                </div>
              )}

              {powerState === "out" && (() => {
                const relevantSwaps = SWAPS
                  .map((swap) => {
                    const matched = result.ranked.find((r) => r.item.name === swap.fromName);
                    const qty = matched?.quantity ?? 0;
                    const reclaimed = qty * swap.litresReclaimedPerUnit;
                    return { ...swap, qty, reclaimed, sourcePrep: matched?.item.prep };
                  })
                  .filter((s) => s.qty > 0 && s.sourcePrep === "needs-heat" && (() => {
                    const target = (foods as any[]).find((f) => f.name === s.toName);
                    return target?.prep === "no-cook";
                  })());

                if (relevantSwaps.length === 0) return null;

                return (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">
                      Ready-to-eat alternatives
                    </p>
                    {relevantSwaps.map((swap) => {
                      const isActive = activeSwaps.has(swap.id);
                      return (
                        <div
                          key={swap.id}
                          className={`rounded-xl border p-3 text-sm transition-colors ${
                            isActive
                              ? "border-[var(--brand)] bg-[var(--brand)]/5"
                              : "border-[var(--border)] bg-[var(--card)]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-[var(--brand-dark)]">
                                {swap.fromName} &rarr; {swap.toName}
                              </p>
                              <p className="mt-0.5 text-xs text-[var(--brand)]">
                                {swap.badgeText ?? `Reclaims ${litresToShelfTerms(swap.reclaimed)}`}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const next = new Set(activeSwaps);
                                if (isActive) next.delete(swap.id);
                                else next.add(swap.id);
                                setActiveSwaps(next);
                              }}
                              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                isActive
                                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                                  : "border-[var(--border)] text-[var(--muted)] hover:bg-[var(--accent)]"
                              }`}
                            >
                              {isActive ? "Applied" : "See this applied"}
                            </button>
                          </div>
                          <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                            {swap.tradeOff}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {(() => {
              const entries = Object.entries(floorMode ? activeGrouped : grouped);
              const largeEntries = entries.filter(([, lines]) => lines.length >= 3);
              const smallEntries = entries.filter(([, lines]) => lines.length <= 2);
              const allLitres = entries.reduce((sum, [, lines]) => sum + sumCategoryLitres(lines), 0);

              return (
                <>
                  {largeEntries.map(([category, lines]) => {
                    const catLitres = sumCategoryLitres(lines);
                    return (
                      <section key={category} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
                        <h3 className="category-ticket">{categoryLabels[category] ?? category}</h3>
                        {categoryIntros[category] && (
                          <>
                            <p className="category-rationale">
                              {categoryIntros[category]}
                              {tier === "season" && category === "micronutrient" && (
                                <> Over a season, these stop being optional — variety is what keeps a long stretch healthy, not just fed.</>
                              )}
                            </p>
                            {category === "micronutrient" && (
                              <p className="mt-1 text-xs text-[var(--brand)]">
                                A sprouting jar or microgreens tray makes it easier —{" "}
                                <a
                                  href="https://www.amazon.co.uk/s?k=sprouting+jar+kit&tag=biteforecast2-21"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline hover:text-[var(--brand-dark)]"
                                >
                                  see options on Amazon
                                </a>
                              </p>
                            )}
                          </>
                        )}
                        {category === "protein" && tier !== "weekend" && (
                          <p className="mt-2 text-sm text-[var(--brand)]">
                            At least one item in this list needs no cooking and no water — if the power's out, you can still eat.
                          </p>
                        )}
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="border-b border-dashed border-[var(--border)] text-left text-[var(--muted)]">
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
                                <tr key={line.item.id} className="border-b border-dashed border-[var(--border)] last:border-b-0">
                                  <td className="py-3 pr-4 font-medium">
                                    {line.item.name}
                                    {tier !== "weekend" && line.item.noCookReady && (
                                      <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#EDF2E8] text-[#2F4A24]">
                                        Eat straight from the tin
                                      </span>
                                    )}
                                    {powerState === "out" && line.item.prep && (
                                      <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        line.item.prep === "no-cook"
                                          ? "bg-[#EDF2E8] text-[#2F4A24]"
                                          : "bg-[#FCEBEB] text-[#791F1F]"
                                      }`}>
                                        {line.item.prep === "no-cook" ? "no cook" : "needs heat"}
                                      </span>
                                    )}
                                  </td>
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
                                      className="text-xs text-[var(--muted)] underline hover:text-[var(--brand)] no-print"
                                    >
                                      Buy on Amazon
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="shelf-line">Fits in {litresToShelfTerms(catLitres)}.</p>
                      </section>
                    );
                  })}
                  {smallEntries.length > 0 && (
                    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm print-card">
                      <h3 className="heading-serif text-sm">Smaller categories</h3>
                      <div className="mt-3 space-y-3">
                        {smallEntries.map(([category, lines]) => {
                          const catLitres = sumCategoryLitres(lines);
                          return (
                            <div key={category}>
                              <p className="category-ticket !mb-0 !inline-block !text-xs !px-3 !py-1">
                                {categoryLabels[category] ?? category}
                              </p>
                              {categoryIntros[category] && (
                                <>
                                  <p className="category-rationale !text-[11px]">
                                    {categoryIntros[category]}
                                    {tier === "season" && category === "micronutrient" && (
                                      <> Over a season, these stop being optional — variety is what keeps a long stretch healthy, not just fed.</>
                                    )}
                                  </p>
                                  {category === "micronutrient" && (
                                    <p className="mt-1 text-xs text-[var(--brand)]">
                                      A sprouting jar or microgreens tray makes it easier —{" "}
                                      <a
                                        href="https://www.amazon.co.uk/s?k=sprouting+jar+kit&tag=biteforecast2-21"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline hover:text-[var(--brand-dark)]"
                                      >
                                        see options on Amazon
                                      </a>
                                    </p>
                                  )}
                                </>
                              )}
                              {category === "protein" && tier !== "weekend" && (
                                <p className="mt-1 text-[11px] text-[var(--brand)]">
                                  At least one item in this list needs no cooking and no water — if the power's out, you can still eat.
                                </p>
                              )}
                              <table className="min-w-full text-xs">
                                                              <thead>
                                                                <tr className="border-b border-dashed border-[var(--border)] text-left text-[var(--muted)]">
                                                                  <th className="pb-1 pr-3">Item</th>
                                                                  <th className="pb-1 pr-3">Cal</th>
                                                                  <th className="pb-1 pr-3">Cost</th>
                                                                  <th className="pb-1 pr-3">Qty</th>
                                                                  <th className="pb-1 pr-3">Buy</th>
                                                                </tr>
                                                              </thead>
                                                              <tbody>
                                                                {lines.map((line) => (
                                                                  <tr key={line.item.id} className="border-b border-dashed border-[var(--border)] last:border-b-0">
                                                                    <td className="py-1 pr-3 font-medium">
                                                                          {line.item.name}
                                                                          {tier !== "weekend" && line.item.noCookReady && (
                                                                            <span className="ml-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-[#EDF2E8] text-[#2F4A24]">
                                                                              Eat straight from the tin
                                                                            </span>
                                                                          )}
                                                                          {powerState === "out" && line.item.prep && (
                                                                                                            <span className={`ml-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                                                                                                              line.item.prep === "no-cook"
                                                                                                                ? "bg-[#EDF2E8] text-[#2F4A24]"
                                                                                                                : "bg-[#FCEBEB] text-[#791F1F]"
                                                                                                            }`}>
                                                                                                              {line.item.prep === "no-cook" ? "no cook" : "needs heat"}
                                                                                                            </span>
                                                                                                          )}
                                                                                                        </td>
                                                                                                        <td className="py-1 pr-3">{Math.round(line.caloriesPerUnit ?? 0).toLocaleString()}</td>
                                                                                                        <td className="py-1 pr-3">{formatCurrency(line.estimatedCostGbp)}</td>
                                                                                                        <td className="py-1 pr-3">{line.quantity}</td>
                                                                    <td className="py-1 pr-3">
                                        <a
                                          href={buildAmazonHref(line.item)}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[var(--muted)] underline hover:text-[var(--brand)] no-print"
                                        >
                                          Buy
                                        </a>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <p className="shelf-line !text-[11px]">Fits in {litresToShelfTerms(catLitres)}.</p>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                  {allLitres > 0 && (
                    <p className="shelf-line !text-sm italic">
                      Everything above fits in {litresToShelfTerms(allLitres)}. Most households find the space before they find the money.
                    </p>
                  )}
                </>
              );
            })()}

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="category-ticket">A small comfort</h3>
              <p className="mt-2 text-sm text-[var(--muted)] max-w-prose">
                This isn't for calories. A hot drink — or whatever yours is — costs next to nothing and makes a hard day easier. Included in every plan.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <li>
                  {COMFORT_TEA_NAME} — {formatCurrency(COMFORT_TEA_COST)}
                  {powerState === "out" && (
                    <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium bg-[#FCEBEB] text-[#791F1F]">
                      needs heat
                    </span>
                  )}
                </li>
              </ul>
              <p className="mt-2 text-sm text-[var(--brand)]">
                Coffee or hot chocolate work the same way, for about the same price.
              </p>
            </section>

            <div className="no-print flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScheduleMode((c) => !c)}
                className="rounded-full border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--muted)] shadow-sm transition hover:bg-[var(--accent)]"
              >
                {scheduleMode ? "Hide schedule" : "Spread this over several weeks"}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]"
              >
                🖨 Print this list
              </button>
            </div>

            {scheduleMode && schedule.weeks.length > 0 && (
              <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
                <h3 className="category-ticket">Weekly shopping schedule</h3>
                <p className="mt-2 text-sm text-[var(--muted)] max-w-prose">
                  Buy a little each week and you'll have this fully covered by week {schedule.totalWeeks} — no big shop required.
                </p>
                <div className="mt-4 space-y-4">
                  {schedule.weeks.map((week) => (
                    <div key={week.label}>
                      <p className="text-sm font-semibold text-[var(--brand-dark)]">{week.label}</p>
                      <ul className="mt-1 space-y-1 text-sm text-[var(--muted)]">
                        {week.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} ×{Math.round(item.qty)} — {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(item.cost)}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(week.cost)} — running total:{" "}
                        {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(week.runningTotal)}
                      </p>
                      {week.label !== `Week ${schedule.totalWeeks}` && <hr className="my-3 border-dashed border-[var(--border)]" />}
                    </div>
                  ))}
                  <p className="text-sm font-medium text-[var(--brand-dark)]">
                    Total: {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 }).format(schedule.totalCost + COMFORT_TEA_COST)}
                  </p>
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="category-ticket">Essentials and flavour</h3>
              <p className="mt-2 text-sm text-[var(--muted)] max-w-prose">Salt, coffee, spices, vinegar. Nearly zero calories, but they're what makes week three taste different from week one. Don't skip these.</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                {result.essentialsAndFlavour.map((item) => (
                  <li key={item.id}>• {item.name}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="category-ticket">Two things this list can't do</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <p><strong>It can't store water for you.</strong> Dried food is compact because the water isn't in the tin — it's in your tap. If the taps stopped too, you'd need about 3 litres per person per day before any of this list becomes dinner. Food first is fine; just know water is the other half.</p>
                It can't guess your kitchen. The storage figures are honest estimates, not measurements. Brands and packaging vary — treat every volume here as “roughly,” and check a shelf's weight before loading it entirely with tins.
              </div>
            </section>

            <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm print-card">
              <h3 className="category-ticket">You don't have to do this in one shop</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <p>Nobody buys a month of food in an afternoon. Add one category to your normal shop each week and you'll be fully covered inside two months, without ever feeling the cost. Print the list, stick it on the fridge, and cross things off as they come home.</p>
                <p>Then eat it. The best just-in-case pantry is one you cook from and replace — food that rotates never expires, and a shelf you use is a shelf you trust.</p>
                {tier === "season" && (
                  <p>A three-month larder only works if it moves. Cook from it, replace what you use, and it will never expire on you.</p>
                )}
              </div>
            </section>
          </section>
        </main>

        <section className="no-print mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
          <h3 className="heading-serif text-sm">About these numbers</h3>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Calorie figures come from standard UK nutrition data; prices are typical supermarket and Amazon prices, checked periodically rather than live. Prices and guidance were last checked in July 2026 —{" "}
            <a href="/changelog" className="underline hover:text-[var(--brand)]">
              see what changed
            </a>
            . Just In Case is built and maintained by one person in Scotland, not a content farm. Some links earn us a small commission at no cost to you — it's how the site stays free, and it never changes what we recommend.
          </p>
        </section>

        <footer className="no-print mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[var(--brand-dark)]">Just In Case — justincase.scot</p>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/contact">Contact</a>
            <a href="/why">Why this exists</a>
            <a href="/changelog">What's changed</a>
            <a href="/guides">Library</a>
            <a href="/affiliate-disclosure">Affiliate disclosure</a>
          </nav>
          <p className="mt-4 text-xs text-[var(--muted)]">Some links are affiliate links. We earn a small commission at no cost to you.</p>
        </footer>
      </div>
    </div>
  );
}
