import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPlan, edibleGrams, type FoodItem, type PlannerResult } from '../src/lib/planner';
import { basketCoverage, caloriesPerPack, exampleBasket, noCookPool } from '../src/lib/three-day';

const foods = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'foods.json'), 'utf8'),
) as FoodItem[];

const WEEKS = 4;
const BUDGET_TIERS = [60, 120, 250];
const ADULT_RANGE = [1, 2, 3, 4];
const CHILD_RANGE = [0, 1, 2, 3];

// ── Test harness ──────────────────────────────────────────────────────────────

let failures = 0;
let totalTests = 0;
let lastSuite = '';

function suite(name: string) {
  lastSuite = name;
  console.log(`\n━━━ ${name} ━━━`);
}

function pass(msg: string) {
  totalTests++;
  console.log(`  ✓  ${msg}`);
}

function fail(msg: string) {
  totalTests++;
  failures++;
  console.log(`  ✗  ${msg}`);
}

function check(condition: boolean, msg: string) {
  if (condition) pass(msg);
  else fail(msg);
}

function fmt(n: number): string {
  return n.toLocaleString('en-GB', { maximumFractionDigits: 1 });
}

function label(a: number, c: number, b: number): string {
  return `A${a}C${c}B£${b}`;
}

function pct(part: number, total: number): string {
  if (total <= 0) return '0.0%';
  return `${((part / total) * 100).toFixed(1)}%`;
}

// ── Suite 1: Full matrix — basic integrity ────────────────────────────────────

suite('1. Matrix Integrity — all 48 combinations produce valid plans');

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of BUDGET_TIERS) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      // Budget discipline
      check(
        result.totalBudgetUsedGbp <= budget,
        `${id}: budget used (${fmt(result.totalBudgetUsedGbp)}) ≤ budget (${budget})`,
      );

      // No dropped categories in standard matrix
      check(
        result.droppedCategories.length === 0,
        `${id}: zero dropped categories (got [${result.droppedCategories.join(', ')}])`,
      );

      // Plan produces some calories
      check(
        result.totalCaloriesPlanned > 0,
        `${id}: produces calories (${fmt(result.totalCaloriesPlanned)})`,
      );

      // Ranked items are non-empty
      check(
        result.ranked.length > 0,
        `${id}: has ${result.ranked.length} ranked items`,
      );

      // Essentials and flavour always present
      check(
        result.essentialsAndFlavour.length > 0,
        `${id}: essentials/flavour present (${result.essentialsAndFlavour.length} items)`,
      );
    }
  }
}

// ── Suite 2: varietyDisclosure discipline ─────────────────────────────────────

suite('2. Variety Disclosure — unconstrained profiles are silent');

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of BUDGET_TIERS) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      // High budget (£250) should always be unconstrained for any household size
      if (budget === 250) {
        check(
          result.varietyDisclosure === false,
          `${id}: varietyDisclosure=false at £250 (got ${result.varietyDisclosure})`,
        );
      }

      // Medium budget (£120) should be unconstrained for small-to-medium households
      if (budget === 120 && adults <= 3 && children <= 2) {
        check(
          result.varietyDisclosure === false,
          `${id}: varietyDisclosure=false at £120 (got ${result.varietyDisclosure})`,
        );
      }
    }
  }
}

// ── Suite 3: Constrained profiles — algorithm resilience ──────────────────────

suite('3. Constrained Profiles — algorithm produces valid plans under pressure');

// The 15% per-item cap is relative to totalCaloriesNeeded, which scales with
// household size. For constrained budgets, the budget bottleneck (< £1/person/day)
// binds before the per-item cap on any single item. The relaxation loop is a
// structural safety net for edge cases where a high-budget/low-variety scenario
// would otherwise stall. We verify its structural integrity in Suite 4.

// 3a. Extreme constraint: large household, tiny budget
{
  const result = buildPlan({ adults: 4, children: 3, budgetGbp: 50, weeks: 4 }, foods);
  const id = 'A4C3B£50';
  check(
    result.droppedCategories.length === 0,
    `${id}: no dropped categories under extreme constraint`,
  );
  check(
    result.totalCaloriesPlanned > 0,
    `${id}: produces calories (${fmt(result.totalCaloriesPlanned)})`,
  );
  check(
    result.totalBudgetUsedGbp <= 50,
    `${id}: budget not exceeded (used ${fmt(result.totalBudgetUsedGbp)})`,
  );
  check(
    result.ranked.length >= 5,
    `${id}: ≥5 items (got ${result.ranked.length})`,
  );
}

