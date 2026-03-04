export type MacroTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type BuilderCategoryId = "protein" | "carb" | "legume" | "fruit";

export type PortionOption = {
  id: string;
  label: string;
  macros: MacroTotals;
  priceAed: number;
};

export type CatalogIngredient = {
  id: string;
  category: BuilderCategoryId;
  name: string;
  allergens: string[];
  portions: PortionOption[];
};

export type BuilderRule = {
  requiredCategories: BuilderCategoryId[];
  minCategories: number;
  maxCategories: number;
};

export const builderCategories: { id: BuilderCategoryId; label: string }[] = [
  { id: "protein", label: "Protein" },
  { id: "carb", label: "Carbs" },
  { id: "legume", label: "Legumes" },
  { id: "fruit", label: "Fruits" },
];

export const builderRules: BuilderRule = {
  requiredCategories: ["protein", "carb"],
  minCategories: 2,
  maxCategories: 4,
};

export const builderCatalog: CatalogIngredient[] = [
  {
    id: "chicken-breast",
    category: "protein",
    name: "Chicken Breast",
    allergens: [],
    portions: [
      {
        id: "100g",
        label: "100g",
        macros: { kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
        priceAed: 12,
      },
      {
        id: "150g",
        label: "150g",
        macros: { kcal: 248, protein: 46.5, carbs: 0, fat: 5.4 },
        priceAed: 16,
      },
    ],
  },
  {
    id: "salmon",
    category: "protein",
    name: "Salmon",
    allergens: ["Fish"],
    portions: [
      {
        id: "100g",
        label: "100g",
        macros: { kcal: 208, protein: 20, carbs: 0, fat: 13 },
        priceAed: 18,
      },
      {
        id: "150g",
        label: "150g",
        macros: { kcal: 312, protein: 30, carbs: 0, fat: 19.5 },
        priceAed: 24,
      },
    ],
  },
  {
    id: "brown-rice",
    category: "carb",
    name: "Brown Rice",
    allergens: [],
    portions: [
      {
        id: "100g",
        label: "100g",
        macros: { kcal: 123, protein: 2.7, carbs: 25.6, fat: 1 },
        priceAed: 6,
      },
      {
        id: "150g",
        label: "150g",
        macros: { kcal: 185, protein: 4.1, carbs: 38.4, fat: 1.5 },
        priceAed: 8,
      },
      {
        id: "200g",
        label: "200g",
        macros: { kcal: 246, protein: 5.4, carbs: 51.2, fat: 2 },
        priceAed: 10,
      },
    ],
  },
  {
    id: "sweet-potato",
    category: "carb",
    name: "Sweet Potato",
    allergens: [],
    portions: [
      {
        id: "100g",
        label: "100g",
        macros: { kcal: 90, protein: 2, carbs: 21, fat: 0.1 },
        priceAed: 5,
      },
      {
        id: "150g",
        label: "150g",
        macros: { kcal: 135, protein: 3, carbs: 31.5, fat: 0.2 },
        priceAed: 7,
      },
    ],
  },
  {
    id: "chickpeas",
    category: "legume",
    name: "Chickpeas",
    allergens: [],
    portions: [
      {
        id: "70g",
        label: "70g",
        macros: { kcal: 115, protein: 6, carbs: 19, fat: 2 },
        priceAed: 5,
      },
      {
        id: "120g",
        label: "120g",
        macros: { kcal: 197, protein: 10, carbs: 33, fat: 3.4 },
        priceAed: 8,
      },
    ],
  },
  {
    id: "lentils",
    category: "legume",
    name: "Lentils",
    allergens: [],
    portions: [
      {
        id: "70g",
        label: "70g",
        macros: { kcal: 81, protein: 6.3, carbs: 14, fat: 0.3 },
        priceAed: 5,
      },
      {
        id: "120g",
        label: "120g",
        macros: { kcal: 139, protein: 10.8, carbs: 24, fat: 0.5 },
        priceAed: 8,
      },
    ],
  },
  {
    id: "apple",
    category: "fruit",
    name: "Apple",
    allergens: [],
    portions: [
      {
        id: "100g",
        label: "100g",
        macros: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2 },
        priceAed: 4,
      },
      {
        id: "150g",
        label: "150g",
        macros: { kcal: 78, protein: 0.5, carbs: 21, fat: 0.3 },
        priceAed: 6,
      },
    ],
  },
  {
    id: "berries",
    category: "fruit",
    name: "Mixed Berries",
    allergens: [],
    portions: [
      {
        id: "80g",
        label: "80g",
        macros: { kcal: 45, protein: 0.6, carbs: 10.8, fat: 0.2 },
        priceAed: 7,
      },
      {
        id: "120g",
        label: "120g",
        macros: { kcal: 67, protein: 0.9, carbs: 16.2, fat: 0.3 },
        priceAed: 10,
      },
    ],
  },
];

export type SelectedBuilderOption = {
  categoryId: BuilderCategoryId;
  ingredientId: string;
  portionId: string;
  ingredientName: string;
  portionLabel: string;
  macros: MacroTotals;
  priceAed: number;
  allergens: string[];
};

export function getCatalogByCategory(categoryId: BuilderCategoryId) {
  return builderCatalog.filter((item) => item.category === categoryId);
}

export function resolveSelection(
  categoryId: BuilderCategoryId,
  value: string
): SelectedBuilderOption | null {
  if (!value) return null;
  const [ingredientId, portionId] = value.split("::");
  if (!ingredientId || !portionId) return null;

  const ingredient = builderCatalog.find(
    (item) => item.category === categoryId && item.id === ingredientId
  );
  if (!ingredient) return null;

  const portion = ingredient.portions.find((item) => item.id === portionId);
  if (!portion) return null;

  return {
    categoryId,
    ingredientId,
    portionId,
    ingredientName: ingredient.name,
    portionLabel: portion.label,
    macros: portion.macros,
    priceAed: portion.priceAed,
    allergens: ingredient.allergens,
  };
}

export function computeBuilderTotals(selected: SelectedBuilderOption[]) {
  return selected.reduce(
    (acc, item) => {
      acc.kcal += item.macros.kcal;
      acc.protein += item.macros.protein;
      acc.carbs += item.macros.carbs;
      acc.fat += item.macros.fat;
      acc.priceAed += item.priceAed;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, priceAed: 0 }
  );
}
