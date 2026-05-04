"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CustomPlanBuilder,
  CustomPlanFoodItem,
  CustomPlanFoodSize,
} from "@/types/monthlyPlanFlow";

type BuilderOption = {
  id: string;
  groupId: string;
  categoryId: string;
  label: string;
  shortLabel: string;
  sizeLabel: string;
  image: string;
  price: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
};

type CategoryConfig = {
  id: string;
  label: string;
  isRequired: boolean;
  options: BuilderOption[];
};

type SavedCustomMeal = {
  id: string;
  title: string;
  createdAt: string;
  selections: Record<string, BuilderOption>;
  selectionCounts?: Record<string, number>;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    price: number;
  };
};

export type { SavedCustomMeal };

type MakeYourPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (meal: SavedCustomMeal) => void;
  builder?: CustomPlanBuilder;
};

const storageKey = "proteinbar_custom_meals";

function normalizeImage(value?: string) {
  const raw = String(value ?? "").trim();
  return raw || "/food/food11.webp";
}

function extractCategoryName(label: string) {
  return label.includes(" - ") ? label.split(" - ")[1] : label;
}

function buildOptionLabel(item: CustomPlanFoodItem, size: CustomPlanFoodSize) {
  const sizeLabel = String(size.label ?? "").trim();
  return sizeLabel ? `${item.name} ${sizeLabel}` : item.name;
}

