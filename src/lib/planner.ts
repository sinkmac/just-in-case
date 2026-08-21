export type DietaryFlags = {
  vegetarian?: boolean;
  glutenFree?: boolean;
  noDairy?: boolean;
};

export type HouseholdInput = {
  adults: number;
  children: number;
  budgetGbp: number;
  weeks: number;
  dietaryFlags?: DietaryFlags;
  childCalorieRatio?: number;
  /** Scenario Mode: when the power's out, prefer no-cook protein so a plan
   *  stays edible without heat. Absent/false => pure cost-per-calorie ranking. */
  powerOut?: boolean;
};

export type FoodItem = {
  id: string;
  name: string;
  cal_per_100g: number | null;
  typical_unit_g: number;
  typical_unit_price_gbp: number;
  shelf_life_months: number;
  storage_litres_per_unit: number;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
  amazon_asin: string;
  category: string;
  region: string;
  prep: "no-cook" | "needs-heat";
  noCookReady?: boolean;
  notes?: string;
  priceNote?: string;
};

export type RankedItem = {
  item: FoodItem;
  quantity: number;
  caloriesPerUnit: number | null;
  score: number | null;
  estimatedCostGbp: number;
  totalCalories: number;
  totalStorageLitres: number;
  category: string;
};

export type PlannerResult = {
  dailyCaloriesNeeded: number;
  totalCaloriesNeeded: number;
  totalCaloriesPlanned: number;
  totalBudgetUsedGbp: number;
  remainingBudgetGbp: number;
  ranked: RankedItem[];
  essentialsAndFlavour: FoodItem[];
  droppedCategories: string[];
  varietyDisclosure: boolean;
};

const REQUIRED_CATEGORIES = [
  'staple_carb',
  'protein',
  'fat',
  'vegetable',
  'morale',
  'micronutrient',
] as const;

const CATEGORY_MIN_UNITS: Record<string, number> = {
  staple_carb: 3,
  protein: 2,
  fat: 1,
  vegetable: 2,
  morale: 1,
  micronutrient: 1,
};

const CATEGORY_TARGET_BANDS: Record<string, { min: number; max: number }> = {
  staple_carb: { min: 0.35, max: 0.45 },
  protein: { min: 0.2, max: 0.3 },
  fat: { min: 0.15, max: 0.25 },
  vegetable: { min: 0.05, max: 0.1 },
  morale: { min: 0, max: 0.05 },
  micronutrient: { min: 0, max: 0.05 },
};

const CATEGORY_MAX_UNITS: Record<string, number> = {
  morale: 3,
};

const CATEGORY_MIN_UNITS_OVERRIDE: Record<string, number> = {
  morale: 0,
};

const CATEGORY_MAX_BUDGET_SHARE: Record<string, number> = {
  morale: 0.05,
};

// Scenario Mode power-out: how much to favour no-cook protein in the ranking.
// A multiplier on score (which already encodes calories-per-pound and
// storage). Applied ONLY when powerOut is true; absent/false => 1.0 => the
// ranking is byte-identical to the pure cost-per-calorie baseline.
const NO_COOK_PROTEIN_POWER_OUT_BOOST = 1.6;

function isNoCookProtein(item: FoodItem): boolean {
  return item.category === "protein" && item.prep === "no-cook";
}

function caloriesPerUnit(item: FoodItem): number | null {
  if (item.cal_per_100g == null) return null;
  return (item.cal_per_100g / 100) * item.typical_unit_g;
}

function scoreItem(item: FoodItem, powerOut = false): number | null {
  const cals = caloriesPerUnit(item);
  if (cals == null || item.typical_unit_price_gbp <= 0 || item.storage_litres_per_unit <= 0) {
    return null;
  }
  const caloriesPerPound = cals / item.typical_unit_price_gbp;
  let score = caloriesPerPound * (1 / item.storage_litres_per_unit);
  if (powerOut && isNoCookProtein(item)) {
    score *= NO_COOK_PROTEIN_POWER_OUT_BOOST;
  }
  return score;
}

function passesDietaryFlags(item: FoodItem, flags: DietaryFlags): boolean {
  if (flags.vegetarian && !item.vegetarian) return false;
  if (flags.glutenFree && !item.gluten_free) return false;
  if (flags.noDairy && !item.dairy_free) return false;
  return true;
}