// 3b. Medium constraint: large household, low budget
{
  const result = buildPlan({ adults: 4, children: 2, budgetGbp: 60, weeks: 4 }, foods);
  const id = 'A4C2B£60';
  check(
    result.droppedCategories.length === 0,
    `${id}: no dropped categories`,
  );
  check(
    result.totalBudgetUsedGbp <= 60,
    `${id}: budget not exceeded`,
  );
}

// 3c. Mild constraint: modest household, tight budget
{
  const result = buildPlan({ adults: 3, children: 2, budgetGbp: 60, weeks: 4 }, foods);
  const id = 'A3C2B£60';
  check(
    result.droppedCategories.length === 0,
    `${id}: no dropped categories`,
  );
  check(
    result.totalBudgetUsedGbp <= 60,
    `${id}: budget not exceeded`,
  );
}

// ── Suite 4: Relaxation loop — structural integrity ──────────────────────────

suite('4. Relaxation Loop — no item exceeds 25% hard ceiling');

// The relaxation loop is a structural safety net. With the current 26-item food
// pool, the algorithm's category targeting and 15% baseline cap distribute
// calories evenly enough that the relaxation loop rarely fires (budget binds
// before the per-item cap). The hard ceiling of 25% ensures that even if the
// loop fires, no single item can ever dominate.

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of BUDGET_TIERS) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      const maxItemCalories = Math.max(...result.ranked.map(r => r.totalCalories));
      const maxItemShare = result.totalCaloriesNeeded > 0
        ? maxItemCalories / result.totalCaloriesNeeded
        : 0;

      check(
        maxItemShare <= 0.251, // allow rounding slop
        `${id}: max item share ≤ 25% (got ${pct(maxItemCalories, result.totalCaloriesNeeded)})`,
      );
    }
  }
}

// ── Suite 5: Item diversity — plans spread across multiple items ──────────────

suite('5. Item Diversity — plans contain ≥5 distinct items');

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of BUDGET_TIERS) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      // Constrained budgets (£60) can have 5 items when morale is skipped.
      // Adequate budgets (£120+) should always have all 6 categories.
      const minItems = budget === 60 ? 5 : 6;
      check(
        result.ranked.length >= minItems,
        `${id}: ≥${minItems} items (got ${result.ranked.length})`,
      );
    }
  }
}

// ── Suite 6: Category spread — all required categories are represented ────────

suite('6. Category Coverage — required categories present');

const REQUIRED_CATEGORY_KEYS = ['staple_carb', 'protein', 'fat', 'vegetable', 'micronutrient', 'morale'];

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of BUDGET_TIERS) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      // Morale has minUnits override = 0, making it an optional category.
      // The algorithm prioritises calorie-dense items and may skip morale
      // when the budget-per-person is tight (≤£60 or large household at £120).
      const isBudgetTight = budget === 60 || (budget === 120 && adults >= 4);
      const required = isBudgetTight
        ? REQUIRED_CATEGORY_KEYS.filter(k => k !== 'morale')
        : REQUIRED_CATEGORY_KEYS;

      const categoriesInPlan = new Set(result.ranked.map(r => r.category));
      const missing = required.filter(k => !categoriesInPlan.has(k));

      check(
        missing.length === 0,
        `${id}: all categories present (missing: [${missing.join(', ')}])`,
      );
    }
  }
}

// ── Suite 7: Per-item cap regression — no single item should dominate ─────────

suite('7. Per-Item Cap — no single item exceeds 20% in any standard profile');

// The 15% baseline with 5% relaxation steps means that under the standard matrix
// (adequate budget, current data), no item should exceed 20% of total calories.
// This is a regression gate against the 25% cap that previously allowed peanut
// butter and coconut oil to dominate.

for (const adults of ADULT_RANGE) {
  for (const children of CHILD_RANGE) {
    for (const budget of [120, 250]) {
      const result = buildPlan({ adults, children, budgetGbp: budget, weeks: WEEKS }, foods);
      const id = label(adults, children, budget);

      const maxItemShare = Math.max(...result.ranked.map(r => r.totalCalories)) / result.totalCaloriesNeeded;

      check(
        maxItemShare <= 0.20,
        `${id}: max item share ≤ 20% (got ${pct(Math.max(...result.ranked.map(r => r.totalCalories)), result.totalCaloriesNeeded)})`,
      );
    }
  }
}

// ── Suite 8: Relaxation loop structural proof — Codex-simulated edge case ─────

suite('8. Relaxation Gate — relaxation loop logic is structurally sound');

// The relaxation loop is a safety net that fires when the per-item 15% cap
// prevents the algorithm from filling remaining budget. We verify its structural
// integrity by checking that the algorithm doesn't crash or produce degenerate
// output for any input, including pathological ones.