function buildCategoryConfigs(builder?: CustomPlanBuilder): CategoryConfig[] {
  if (!builder) return [];

  const activeCategories = [...(builder.categories ?? [])]
    .filter((category) => category.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const activeFoodItems = [...(builder.foodItems ?? [])]
    .filter((item) => item.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return activeCategories
    .map((category, index) => {
      const options = activeFoodItems
        .filter((item) => item.categoryId === category.id)
        .flatMap((item) =>
          [...(item.sizes ?? [])]
            .filter((size) => size.isActive)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((size) => ({
              id: size.id,
              groupId: item.id,
              categoryId: category.id,
              label: buildOptionLabel(item, size),
              shortLabel: item.name,
              sizeLabel: size.label,
              image: normalizeImage(item.imageUrl),
              price: Number(size.price ?? 0),
              protein: Number(size.protein ?? 0),
              carbs: Number(size.carbs ?? 0),
              fat: Number(size.fat ?? 0),
              calories: Number(size.calories ?? 0),
            })),
        );

      return {
        id: category.id,
        label: `CAT ${index + 1} - ${category.name.toUpperCase()}`,
        isRequired: category.isRequired,
        options,
      };
    })
    .filter((category) => category.options.length > 0);
}

function getSavedMealsFromStorage() {
  if (typeof window === "undefined") return [] as SavedCustomMeal[];

  const previousRaw = window.localStorage.getItem(storageKey);
  if (!previousRaw) return [] as SavedCustomMeal[];

  try {
    const previous = JSON.parse(previousRaw) as SavedCustomMeal[];
    return Array.isArray(previous) ? previous : [];
  } catch {
    return [] as SavedCustomMeal[];
  }
}

function getSelectedOption(
  categories: CategoryConfig[],
  selectedCounts: Record<string, number>,
  categoryId: string,
) {
  const category = categories.find((item) => item.id === categoryId);
  return category?.options.find((option) => selectedCounts[option.id] > 0) ?? null;
}

function CategorySection({
  category,
  selectedValue,
  onChange,
}: {
  category: CategoryConfig;
  selectedValue: string;
  onChange: (optionId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-zinc-900">
          {category.label}
        </label>
        <select
          value={selectedValue}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
        >
          <option value="">
            Choose {extractCategoryName(category.label)}
          </option>
          {category.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label} - {option.price.toFixed(2)} MAD
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

function MealSummaryPanel({
  categories,
  selectedCounts,
  missingCategories,
}: {
  categories: CategoryConfig[];
  selectedCounts: Record<string, number>;
  missingCategories: string[];
}) {
  const selectedOptions = useMemo(
    () =>
      Object.entries(selectedCounts)
        .map(([optionId, count]) => {
          const option = categories
            .flatMap((category) => category.options)
            .find((item) => item.id === optionId);

          if (!option || count === 0) return null;
          return { option, count };
        })
        .filter(
          (item): item is { option: BuilderOption; count: number } => Boolean(item),
        ),
    [categories, selectedCounts],
  );

  const totals = useMemo(
    () =>
      selectedOptions.reduce(
        (acc, item) => ({
          calories: acc.calories + Number(item.option.calories ?? 0) * item.count,
          protein: acc.protein + Number(item.option.protein ?? 0) * item.count,
          carbs: acc.carbs + Number(item.option.carbs ?? 0) * item.count,
          fat: acc.fat + Number(item.option.fat ?? 0) * item.count,
          price: acc.price + Number(item.option.price ?? 0) * item.count,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
      ),
    [selectedOptions],
  );

  return (
    <aside className="self-start rounded-2xl border border-zinc-200 bg-[#f6f4ef] p-5 sm:p-6 xl:sticky xl:top-1">
      <h3 className="text-2xl font-semibold text-zinc-900">Your Meal Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-zinc-700">
        {categories.map((category) => {
          const selectedOption = getSelectedOption(
            categories,
            selectedCounts,
            category.id,
          );

          return (
            <div
              key={category.id}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {extractCategoryName(category.label)}
              </p>
              <p className="mt-1 font-medium text-zinc-900">
                {selectedOption?.label || "Not selected"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Total Macros
          </p>
          <p className="mt-1 font-medium text-zinc-900">
            {(totals.protein + totals.carbs + totals.fat).toFixed(0)} gm
          </p>
        </div>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Calories:{" "}
          <span className="font-semibold text-zinc-900">
            {totals.calories.toFixed(0)}
          </span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Protein:{" "}
          <span className="font-semibold text-zinc-900">
            {totals.protein.toFixed(1)}g
          </span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Carbs:{" "}
          <span className="font-semibold text-zinc-900">
            {totals.carbs.toFixed(1)}g
          </span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Fat:{" "}
          <span className="font-semibold text-zinc-900">
            {totals.fat.toFixed(1)}g
          </span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 sm:col-span-2">
          Total Price:{" "}
          <span className="font-semibold text-zinc-900">
            {totals.price.toFixed(2)} MAD
          </span>
        </p>
      </div>

      {missingCategories.length ? (
        <p className="mt-4 text-sm text-amber-700">
          Select one item from: {missingCategories.join(", ")}.
        </p>
      ) : null}
    </aside>
  );
}

export default function MakeYourPlanModal({
  isOpen,
  onClose,
  onSave,
  builder,
}: MakeYourPlanModalProps) {
  const categories = useMemo(() => buildCategoryConfigs(builder), [builder]);
  const [categorySelections, setCategorySelections] = useState<Record<string, string>>(
    {},
  );

  const selectedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(categorySelections).forEach((optionId) => {
      if (optionId) counts[optionId] = 1;
    });
    return counts;
  }, [categorySelections]);

  const selectedOptions = useMemo(
    () =>
      Object.entries(selectedCounts)
        .map(([optionId, count]) => {
          const option = categories
            .flatMap((category) => category.options)
            .find((item) => item.id === optionId);
          if (!option || count === 0) return null;
          return { option, count };
        })
        .filter(
          (item): item is { option: BuilderOption; count: number } => Boolean(item),
        ),
    [categories, selectedCounts],
  );

  const totals = useMemo(
    () =>
      selectedOptions.reduce(
        (acc, item) => ({
          calories: acc.calories + Number(item.option.calories ?? 0) * item.count,
          protein: acc.protein + Number(item.option.protein ?? 0) * item.count,
          carbs: acc.carbs + Number(item.option.carbs ?? 0) * item.count,
          fat: acc.fat + Number(item.option.fat ?? 0) * item.count,
          price: acc.price + Number(item.option.price ?? 0) * item.count,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
      ),
    [selectedOptions],
  );

  const missingCategories = useMemo(
    () =>
      categories
        .filter((category) => !categorySelections[category.id])
        .map((category) => extractCategoryName(category.label)),
    [categories, categorySelections],
  );

  const canSave = categories.length > 0 && missingCategories.length === 0;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCategorySelections({});
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setCategorySelections({});
    onClose();
  };

  const handleSave = () => {
    if (!canSave) return;

    const title =
      selectedOptions
        .map(({ option }) => option.shortLabel)
        .filter(Boolean)
        .slice(0, 2)
        .join(" + ") || "Make Your Own Meal";

    const payload: SavedCustomMeal = {
      id: `custom-meal-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      selections: categories.reduce<Record<string, BuilderOption>>((acc, category) => {
        const firstSelected = category.options.find(
          (option) => (selectedCounts[option.id] ?? 0) > 0,
        );
        if (firstSelected) acc[category.id] = firstSelected;
        return acc;
      }, {}),
      selectionCounts: selectedCounts,
      totals,
    };

    const previous = getSavedMealsFromStorage();
    localStorage.setItem(storageKey, JSON.stringify([...previous, payload]));
    onSave?.(payload);
    handleModalClose();
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4"
      onClick={handleModalClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-[#faf8f2] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Make Your Own Meal
            </h2>
            <p className="mt-2 text-sm text-zinc-600 sm:text-base">
              Select one item from each category and build your custom meal.
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-2xl text-zinc-700 transition hover:bg-zinc-100"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          {!categories.length ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-8 text-center text-sm text-zinc-600">
              No custom meal categories or food items are available for this plan yet.
            </div>
          ) : (
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_330px]">
              <div className="space-y-4">
                {categories.map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    selectedValue={categorySelections[category.id] ?? ""}
                    onChange={(optionId) =>
                      setCategorySelections((prev) => ({
                        ...prev,
                        [category.id]: optionId,
                      }))
                    }
                  />
                ))}
              </div>

              <MealSummaryPanel
                categories={categories}
                selectedCounts={selectedCounts}
                missingCategories={missingCategories}
              />
            </div>
          )}
        </div>

        <div className="border-t border-zinc-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleModalClose}
              className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="inline-flex h-11 items-center justify-center rounded-md bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