function rankWithinCategory(items: FoodItem[], powerOut = false): FoodItem[] {
  return [...items].sort((a, b) => (scoreItem(b, powerOut) ?? -1) - (scoreItem(a, powerOut) ?? -1));
}

function getCategoryBudget(lines: Map<string, RankedItem>, category: string): number {
  return Array.from(lines.values())
    .filter((line) => line.category === category)
    .reduce((sum, line) => sum + line.estimatedCostGbp, 0);
}

function getCategoryQuantity(lines: Map<string, RankedItem>, category: string): number {
  return Array.from(lines.values())
    .filter((line) => line.category === category)
    .reduce((sum, line) => sum + line.quantity, 0);
}

function canAddUnitWithinCaps(lines: Map<string, RankedItem>, item: FoodItem, budgetGbp: number): boolean {
  const maxUnits = CATEGORY_MAX_UNITS[item.category];
  if (maxUnits != null && getCategoryQuantity(lines, item.category) + 1 > maxUnits) return false;

  const maxBudgetShare = CATEGORY_MAX_BUDGET_SHARE[item.category];
  if (maxBudgetShare != null) {
    const projectedBudget = getCategoryBudget(lines, item.category) + item.typical_unit_price_gbp;
    if (projectedBudget > budgetGbp * maxBudgetShare) return false;
  }

  return true;
}

function addUnit(lines: Map<string, RankedItem>, item: FoodItem, powerOut = false) {
  const current = lines.get(item.id);
  const unitCalories = caloriesPerUnit(item) ?? 0;
  const unitCost = item.typical_unit_price_gbp;
  const unitLitres = item.storage_litres_per_unit;
  const base: RankedItem = current ?? {
    item,
    quantity: 0,
    caloriesPerUnit: caloriesPerUnit(item),
    score: scoreItem(item, powerOut),
    estimatedCostGbp: 0,
    totalCalories: 0,
    totalStorageLitres: 0,
    category: item.category,
  };
  base.quantity += 1;
  base.estimatedCostGbp += unitCost;
  base.totalCalories += unitCalories;
  base.totalStorageLitres += unitLitres;
  lines.set(item.id, base);
}

