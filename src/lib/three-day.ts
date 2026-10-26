import { buildCheapestPlan, edibleGrams, type DietaryFlags, type FoodItem } from "./planner";

// The three-day planner. Pure logic only: what each line needs for a
// household, what's still to get, and the plain-text shopping list. Nothing
// here is stored or sent anywhere.

export const THREE_DAYS = 3;
export const WATER_LITRES_PER_PERSON_PER_DAY = 3;

export type Household = { adults: number; children: number };

export const DEFAULT_HOUSEHOLD: Household = { adults: 2, children: 1 };

export type Unit = { one: string; many: string };

export type Line = {
  id: string;
  name: string;
  /** Shown under the name. */
  note?: string;
  optional?: boolean;
  /** Absent => a "Got it" tick line. */
  unit?: Unit;
  /** The amount this household needs, in `unit`. */
  amount?: number;
  /** The amount can be changed (blankets, food basket). */
  editable?: boolean;
};

export type Group = {
  id: string;
  heading: string;
  lines: Line[];
};

const LITRES: Unit = { one: "litre", many: "litres" };

export function people(h: Household): number {
  return h.adults + h.children;
}

export function plural(n: number, unit: Unit): string {
  return n === 1 ? unit.one : unit.many;
}

export function householdLabel(h: Household): string {
  const adults = `${h.adults} adult${h.adults === 1 ? "" : "s"}`;
  if (h.children === 0) return adults;
  return `${adults} and ${h.children} ${h.children === 1 ? "child" : "children"}`;
}

/** Every group except Food, whose lines come from the solver. */
export function fixedGroups(h: Household, blankets: number): { before: Group[]; after: Group[] } {
  const n = people(h);
  return {
    before: [
      {
        id: "water",
        heading: "Water",
        lines: [
          {
            id: "water-drink",
            name: "Water to drink",
            note: "3 litres each a day, for drinking.",
            unit: LITRES,
            amount: WATER_LITRES_PER_PERSON_PER_DAY * n * THREE_DAYS,
          },
          {
            id: "water-extra",
            name: "More for washing and cooking",
            note: "The 3 litres is for drinking only. You'll need more for washing and cooking, so store as much as you have room for.",
            optional: true,
          },
        ],
      },
    ],
    after: [
      {
        id: "kitchen",
        heading: "To open and eat it",
        lines: [
          {
            id: "tin-opener",
            name: "Tin opener",
            note: "A manual one, in case the power is off. Check it works.",
            unit: { one: "tin opener", many: "tin openers" },
            amount: 1,
          },
        ],
      },
      {
        id: "warmth",
        heading: "Warmth",
        lines: [
          {
            id: "blankets",
            name: "Blankets or sleeping bags",
            unit: { one: "blanket or sleeping bag", many: "blankets or sleeping bags" },
            amount: blankets,
            editable: true,
          },
          { id: "warm-clothing", name: "Warm clothing" },
        ],
      },
      {
        id: "light",
        heading: "Light and power",
        lines: [
          { id: "torch", name: "Torch", unit: { one: "torch", many: "torches" }, amount: 1 },
          {
            id: "batteries",
            name: "Spare batteries",
            unit: { one: "pack of batteries", many: "packs of batteries" },
            amount: 1,
          },
          {
            id: "power-bank",
            name: "Power bank (if you don't have one)",
            unit: { one: "power bank", many: "power banks" },
            amount: 1,
          },
        ],
      },
      {
        id: "news",
        heading: "News",
        lines: [
          { id: "radio", name: "Battery or wind-up FM radio", unit: { one: "radio", many: "radios" }, amount: 1 },
        ],
      },
      {
        id: "hygiene",
        heading: "Hygiene",
        lines: [
          { id: "sanitiser", name: "Hand sanitiser" },
          { id: "wet-wipes", name: "Wet wipes" },
          { id: "bathroom", name: "Bathroom products" },
        ],
      },
      {
        id: "first-aid",
        heading: "First aid",
        lines: [
          { id: "first-aid-kit", name: "First aid kit", unit: { one: "first aid kit", many: "first aid kits" }, amount: 1 },
        ],
      },
      {
        id: "pets",
        heading: "Pets (optional)",
        lines: [
          { id: "pet-food", name: "Pet food", optional: true },
          { id: "pet-water", name: "Bottled water for pets", optional: true },
        ],
      },
      {
        id: "comfort",
        heading: "Comfort (optional)",
        lines: [
          { id: "tea", name: "Tea bags", note: "Optional. A small comfort, if you can boil water.", optional: true },
        ],
      },
    ],
  };
}

export const TASKS: { id: string; text: string }[] = [
  { id: "charge", text: "Charge your power bank" },
  { id: "cash", text: "Keep some cash at home, in coins and notes, as well as your cards" },
  {
    id: "documents",
    text: "Print copies of ID, insurance details and instructions for any medical equipment; keep them in a waterproof bag",
  },
  {
    id: "write-down",
    text: "Write down emergency contacts, your regular medicines and doses, and your radio's news station frequencies",
  },
  { id: "105", text: "Write down 105, the power cut number in Scotland, England and Wales" },
  { id: "prescriptions", text: "Order repeat prescriptions at least 5 working days before you need them" },
  { id: "utilities", text: "Learn how to turn off your gas, electricity and water" },
  { id: "check", text: "Check your torch and radio work" },
];

// ── Food basket ──────────────────────────────────────────────────────────────

// Milk is left out for now (no small long-life cartons in the data yet).
const BASKET_EXCLUDED_IDS = new Set(["uht-milk", "powdered-milk"]);

