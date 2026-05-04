import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildPlan, type FoodItem } from '../src/lib/planner';

const foods = JSON.parse(
  readFileSync(join(process.cwd(), 'data', 'foods.json'), 'utf8'),
) as FoodItem[];

const result = buildPlan(
  {
    adults: 2,
    children: 1,
    budgetGbp: 120,
    weeks: 4,
    dietaryFlags: {
      vegetarian: false,
      glutenFree: false,
      noDairy: false,
    },
  },
  foods,
);

const caloriesByCategory = Object.fromEntries(
  result.ranked.reduce((map, line) => {
    const current = map.get(line.category) ?? 0;
    map.set(line.category, current + line.totalCalories);
    return map;
  }, new Map<string, number>()),
);

const budgetByCategory = Object.fromEntries(
  result.ranked.reduce((map, line) => {
    const current = map.get(line.category) ?? 0;
    map.set(line.category, Number((current + line.estimatedCostGbp).toFixed(2)));
    return map;
  }, new Map<string, number>()),
);

console.log(JSON.stringify({
  summary: {
    dailyCaloriesNeeded: result.dailyCaloriesNeeded,
    totalCaloriesNeeded: result.totalCaloriesNeeded,
    totalCaloriesPlanned: result.totalCaloriesPlanned,
    totalBudgetUsedGbp: result.totalBudgetUsedGbp,
    remainingBudgetGbp: result.remainingBudgetGbp,
  },
  ranked: result.ranked,
  caloriesByCategory,
  budgetByCategory,
  essentialsAndFlavour: result.essentialsAndFlavour,
  droppedCategories: result.droppedCategories,
}, null, 2));