export function buildPlan(input: HouseholdInput, foods: FoodItem[]): PlannerResult {
  const adults = Math.max(0, input.adults);
  const children = Math.max(0, input.children);
  const weeks = Math.max(1, input.weeks);
  const budgetGbp = Math.max(0, input.budgetGbp);
  const dietaryFlags = input.dietaryFlags ?? {};
  const powerOut = input.powerOut === true;

  const childRatio = input.childCalorieRatio ?? 0.6;
  const dailyCaloriesNeeded = Math.round((adults + children * childRatio) * 2000);
  const totalCaloriesNeeded = dailyCaloriesNeeded * (weeks * 7);
  const BASELINE_MAX_CALORIES_PER_ITEM = totalCaloriesNeeded * 0.15;

  const eligible = foods.filter((item) => passesDietaryFlags(item, dietaryFlags));
  const rankedLines = new Map<string, RankedItem>();
  const droppedCategories: string[] = [];
  let remainingBudget = budgetGbp;

  const requiredQueue = [...REQUIRED_CATEGORIES];
  while (requiredQueue.length) {
    const category = requiredQueue[0];
    const candidates = rankWithinCategory(
      eligible.filter((item) => item.category === category && scoreItem(item, powerOut) != null),
      powerOut,
    );
    // Prefer items that don't exceed the 15% baseline cap in the first pass.
    // If every item in the category exceeds the cap, fall back to the best scorer.
    const pick = candidates.find(item => {
      const existing = rankedLines.get(item.id);
      const existingCalories = existing?.totalCalories ?? 0;
      const nextUnitCalories = caloriesPerUnit(item) ?? 0;
      return existingCalories + nextUnitCalories <= BASELINE_MAX_CALORIES_PER_ITEM;
    }) ?? candidates[0];
    const minUnits = CATEGORY_MIN_UNITS_OVERRIDE[category] ?? CATEGORY_MIN_UNITS[category] ?? 1;
    if (!pick) {
      droppedCategories.push(category);
      requiredQueue.shift();
      continue;
    }

    let allocated = 0;
    while (
      allocated < minUnits &&
      remainingBudget >= pick.typical_unit_price_gbp &&
      canAddUnitWithinCaps(rankedLines, pick, budgetGbp)
    ) {
      addUnit(rankedLines, pick, powerOut);
      remainingBudget -= pick.typical_unit_price_gbp;
      allocated += 1;
    }

    if (allocated < minUnits) {
      droppedCategories.push(category);
    }

    requiredQueue.shift();
  }

  const scoreRanked = rankWithinCategory(
    eligible.filter((item) => !['flavour'].includes(item.category) && scoreItem(item, powerOut) != null),
    powerOut,
  );

  let caloriesPlanned = Array.from(rankedLines.values()).reduce((sum, line) => sum + line.totalCalories, 0);
  const MAX_CAP = totalCaloriesNeeded * 0.25;
  let maxCaloriesPerItem = BASELINE_MAX_CALORIES_PER_ITEM;
  const maxMoraleCalories = totalCaloriesNeeded * 0.1;
  const maxCategoryCalories = totalCaloriesNeeded * 0.4;

  while (remainingBudget > 0) {
    const categoryCaloriesMap = Array.from(rankedLines.values()).reduce((map, line) => {
      map.set(line.category, (map.get(line.category) ?? 0) + line.totalCalories);
      return map;
    }, new Map<string, number>());

    const preferredCategories = Object.entries(CATEGORY_TARGET_BANDS)
      .filter(([category, band]) => {
        const currentShare = ((categoryCaloriesMap.get(category) ?? 0) / Math.max(1, caloriesPlanned));
        return currentShare < band.min;
      })
      .map(([category]) => category);

    const candidatePool = (preferredCategories.length
      ? scoreRanked.filter((item) => preferredCategories.includes(item.category))
      : scoreRanked
    );

    const next = candidatePool.find((item) => {
      if (item.typical_unit_price_gbp > remainingBudget) return false;
      if (!canAddUnitWithinCaps(rankedLines, item, budgetGbp)) return false;
      const existing = rankedLines.get(item.id);
      const existingCalories = existing?.totalCalories ?? 0;
      const nextUnitCalories = caloriesPerUnit(item) ?? 0;
      if (existingCalories + nextUnitCalories > maxCaloriesPerItem) return false;

      const categoryCalories = categoryCaloriesMap.get(item.category) ?? 0;
      if (categoryCalories + nextUnitCalories > maxCategoryCalories) return false;

      if (item.category === 'morale' && categoryCalories + nextUnitCalories > maxMoraleCalories) {
        return false;
      }

      const band = CATEGORY_TARGET_BANDS[item.category];
      if (band) {
        const projectedShare = (categoryCalories + nextUnitCalories) / totalCaloriesNeeded;
        if (projectedShare > band.max) return false;
      }

      return true;
    });
    if (!next) {
      // Progressive relaxation: if stuck at 15%, scale up in 5% increments
      const newCap = Number((maxCaloriesPerItem + totalCaloriesNeeded * 0.05).toFixed(0));
      if (newCap <= MAX_CAP && caloriesPlanned < totalCaloriesNeeded) {
        maxCaloriesPerItem = newCap;
        continue;
      }
      break;
    }
    addUnit(rankedLines, next, powerOut);
    remainingBudget -= next.typical_unit_price_gbp;
    caloriesPlanned += caloriesPerUnit(next) ?? 0;
    if (caloriesPlanned >= totalCaloriesNeeded) break;
  }

  const essentialsAndFlavour = eligible.filter(
    (item) => item.category === 'flavour' || item.cal_per_100g == null,
  );

  const ranked = Array.from(rankedLines.values()).sort((a, b) => {
    if (a.category === b.category) return (b.score ?? -1) - (a.score ?? -1);
    return a.category.localeCompare(b.category);
  });

  const totalBudgetUsedGbp = ranked.reduce((sum, line) => sum + line.estimatedCostGbp, 0);
  const totalCaloriesPlanned = ranked.reduce((sum, line) => sum + line.totalCalories, 0);
  const varietyDisclosure = ranked.some(line => line.totalCalories > totalCaloriesNeeded * 0.15);

  return {
    dailyCaloriesNeeded,
    totalCaloriesNeeded,
    totalCaloriesPlanned,
    totalBudgetUsedGbp: Number(totalBudgetUsedGbp.toFixed(2)),
    remainingBudgetGbp: Number(Math.max(0, remainingBudget).toFixed(2)),
    ranked,
    essentialsAndFlavour,
    droppedCategories,
    varietyDisclosure,
  };
}