/** Strict no-cook pool for the three-day basket: no heat, no fridge, no oils or fats. */
export function noCookPool(foods: FoodItem[]): FoodItem[] {
  return foods.filter(
    (f) => f.prep === "no-cook" && f.category !== "fat" && !BASKET_EXCLUDED_IDS.has(f.id),
  );
}

export function caloriesPerPack(item: FoodItem): number {
  return item.cal_per_100g == null ? 0 : (item.cal_per_100g / 100) * edibleGrams(item);
}

export function packSize(item: FoodItem): string {
  return item.typical_unit_g >= 1000 ? `${item.typical_unit_g / 1000}kg` : `${item.typical_unit_g}g`;
}

export function foodUnit(item: FoodItem): Unit {
  if (item.id.startsWith("tinned-")) return { one: "tin", many: "tins" };
  if (item.id === "peanut-butter" || item.id === "honey") return { one: "jar", many: "jars" };
  return { one: "pack", many: "packs" };
}

// Variety rules for the three-day basket: at most 3 of any one food (more
// only if needed to reach three days), and at
// least one tinned fish or meat, one tinned vegetable or fruit, and one dried
// fruit (where the diet allows).
const BASKET_MAX_PER_FOOD = 3;
const BASKET_MUST_INCLUDE = [
  ["tinned-tuna", "tinned-sardines", "tinned-mackerel", "tinned-salmon"],
  ["tinned-tomatoes", "tinned-sweetcorn", "tinned-peas", "tinned-fruit"],
  ["dried-apricots", "raisins", "dried-mango"],
];

export type Basket = {
  dailyCaloriesNeeded: number;
  lines: { item: FoodItem; quantity: number }[];
};

/** The solver's cheapest-possible basket, power-out, for exactly three days. */
export function exampleBasket(h: Household, foods: FoodItem[], dietaryFlags: DietaryFlags): Basket {
  const plan = (maxUnitsPerItem: number) =>
    buildCheapestPlan(
      { adults: h.adults, children: h.children, weeks: THREE_DAYS / 7, dietaryFlags, powerOut: true },
      noCookPool(foods),
      {
        skipCategoryMinimums: true,
        allowPartialWeek: true,
        maxUnitsPerItem,
        mustInclude: BASKET_MUST_INCLUDE,
      },
    );
  let result = plan(BASKET_MAX_PER_FOOD);
  // If 3 per food can't reach three days (larger households, or a diet
  // that narrows the choice), raise the limit one step at a time, only as
  // far as it takes.
  for (let cap = BASKET_MAX_PER_FOOD + 1; result.totalCaloriesPlanned < result.totalCaloriesNeeded && cap <= 99; cap++) {
    result = plan(cap);
  }
  return {
    dailyCaloriesNeeded: result.dailyCaloriesNeeded,
    lines: result.ranked.map((r) => ({ item: r.item, quantity: r.quantity })),
  };
}

/** What the basket actually covers. Rounding down to whole days used to turn
 *  2.93 days into "2", which overstated the shortfall; rounding up would have
 *  presented a short basket as a finished three days. So three days or more
 *  reads as three, and anything short keeps a decimal and is named as short. */
export function basketCoverage(
  lines: { item: FoodItem; quantity: number }[],
  dailyCaloriesNeeded: number,
): { days: number; label: string; short: boolean } {
  const cals = lines.reduce((sum, l) => sum + caloriesPerPack(l.item) * l.quantity, 0);
  const days = cals / Math.max(1, dailyCaloriesNeeded);
  if (days >= THREE_DAYS) return { days, label: String(THREE_DAYS), short: false };
  return { days, label: (Math.floor(days * 10) / 10).toFixed(1), short: true };
}

// ── What's left ──────────────────────────────────────────────────────────────

export type Entries = {
  /** "I have" amounts, by line id. */
  have: Record<string, number>;
  /** "Got it" ticks, by line id. */
  got: Record<string, boolean>;
};

export function remaining(line: Line, entries: Entries): number {
  if (line.amount == null) return entries.got[line.id] ? 0 : 1;
  return Math.max(0, line.amount - (entries.have[line.id] ?? 0));
}

/** Name as shown on the shopping list: optional lines say so. */
export function listName(line: Line): string {
  return line.optional && !line.name.includes("(optional)") ? `${line.name} (optional)` : line.name;
}

export function amountLeftText(line: Line, left: number): string | null {
  if (!line.unit) return null;
  return `${left} ${plural(left, line.unit)} still to get`;
}

export function shoppingListHeading(count: number): string {
  return `Your shopping list: ${count} item${count === 1 ? "" : "s"}`;
}

export const SHOPPING_LIST_NOTE = "Build up a little at a time. No need to buy it all at once.";
export const TASKS_HEADING = "Things to do before you need them";

/** Plain text for Share and Save: the list and the tasks, nothing else. */
export function shoppingListText(
  toGet: { line: Line; left: number }[],
  tasksLeft: { text: string }[],
): string {
  const out = [shoppingListHeading(toGet.length), SHOPPING_LIST_NOTE, ""];
  for (const { line, left } of toGet) {
    const amount = amountLeftText(line, left);
    out.push(`- ${listName(line)}${amount ? `: ${amount}` : ""}`);
  }
  if (tasksLeft.length > 0) {
    out.push("", TASKS_HEADING, "");
    for (const t of tasksLeft) out.push(`- ${t.text}`);
  }
  out.push("", "justincase.scot/planner");
  return out.join("\n");
}
