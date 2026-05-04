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
  notes?: string;
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
  morale: { min: 0.05, max: 0.1 },
  micronutrient: { min: 0, max: 0.05 },
};

function caloriesPerUnit(item: FoodItem): number | null {
  if (item.cal_per_100g == null) return null;
  return (item.cal_per_100g / 100) * item.typical_unit_g;
}

function scoreItem(item: FoodItem): number | null {
  const cals = caloriesPerUnit(item);
  if (cals == null || item.typical_unit_price_gbp <= 0 || item.storage_litres_per_unit <= 0) {
    return null;
  }
  const caloriesPerPound = cals / item.typical_unit_price_gbp;
  return caloriesPerPound * (1 / item.storage_litres_per_unit);
}

function passesDietaryFlags(item: FoodItem, flags: DietaryFlags): boolean {
  if (flags.vegetarian && !item.vegetarian) return false;
  if (flags.glutenFree && !item.gluten_free) return false;
  if (flags.noDairy && !item.dairy_free) return false;
  return true;
}

function rankWithinCategory(items: FoodItem[]): FoodItem[] {
  return [...items].sort((a, b) => (scoreItem(b) ?? -1) - (scoreItem(a) ?? -1));
}

function addUnit(lines: Map<string, RankedItem>, item: FoodItem) {
  const current = lines.get(item.id);
  const unitCalories = caloriesPerUnit(item) ?? 0;
  const unitCost = item.typical_unit_price_gbp;
  const unitLitres = item.storage_litres_per_unit;
  const base: RankedItem = current ?? {
    item,
    quantity: 0,
    caloriesPerUnit: caloriesPerUnit(item),
    score: scoreItem(item),
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

  const dailyCaloriesNeeded = Math.round((adults + children * 0.6) * 2000);
  const totalCaloriesNeeded = dailyCaloriesNeeded * (weeks * 7);

  const eligible = foods.filter((item) => passesDietaryFlags(item, dietaryFlags));
  const rankedLines = new Map<string, RankedItem>();
  const droppedCategories: string[] = [];
  let remainingBudget = budgetGbp;

  const requiredQueue = [...REQUIRED_CATEGORIES];
  while (requiredQueue.length) {
    const category = requiredQueue[0];
    const candidates = rankWithinCategory(
      eligible.filter((item) => item.category === category && scoreItem(item) != null),
    );
    const pick = candidates[0];
    const minUnits = CATEGORY_MIN_UNITS[category] ?? 1;
    if (!pick) {
      droppedCategories.push(category);
      requiredQueue.shift();
      continue;
    }

    let allocated = 0;
    while (allocated < minUnits && remainingBudget >= pick.typical_unit_price_gbp) {
      addUnit(rankedLines, pick);
      remainingBudget -= pick.typical_unit_price_gbp;
      allocated += 1;
    }

    if (allocated < minUnits) {
      droppedCategories.push(category);
    }

    requiredQueue.shift();
  }

  const scoreRanked = rankWithinCategory(
    eligible.filter((item) => !['flavour'].includes(item.category) && scoreItem(item) != null),
  );

  let caloriesPlanned = Array.from(rankedLines.values()).reduce((sum, line) => sum + line.totalCalories, 0);
  const maxCaloriesPerItem = totalCaloriesNeeded * 0.25;
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
    if (!next) break;
    addUnit(rankedLines, next);
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

  return {
    dailyCaloriesNeeded,
    totalCaloriesNeeded,
    totalCaloriesPlanned,
    totalBudgetUsedGbp: Number(totalBudgetUsedGbp.toFixed(2)),
    remainingBudgetGbp: Number(Math.max(0, remainingBudget).toFixed(2)),
    ranked,
    essentialsAndFlavour,
    droppedCategories,
  };
}