export type CheapestPlanResult = {
  dailyCaloriesNeeded: number;
  totalCaloriesNeeded: number;
  totalCaloriesPlanned: number;
  totalCostGbp: number;
  ranked: RankedItem[];
  essentialsAndFlavour: FoodItem[];
  droppedCategories: string[];
};

export function buildCheapestPlan(
  input: Omit<HouseholdInput, 'budgetGbp'>,
  foods: FoodItem[],
): CheapestPlanResult {
  const adults = Math.max(0, input.adults);
  const children = Math.max(0, input.children);
  const weeks = Math.max(1, input.weeks);
  const dietaryFlags = input.dietaryFlags ?? {};
  const powerOut = input.powerOut === true;

  const childRatio = input.childCalorieRatio ?? 0.6;
  const dailyCaloriesNeeded = Math.round((adults + children * childRatio) * 2000);
  const totalCaloriesNeeded = dailyCaloriesNeeded * (weeks * 7);

  const eligible = foods.filter((item) => passesDietaryFlags(item, dietaryFlags));
  const rankedLines = new Map<string, RankedItem>();
  const droppedCategories: string[] = [];
  let totalCost = 0;

  // Phase 1: For each required category, pick the cheapest item and allocate minimum units
  for (const category of REQUIRED_CATEGORIES) {
    const candidates = eligible
      .filter((item) => item.category === category && caloriesPerUnit(item) != null && item.typical_unit_price_gbp > 0)
      .sort((a, b) => a.typical_unit_price_gbp - b.typical_unit_price_gbp);

    const pick = candidates[0];
    const minUnits = CATEGORY_MIN_UNITS_OVERRIDE[category] ?? CATEGORY_MIN_UNITS[category] ?? 1;

    if (!pick) {
      droppedCategories.push(category);
      continue;
    }

    for (let i = 0; i < minUnits; i++) {
      addUnit(rankedLines, pick);
      totalCost += pick.typical_unit_price_gbp;
    }
  }

  // Phase 2: If total calories < needed, fill with cheapest calories-per-pound
  let caloriesPlanned = Array.from(rankedLines.values()).reduce((sum, line) => sum + line.totalCalories, 0);

  // Build a pool of cheapest-per-calorie items across all categories
  const fillPool = eligible
    .filter((item) => {
      const cals = caloriesPerUnit(item);
      return cals != null && cals > 0 && item.typical_unit_price_gbp > 0;
    })
    .sort((a, b) => {
      const calsA = caloriesPerUnit(a)!;
      const calsB = caloriesPerUnit(b)!;
      // Sort by cheapest cost per calorie (price / calories). When the power's
      // out, no-cook protein gets a boost (effective cost-per-calorie scaled
      // down), so it can compete with needs-heat calories.
      const costPerCalA = a.typical_unit_price_gbp / calsA;
      const costPerCalB = b.typical_unit_price_gbp / calsB;
      const effA = powerOut && isNoCookProtein(a) ? costPerCalA / NO_COOK_PROTEIN_POWER_OUT_BOOST : costPerCalA;
      const effB = powerOut && isNoCookProtein(b) ? costPerCalB / NO_COOK_PROTEIN_POWER_OUT_BOOST : costPerCalB;
      return effA - effB;
    });

  while (caloriesPlanned < totalCaloriesNeeded) {
    const next = fillPool.find((item) => {
      const existing = rankedLines.get(item.id);
      const existingCals = existing?.totalCalories ?? 0;
      const unitCals = caloriesPerUnit(item) ?? 0;
      return existingCals + unitCals <= totalCaloriesNeeded * 0.25;
    });

    if (!next) break;

    addUnit(rankedLines, next);
    totalCost += next.typical_unit_price_gbp;
    caloriesPlanned += caloriesPerUnit(next) ?? 0;
  }

  const essentialsAndFlavour = eligible.filter(
    (item) => item.category === 'flavour' || item.cal_per_100g == null,
  );

  const ranked = Array.from(rankedLines.values()).sort((a, b) => {
    if (a.category === b.category) return (b.score ?? -1) - (a.score ?? -1);
    return a.category.localeCompare(b.category);
  });

  return {
    dailyCaloriesNeeded,
    totalCaloriesNeeded,
    totalCaloriesPlanned: caloriesPlanned,
    totalCostGbp: Number(totalCost.toFixed(2)),
    ranked,
    essentialsAndFlavour,
    droppedCategories,
  };
}
