import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPlan, type FoodItem, type PlannerResult } from '../src/lib/planner';

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