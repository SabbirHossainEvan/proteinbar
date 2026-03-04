"use client";

import { useMemo, useState } from "react";
import { monthlyPlans } from "@/data/monthlyPlans";
import {
  builderCategories,
  builderRules,
  computeBuilderTotals,
  getCatalogByCategory,
  resolveSelection,
  type BuilderCategoryId,
  type SelectedBuilderOption,
} from "@/data/builderCatalog";

type SelectionState = Record<BuilderCategoryId, string>;

const storageKeys = {
  savedMeals: "proteinbar_custom_meals",
  planMeals: "proteinbar_plan_meal_slots",
};

function toMealName(selected: SelectedBuilderOption[]) {
  const protein = selected.find((item) => item.categoryId === "protein");
  const carb = selected.find((item) => item.categoryId === "carb");
  if (protein && carb) return `${protein.ingredientName} + ${carb.ingredientName}`;
  return `Custom Meal ${new Date().toLocaleTimeString()}`;
}

export default function CustomMealBuilder() {
  const [selections, setSelections] = useState<SelectionState>({
    protein: "",
    carb: "",
    legume: "",
    fruit: "",
  });
  const [daySlot, setDaySlot] = useState("1");
  const [planId, setPlanId] = useState(monthlyPlans[0]?.id ?? "");
  const [lastSavedMealId, setLastSavedMealId] = useState("");
  const [message, setMessage] = useState("");

  const selectedOptions = useMemo(() => {
    return builderCategories
      .map((category) => resolveSelection(category.id, selections[category.id]))
      .filter((value): value is SelectedBuilderOption => Boolean(value));
  }, [selections]);

  const totals = useMemo(
    () => computeBuilderTotals(selectedOptions),
    [selectedOptions]
  );

  const uniqueAllergens = useMemo(() => {
    return Array.from(new Set(selectedOptions.flatMap((item) => item.allergens)));
  }, [selectedOptions]);

  const selectedCategoryCount = selectedOptions.length;
  const missingRequired = builderRules.requiredCategories.filter(
    (category) => !selections[category]
  );

  const validationError = useMemo(() => {
    if (missingRequired.length > 0) {
      return `Required categories missing: ${missingRequired.join(", ")}`;
    }
    if (selectedCategoryCount < builderRules.minCategories) {
      return `Select at least ${builderRules.minCategories} categories`;
    }
    if (selectedCategoryCount > builderRules.maxCategories) {
      return `Select no more than ${builderRules.maxCategories} categories`;
    }
    return "";
  }, [missingRequired, selectedCategoryCount]);

  const canSave = !validationError && selectedOptions.length > 0;

  const saveCustomMeal = () => {
    if (!canSave) {
      setMessage(validationError || "Please select meal components");
      return;
    }

    const id = `meal-${Date.now()}`;
    const payload = {
      id,
      title: toMealName(selectedOptions),
      createdAt: new Date().toISOString(),
      components: selectedOptions,
      totals,
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
      addedAt: new Date().toISOString(),
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
              Catalog options, portion macros, allergen tags, and rules are admin-managed.
            </p>
          </div>

          {builderCategories.map((category) => {
            const options = getCatalogByCategory(category.id);
            return (
              <article
                key={category.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"
              >
                <h3 className="text-2xl font-semibold text-zinc-900">{category.label}</h3>
                <select
                  value={selections[category.id]}
                  onChange={(event) =>
                    setSelections((prev) => ({ ...prev, [category.id]: event.target.value }))
                  }
                  className="mt-3 h-11 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-800 outline-none focus:border-zinc-500"
                >
                  <option value="">Select {category.label.toLowerCase()} option</option>
                  {options.map((ingredient) =>
                    ingredient.portions.map((portion) => (
                      <option
                        key={`${ingredient.id}-${portion.id}`}
                        value={`${ingredient.id}::${portion.id}`}
                      >
                        {ingredient.name} - {portion.label} | {portion.macros.kcal} kcal | P{" "}
                        {portion.macros.protein} C {portion.macros.carbs} F {portion.macros.fat}
                      </option>
                    ))
                  )}
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
            {uniqueAllergens.length > 0 ? (
              <p className="mt-2 text-xs text-amber-700">
                Allergen alert: {uniqueAllergens.join(", ")}
              </p>
            ) : null}
            {validationError ? (
              <p className="mt-3 text-sm text-red-600">{validationError}</p>
            ) : (
              <p className="mt-3 text-sm text-emerald-700">Selection rules passed</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-2xl font-semibold text-zinc-900">Selected Components</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {selectedOptions.length === 0 ? (
                <li>No components selected yet.</li>
              ) : (
                selectedOptions.map((item) => (
                  <li key={`${item.categoryId}-${item.ingredientId}-${item.portionId}`}>
                    {item.categoryId.toUpperCase()}: {item.ingredientName} ({item.portionLabel})
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
                  {monthlyPlans.map((plan) => (
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