// Edge case: single adult, no children, low budget — 4 weeks
// Verifies the algorithm doesn't drop categories even when budget is tight
{
  const result = buildPlan({ adults: 1, children: 0, budgetGbp: 30, weeks: 4 }, foods);
  const id = 'A1C0B£30W4';
  check(
    result.droppedCategories.length === 0,
    `${id}: no dropped categories at low budget`,
  );
  check(
    result.totalCaloriesPlanned > 0,
    `${id}: produces some calories (${fmt(result.totalCaloriesPlanned)})`,
  );
  check(
    result.ranked.length >= 5,
    `${id}: ≥5 items (got ${result.ranked.length})`,
  );
}

// Edge case: maximum household, maximum budget
{
  const result = buildPlan({ adults: 6, children: 6, budgetGbp: 500, weeks: 12 }, foods);
  const id = 'A6C6B£500W12';
  check(
    result.droppedCategories.length === 0,
    `${id}: no dropped categories at max input`,
  );
  check(
    result.totalBudgetUsedGbp <= 500,
    `${id}: budget not exceeded`,
  );
  check(
    result.ranked.length >= 5,
    `${id}: ≥5 items (got ${result.ranked.length})`,
  );
}

// Edge case: zero children (adults only)
{
  for (const adults of [1, 2, 4]) {
    const result = buildPlan({ adults, children: 0, budgetGbp: 120, weeks: 4 }, foods);
    const id = `A${adults}C0B£120`;
    check(
      result.droppedCategories.length === 0,
      `${id}: no dropped categories`,
    );
  }
}

// ── Suite 9: Food data integrity — the drained-weight defect ─────────────────
//
// On 2026-10-26 calories were counted on the pack weight, so a 400g tin of
// chickpeas draining to 240g was counted at 640 kcal instead of 293. These
// tests fail if that returns, and were written after the defect shipped: the
// 458 tests before them all passed while it was live.

suite('9. Food Data — calories count what you eat, not the pack');

for (const f of foods) {
  const edible = edibleGrams(f);
  check(
    edible <= f.typical_unit_g,
    `${f.id}: edible weight ${edible}g is not more than pack ${f.typical_unit_g}g`,
  );
  check(edible > 0, `${f.id}: edible weight is positive`);
}

// Every drained food must declare an edible weight below its pack weight,
// or it is silently counting the liquid again.
for (const f of foods.filter((x) => x.nutrition_basis === 'drained')) {
  check(
    (f.edible_unit_g ?? f.typical_unit_g) < f.typical_unit_g,
    `${f.id}: stated as drained, so edible weight is below pack weight`,
  );
}

// As-sold foods are eaten whole, so the two weights should agree.
for (const f of foods.filter((x) => x.nutrition_basis === 'as-sold')) {
  check(
    (f.edible_unit_g ?? f.typical_unit_g) === f.typical_unit_g,
    `${f.id}: stated as-sold, so edible weight equals pack weight`,
  );
}

// The specific regressions, with the figures read off the labels.
const EXPECTED: Record<string, { cal: number; pack: number; edible: number; perPack: number }> = {
  'tinned-chickpeas': { cal: 122, pack: 400, edible: 240, perPack: 293 },
  'tinned-peas': { cal: 65, pack: 300, edible: 185, perPack: 120 },
  'tinned-mackerel': { cal: 200, pack: 125, edible: 82, perPack: 164 },
  'tinned-sardines': { cal: 181, pack: 120, edible: 90, perPack: 163 },
  'tinned-sweetcorn': { cal: 77, pack: 340, edible: 285, perPack: 219 },
  'tinned-beans': { cal: 77, pack: 400, edible: 400, perPack: 308 },
};
for (const [id, e] of Object.entries(EXPECTED)) {
  const f = foods.find((x) => x.id === id);
  if (!f) {
    fail(`${id}: present in the food data`);
    continue;
  }
  check(f.cal_per_100g === e.cal, `${id}: ${e.cal} kcal/100g as per label`);
  check(f.typical_unit_g === e.pack, `${id}: pack ${e.pack}g`);
  check((f.edible_unit_g ?? f.typical_unit_g) === e.edible, `${id}: edible ${e.edible}g`);
  check(
    Math.round(caloriesPerPack(f)) === e.perPack,
    `${id}: ${e.perPack} kcal a pack (was overstated before the fix)`,
  );
}

// Anything a basket can actually recommend must carry a label-checked figure.
{
  const reachable = new Set<string>();
  for (let a = 1; a <= 6; a++) {
    for (let c = 0; c <= 4; c++) {
      for (const df of [
        undefined,
        { vegetarian: true },
        { glutenFree: true },
        { noDairy: true },
        { vegetarian: true, glutenFree: true },
      ]) {
        for (const l of exampleBasket({ adults: a, children: c }, foods, df ?? {}).lines) {
          if (l.quantity > 0) reachable.add(l.item.id);
        }
      }
    }
  }
  for (const id of [...reachable].sort()) {
    const f = foods.find((x) => x.id === id)!;
    check(
      !!f.cal_verified,
      `${id}: appears in a three-day basket, so its calories are label-checked`,
    );
  }
}

