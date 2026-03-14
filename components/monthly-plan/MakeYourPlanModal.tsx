"use client";

import { useEffect, useMemo, useState } from "react";

type BuilderOption = {
  id: string;
  label: string;
  price: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
};

type CategoryConfig = {
  id: string;
  label: string;
  options: BuilderOption[];
};

type SavedCustomMeal = {
  id: string;
  title: string;
  createdAt: string;
  selections: Record<string, BuilderOption>;
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
};

const storageKey = "proteinbar_custom_meals";

const categories: CategoryConfig[] = [
  {
    id: "protein",
    label: "Cat 1 - Proteins",
    options: [
      { id: "chicken-100", label: "Chicken 100g", price: 35, protein: 31, carbs: 0, fat: 4, calories: 165 },
      { id: "chicken-150", label: "Chicken 150g", price: 45, protein: 46, carbs: 0, fat: 6, calories: 248 },
      { id: "steak-100", label: "Steak 100g", price: 42, protein: 26, carbs: 0, fat: 15, calories: 250 },
      { id: "steak-150", label: "Steak 150g", price: 55, protein: 39, carbs: 0, fat: 22, calories: 375 },
      { id: "salmon-150", label: "Salmon 150g", price: 58, protein: 34, carbs: 0, fat: 18, calories: 312 },
    ],
  },
  {
    id: "carbs",
    label: "Cat 2 - Carbs",
    options: [
      { id: "rice-100", label: "Rice 100g", price: 12, protein: 2, carbs: 28, fat: 0, calories: 130 },
      { id: "rice-150", label: "Rice 150g", price: 16, protein: 3, carbs: 42, fat: 0, calories: 195 },
      { id: "potatoes", label: "Potatoes", price: 14, protein: 3, carbs: 26, fat: 0, calories: 120 },
    ],
  },
  {
    id: "fat",
    label: "Cat 3 - Fat",
    options: [
      { id: "avocado", label: "Avocado", price: 18, protein: 2, carbs: 9, fat: 15, calories: 160 },
    ],
  },
  {
    id: "sauces",
    label: "Cat 4 - Sauces",
    options: [
      { id: "ketchup", label: "Ketchup", price: 4, protein: 0, carbs: 5, fat: 0, calories: 20 },
    ],
  },
];

function SelectedItemInfo({ option }: { option?: BuilderOption }) {
  if (!option) return null;

  return (
    <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
      <div className="grid gap-2 sm:grid-cols-2">
        <p className="rounded-md bg-white px-3 py-2">Price: {option.price.toFixed(2)} MAD</p>
        <p className="rounded-md bg-white px-3 py-2">Protein: {option.protein.toFixed(1)}g</p>
        <p className="rounded-md bg-white px-3 py-2">Carbs: {option.carbs.toFixed(1)}g</p>
        <p className="rounded-md bg-white px-3 py-2">Fat: {option.fat.toFixed(1)}g</p>
        <p className="rounded-md bg-white px-3 py-2 sm:col-span-2">
          Calories: {option.calories.toFixed(0)}
        </p>
      </div>
    </div>
  );
}

function CategoryDropdown({
  category,
  value,
  onChange,
}: {
  category: CategoryConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedOption = category.options.find((option) => option.id === value);

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <label className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
        {category.label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
      >
        <option value="">Select an option</option>
        {category.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <SelectedItemInfo option={selectedOption} />
    </section>
  );
}

function MealSummaryPanel({ selections }: { selections: Record<string, BuilderOption | undefined> }) {
  const totals = useMemo(
    () =>
      Object.values(selections).reduce(
        (acc, option) => ({
          calories: acc.calories + Number(option?.calories ?? 0),
          protein: acc.protein + Number(option?.protein ?? 0),
          carbs: acc.carbs + Number(option?.carbs ?? 0),
          fat: acc.fat + Number(option?.fat ?? 0),
          price: acc.price + Number(option?.price ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
      ),
    [selections],
  );

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
      <h3 className="text-2xl font-semibold text-zinc-900">Your Meal Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-zinc-700">
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Protein</p>
          <p className="mt-1 font-medium text-zinc-900">{selections.protein?.label ?? "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Carbs</p>
          <p className="mt-1 font-medium text-zinc-900">{selections.carbs?.label ?? "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Fat</p>
          <p className="mt-1 font-medium text-zinc-900">{selections.fat?.label ?? "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Sauce</p>
          <p className="mt-1 font-medium text-zinc-900">{selections.sauces?.label ?? "Not selected"}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Calories: <span className="font-semibold text-zinc-900">{totals.calories.toFixed(0)}</span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Protein: <span className="font-semibold text-zinc-900">{totals.protein.toFixed(1)}g</span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Carbs: <span className="font-semibold text-zinc-900">{totals.carbs.toFixed(1)}g</span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          Total Fat: <span className="font-semibold text-zinc-900">{totals.fat.toFixed(1)}g</span>
        </p>
        <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 sm:col-span-2">
          Total Price: <span className="font-semibold text-zinc-900">{totals.price.toFixed(2)} MAD</span>
        </p>
      </div>
    </aside>
  );
}

export default function MakeYourPlanModal({
  isOpen,
  onClose,
  onSave,
}: MakeYourPlanModalProps) {
  const [planName, setPlanName] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>({
    protein: "",
    carbs: "",
    fat: "",
    sauces: "",
  });

  const selectedOptions = useMemo<Record<string, BuilderOption | undefined>>(
    () =>
      categories.reduce<Record<string, BuilderOption | undefined>>((acc, category) => {
        acc[category.id] = category.options.find((option) => option.id === selections[category.id]);
        return acc;
      }, {}),
    [selections],
  );

  const totals = useMemo(
    () =>
      Object.values(selectedOptions).reduce(
        (acc, option) => ({
          calories: acc.calories + Number(option?.calories ?? 0),
          protein: acc.protein + Number(option?.protein ?? 0),
          carbs: acc.carbs + Number(option?.carbs ?? 0),
          fat: acc.fat + Number(option?.fat ?? 0),
          price: acc.price + Number(option?.price ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
      ),
    [selectedOptions],
  );

  const canSave = categories.every((category) => Boolean(selections[category.id]));

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!canSave) return;

    const payload: SavedCustomMeal = {
      id: `custom-meal-${Date.now()}`,
      title: planName.trim() || "Make Your Own Plan",
      createdAt: new Date().toISOString(),
      selections: Object.entries(selectedOptions).reduce<Record<string, BuilderOption>>((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {}),
      totals,
    };

    const previousRaw = localStorage.getItem(storageKey);
    const previous = previousRaw ? (JSON.parse(previousRaw) as SavedCustomMeal[]) : [];
    localStorage.setItem(storageKey, JSON.stringify([...previous, payload]));
    onSave?.(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Make Your Own Plan
            </h2>
            <p className="mt-2 text-sm text-zinc-600 sm:text-base">
              Build your meal by selecting one item from each category
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-2xl text-zinc-700 transition hover:bg-zinc-100"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <div className="space-y-4">
              <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
                <label className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  placeholder="Enter your plan name"
                  className="mt-3 h-12 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                />
              </section>

              {categories.map((category) => (
                <CategoryDropdown
                  key={category.id}
                  category={category}
                  value={selections[category.id]}
                  onChange={(value) =>
                    setSelections((prev) => ({ ...prev, [category.id]: value }))
                  }
                />
              ))}
            </div>

            <MealSummaryPanel selections={selectedOptions} />
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-white px-5 py-4 sm:px-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
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
