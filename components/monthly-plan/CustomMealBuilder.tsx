"use client";

import { useEffect, useMemo, useState } from "react";
import { mapApiPlan } from "@/lib/api-mappers";
import { useGetBuilderIngredientsQuery, useGetMonthlyPlansQuery } from "@/redux/api/publicApi";

type SelectionState = Record<string, string>;

type IngredientItem = {
  _id?: string;
  id?: string;
  ingredientId: string;
  category: string;
  item: string;
  quantityLabel: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

const storageKeys = {
  savedMeals: "proteinbar_custom_meals",
  planMeals: "proteinbar_plan_meal_slots"
};

function getIngredientDocId(item: IngredientItem) {
  return String(item.id ?? item._id ?? "");
}

function toMealName(selected: IngredientItem[]) {
  const protein = selected.find((item) => item.category.toLowerCase() === "protein");
  const carb = selected.find((item) => item.category.toLowerCase() === "carb");
  if (protein && carb) return `${protein.item} + ${carb.item}`;
  return `Custom Meal ${new Date().toLocaleTimeString()}`;
}

export default function CustomMealBuilder() {
  const { data: ingredientsResponse, isLoading, isError } = useGetBuilderIngredientsQuery();
  const { data: plansResponse } = useGetMonthlyPlansQuery();

  const ingredients = useMemo<IngredientItem[]>(() => {
    return (ingredientsResponse?.data ?? []).map((item: any) => ({
      _id: item._id,
      id: item.id,
      ingredientId: item.ingredientId ?? "",
      category: item.category ?? "",
      item: item.item ?? "",
      quantityLabel: item.quantityLabel ?? "",
      kcal: Number(item.kcal ?? 0),
      protein: Number(item.protein ?? 0),
      carbs: Number(item.carbs ?? 0),
      fat: Number(item.fat ?? 0)
    }));
  }, [ingredientsResponse]);

  const plans = useMemo(() => {
    return (plansResponse?.data ?? []).map(mapApiPlan);
  }, [plansResponse]);

  const categories = useMemo(() => {
    return Array.from(new Set(ingredients.map((item) => item.category).filter(Boolean)));
  }, [ingredients]);

  const [selections, setSelections] = useState<SelectionState>({});
  const [daySlot, setDaySlot] = useState("1");
  const [planId, setPlanId] = useState("");
  const [lastSavedMealId, setLastSavedMealId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!plans.length) return;
    setPlanId((prev) => prev || plans[0].id);
  }, [plans]);

  useEffect(() => {
    if (!categories.length) return;

    setSelections((prev) => {
      const next: SelectionState = {};
      categories.forEach((category) => {
        const current = prev[category];
        const exists = ingredients.some((item) => item.category === category && getIngredientDocId(item) === current);
        next[category] = exists ? current : "";
      });
      return next;
    });
  }, [categories, ingredients]);

  const selectedItems = useMemo(() => {
    return categories
      .map((category) => ingredients.find((item) => item.category === category && getIngredientDocId(item) === selections[category]))
      .filter((item): item is IngredientItem => Boolean(item));
  }, [categories, ingredients, selections]);

  const totals = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => ({
        kcal: acc.kcal + item.kcal,
        protein: acc.protein + item.protein,
        carbs: acc.carbs + item.carbs,
        fat: acc.fat + item.fat,
        priceAed: acc.priceAed + item.kcal * 0.03
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, priceAed: 0 }
    );
  }, [selectedItems]);

  const requiredCategories = useMemo(() => {
    return categories.filter((category) => ["protein", "carb"].includes(category.toLowerCase()));
  }, [categories]);

  const missingRequired = requiredCategories.filter((category) => !selections[category]);
  const selectedCategoryCount = selectedItems.length;

  const validationError = useMemo(() => {
    if (missingRequired.length > 0) {
      return `Required categories missing: ${missingRequired.join(", ")}`;
    }
    if (selectedCategoryCount < Math.min(2, categories.length)) {
      return `Select at least ${Math.min(2, categories.length)} categories`;
    }
    if (selectedCategoryCount > categories.length) {
      return `Select no more than ${categories.length} categories`;
    }
    return "";
  }, [categories.length, missingRequired, selectedCategoryCount]);

  const canSave = !validationError && selectedItems.length > 0;

  const saveCustomMeal = () => {
    if (!canSave) {
      setMessage(validationError || "Please select meal components");
      return;
    }

    const id = `meal-${Date.now()}`;
    const payload = {
      id,
      title: toMealName(selectedItems),
      createdAt: new Date().toISOString(),
      components: selectedItems,
      totals
    };

    const previousRaw = localStorage.getItem(storageKeys.savedMeals);
    const previous = previousRaw ? JSON.parse(previousRaw) : [];
    localStorage.setItem(storageKeys.savedMeals, JSON.stringify([...previous, payload]));

    setLastSavedMealId(id);
    setMessage("Custom meal saved");
  };

  const addToPlanDay = () => {
    if (!planId) {
      setMessage("Select a plan first");
      return;
    }
    if (!lastSavedMealId) {
      setMessage("Save custom meal first");
      return;
    }

    const slotPayload = {
      id: `slot-${Date.now()}`,
      mealId: lastSavedMealId,
      planId,
      day: Number(daySlot),
      addedAt: new Date().toISOString()
    };

    const previousRaw = localStorage.getItem(storageKeys.planMeals);
    const previous = previousRaw ? JSON.parse(previousRaw) : [];
    localStorage.setItem(
      storageKeys.planMeals,
      JSON.stringify([...previous, slotPayload])
    );
    setMessage("Meal added to selected plan/day");
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Custom Meal Builder
            </h2>
            <p className="mt-3 text-sm text-zinc-600 sm:text-base">
              Build your meal with portions from protein, carbs, legumes, and fruits.
              Macros and price update instantly.
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Catalog options, portion macros, and rules are admin-managed.
            </p>
          </div>

          {isError ? <p className="text-sm text-red-600">Failed to load ingredient catalog.</p> : null}

          {(isLoading ? [] : categories).map((category) => {
            const options = ingredients.filter((item) => item.category === category);
            return (
              <article
                key={category}
                className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
              >
                <h3 className="text-2xl font-semibold text-zinc-900">{category}</h3>
                <select
                  value={selections[category] ?? ""}
                  onChange={(event) =>
                    setSelections((prev) => ({ ...prev, [category]: event.target.value }))
                  }
                  className="mt-3 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none focus:border-zinc-500"
                >
                  <option value="">Select {category.toLowerCase()} option</option>
                  {options.map((ingredient) => {
                    const docId = getIngredientDocId(ingredient);
                    return (
                      <option key={docId || ingredient.ingredientId} value={docId}>
                        {ingredient.item} - {ingredient.quantityLabel} | {ingredient.kcal} kcal | P {ingredient.protein} C {ingredient.carbs} F {ingredient.fat}
                      </option>
                    );
                  })}
                </select>
              </article>
            );
          })}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-zinc-900">Live Totals</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <p className="rounded-lg bg-zinc-100 px-3 py-2">Kcal: {totals.kcal.toFixed(1)}</p>
              <p className="rounded-lg bg-zinc-100 px-3 py-2">
                Protein: {totals.protein.toFixed(1)}g
              </p>
              <p className="rounded-lg bg-zinc-100 px-3 py-2">
                Carbs: {totals.carbs.toFixed(1)}g
              </p>
              <p className="rounded-lg bg-zinc-100 px-3 py-2">Fat: {totals.fat.toFixed(1)}g</p>
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-800">
              Price: {totals.priceAed.toFixed(2)} AED
            </p>
            {validationError ? (
              <p className="mt-3 text-sm text-red-600">{validationError}</p>
            ) : (
              <p className="mt-3 text-sm text-emerald-700">Selection rules passed</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-zinc-900">Selected Components</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {selectedItems.length === 0 ? (
                <li>No components selected yet.</li>
              ) : (
                selectedItems.map((item) => (
                  <li key={`${item.category}-${getIngredientDocId(item)}`}>
                    {item.category.toUpperCase()}: {item.item} ({item.quantityLabel})
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-zinc-900">Actions</h3>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={saveCustomMeal}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-black px-5 text-sm font-medium !text-white transition hover:bg-zinc-800"
              >
                Save Custom Meal
              </button>

              <div>
                <label className="text-sm font-medium text-zinc-700">Plan</label>
                <select
                  value={planId}
                  onChange={(event) => setPlanId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none focus:border-zinc-500"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">Day Slot</label>
                <select
                  value={daySlot}
                  onChange={(event) => setDaySlot(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none focus:border-zinc-500"
                >
                  {Array.from({ length: 30 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      Day {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={addToPlanDay}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
              >
                Add To Selected Plan/Day
              </button>
            </div>
            {message ? <p className="mt-3 text-sm text-zinc-700">{message}</p> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