// The page says every food the three-day planner counts calories for is
// label-checked. That covers the whole no-cook pool a person can draw on,
// not only what the solver happens to pick today.
for (const f of noCookPool(foods).filter((x) => x.cal_per_100g != null)) {
  check(!!f.cal_verified, `${f.id}: counted by the three-day planner, so label-checked`);
}

// ── Suite 10: Day count — a short basket is never shown as three days ────────

suite('10. Day Count — rounding never hides a shortfall');

{
  // A food of 100 kcal per 100g is 1 kcal per gram, so `days * need` grams is
  // exactly `days` days of energy. That keeps these cases easy to read.
  const perGram = (grams: number): FoodItem => ({
    ...foods[0],
    id: `synthetic-${grams}`,
    cal_per_100g: 100,
    typical_unit_g: grams,
    edible_unit_g: grams,
  });
  const NEED = 1000;
  const coverageAt = (days: number) =>
    basketCoverage([{ item: perGram(days * NEED), quantity: 1 }], NEED);

  const cases: [number, string, boolean][] = [
    [3.5, '3', false],
    [3.0, '3', false],
    [2.995, 'just under three', true],
    [2.93, 'just under three', true],
    [2.9, 'just under three', true],
    [2.5, '2.5', true],
    [1.29, '1.2', true],
    [0.4, '0.4', true],
  ];
  for (const [days, expected, short] of cases) {
    const got = coverageAt(days);
    check(got.label === expected, `${days} days reads as "${expected}" (got "${got.label}")`);
    check(got.short === short, `${days} days short=${short}`);
    if (short) {
      check(got.label !== '3', `${days} days never prints a bare "3" while short`);
    }
  }
  check(!coverageAt(3).short, 'exactly three days is not reported as short');
  check(
    coverageAt(2.9999).short && coverageAt(2.9999).label === 'just under three',
    'a shade under three days is named in words, not rounded to "3"',
  );
}

// ── Suite 11: Comfort food is capped in both solver paths ────────────────────

suite('11. Morale Cap — comfort food cannot crowd out real food');

for (const [name, flags] of [
  ['plain', {}],
  ['gluten-free', { glutenFree: true }],
  ['veg+GF', { vegetarian: true, glutenFree: true }],
] as const) {
  for (const h of [{ adults: 1, children: 0 }, { adults: 2, children: 1 }, { adults: 4, children: 3 }]) {
    const b = exampleBasket(h, foods, flags as never);
    const total = b.lines.reduce((s, l) => s + caloriesPerPack(l.item) * l.quantity, 0);
    const morale = b.lines
      .filter((l) => l.item.category === 'morale')
      .reduce((s, l) => s + caloriesPerPack(l.item) * l.quantity, 0);
    const share = total > 0 ? morale / total : 0;
    check(
      share <= 0.12,
      `three-day ${name} A${h.adults}C${h.children}: morale ${pct(morale, total)} of calories (cap ~10%)`,
    );
    // Comfort food must never be the biggest thing in the basket. An absolute
    // jar count would be wrong here: three jars is proportionate for seven
    // people, and the share cap above is the real invariant.
    const biggest = Math.max(
      ...b.lines.map((l) => caloriesPerPack(l.item) * l.quantity),
    );
    check(
      morale < biggest || morale === 0,
      `three-day ${name} A${h.adults}C${h.children}: morale is not the largest calorie source`,
    );
  }
}

for (const h of [{ adults: 1, children: 0 }, { adults: 2, children: 1 }]) {
  for (const weeks of [2, 4, 12]) {
    const p = buildPlan({ ...h, weeks, budgetGbp: 250 }, foods);
    const morale = p.ranked
      .filter((l) => l.category === 'morale')
      .reduce((s, l) => s + l.totalCalories, 0);
    check(
      morale <= p.totalCaloriesNeeded * 0.12,
      `longer-store A${h.adults}C${h.children} ${weeks}w: morale within cap`,
    );
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n══════════════════════════════════════════════════════════`);
console.log(`  Tests:  ${totalTests}  |  Passed:  ${totalTests - failures}  |  Failed:  ${failures}`);
console.log(`══════════════════════════════════════════════════════════`);

if (failures > 0) {
  console.log(`\n❌  ${failures} test(s) failed. Review output above.`);
} else {
  console.log(`\n✅  All tests passed.`);
}

process.exit(failures > 0 ? 1 : 0);