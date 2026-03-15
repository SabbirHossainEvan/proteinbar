"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BuilderOption = {
  id: string;
  groupId: string;
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
  ctaLabel?: string;
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
};

type OptionGroup = {
  id: string;
  title: string;
  image: string;
  sizes: BuilderOption[];
};

const storageKey = "proteinbar_custom_meals";

const categories: CategoryConfig[] = [
  {
    id: "protein",
    label: "CAT 1 - PROTEINS",
    ctaLabel: "Select",
    options: [
      {
        id: "chicken-100",
        groupId: "chicken",
        label: "Chicken Breast 100g",
        shortLabel: "Chicken Breast",
        sizeLabel: "100g",
        image: "/food/food.png",
        price: 35,
        protein: 31,
        carbs: 0,
        fat: 4,
        calories: 165,
      },
      {
        id: "chicken-150",
        groupId: "chicken",
        label: "Chicken Breast 150g",
        shortLabel: "Chicken Breast",
        sizeLabel: "150g",
        image: "/food/food.png",
        price: 45,
        protein: 46,
        carbs: 0,
        fat: 6,
        calories: 248,
      },
      {
        id: "steak-100",
        groupId: "steak",
        label: "Steak 100g",
        shortLabel: "Steak",
        sizeLabel: "100g",
        image: "/food/food10.webp",
        price: 42,
        protein: 26,
        carbs: 0,
        fat: 15,
        calories: 250,
      },
      {
        id: "steak-150",
        groupId: "steak",
        label: "Steak 150g",
        shortLabel: "Steak",
        sizeLabel: "150g",
        image: "/food/food10.webp",
        price: 55,
        protein: 39,
        carbs: 0,
        fat: 22,
        calories: 375,
      },
      {
        id: "salmon-150",
        groupId: "salmon",
        label: "Salmon 150g",
        shortLabel: "Salmon",
        sizeLabel: "150g",
        image: "/food/food11.webp",
        price: 58,
        protein: 34,
        carbs: 0,
        fat: 18,
        calories: 312,
      },
      {
        id: "tofu-120",
        groupId: "tofu",
        label: "Tofu 120g",
        shortLabel: "Tofu",
        sizeLabel: "120g",
        image: "/food/food6.webp",
        price: 28,
        protein: 16,
        carbs: 4,
        fat: 9,
        calories: 155,
      },
      {
        id: "tofu-180",
        groupId: "tofu",
        label: "Tofu 180g",
        shortLabel: "Tofu",
        sizeLabel: "180g",
        image: "/food/food6.webp",
        price: 36,
        protein: 24,
        carbs: 6,
        fat: 13,
        calories: 232,
      },
      {
        id: "shrimp-120",
        groupId: "shrimp",
        label: "Shrimp 120g",
        shortLabel: "Shrimp",
        sizeLabel: "120g",
        image: "/food/food3.webp",
        price: 48,
        protein: 27,
        carbs: 1,
        fat: 2,
        calories: 134,
      },
      {
        id: "shrimp-180",
        groupId: "shrimp",
        label: "Shrimp 180g",
        shortLabel: "Shrimp",
        sizeLabel: "180g",
        image: "/food/food3.webp",
        price: 62,
        protein: 40,
        carbs: 2,
        fat: 3,
        calories: 201,
      },
    ],
  },
  {
    id: "carbs",
    label: "CAT 2 - CARBS",
    ctaLabel: "Select",
    options: [
      {
        id: "rice-100",
        groupId: "rice",
        label: "Rice 100g",
        shortLabel: "Rice",
        sizeLabel: "100g",
        image: "/food/food2.png",
        price: 12,
        protein: 2,
        carbs: 28,
        fat: 0,
        calories: 130,
      },
      {
        id: "rice-150",
        groupId: "rice",
        label: "Rice 150g",
        shortLabel: "Rice",
        sizeLabel: "150g",
        image: "/food/food2.png",
        price: 16,
        protein: 3,
        carbs: 42,
        fat: 0,
        calories: 195,
      },
      {
        id: "potatoes",
        groupId: "sweet-potato",
        label: "Sweet Potato 150g",
        shortLabel: "Sweet Potato",
        sizeLabel: "150g",
        image: "/food/food9.webp",
        price: 14,
        protein: 3,
        carbs: 26,
        fat: 0,
        calories: 120,
      },
      {
        id: "quinoa-100",
        groupId: "quinoa",
        label: "Quinoa 100g",
        shortLabel: "Quinoa",
        sizeLabel: "100g",
        image: "/food/food7.webp",
        price: 20,
        protein: 4,
        carbs: 21,
        fat: 2,
        calories: 120,
      },
      {
        id: "quinoa-150",
        groupId: "quinoa",
        label: "Quinoa 150g",
        shortLabel: "Quinoa",
        sizeLabel: "150g",
        image: "/food/food7.webp",
        price: 26,
        protein: 6,
        carbs: 32,
        fat: 3,
        calories: 180,
      },
      {
        id: "pasta-150",
        groupId: "pasta",
        label: "Pasta 150g",
        shortLabel: "Pasta",
        sizeLabel: "150g",
        image: "/food/food14.webp",
        price: 18,
        protein: 6,
        carbs: 34,
        fat: 1,
        calories: 176,
      },
      {
        id: "pasta-200",
        groupId: "pasta",
        label: "Pasta 200g",
        shortLabel: "Pasta",
        sizeLabel: "200g",
        image: "/food/food14.webp",
        price: 23,
        protein: 8,
        carbs: 45,
        fat: 1,
        calories: 235,
      },
      {
        id: "potato-200",
        groupId: "sweet-potato",
        label: "Sweet Potato 200g",
        shortLabel: "Sweet Potato",
        sizeLabel: "200g",
        image: "/food/food9.webp",
        price: 18,
        protein: 4,
        carbs: 35,
        fat: 0,
        calories: 160,
      },
    ],
  },
  {
    id: "fat",
    label: "CAT 3 - FAT",
    ctaLabel: "Add",
    options: [
      {
        id: "avocado",
        groupId: "avocado",
        label: "Avocado 30g",
        shortLabel: "Avocado",
        sizeLabel: "30g",
        image: "/food/food13.webp",
        price: 18,
        protein: 2,
        carbs: 9,
        fat: 15,
        calories: 160,
      },
      {
        id: "almonds-30",
        groupId: "almonds",
        label: "Almonds 30g",
        shortLabel: "Almonds",
        sizeLabel: "30g",
        image: "/food/food8.webp",
        price: 16,
        protein: 6,
        carbs: 6,
        fat: 14,
        calories: 174,
      },
      {
        id: "almonds-50",
        groupId: "almonds",
        label: "Almonds 50g",
        shortLabel: "Almonds",
        sizeLabel: "50g",
        image: "/food/food8.webp",
        price: 24,
        protein: 10,
        carbs: 10,
        fat: 24,
        calories: 290,
      },
      {
        id: "olive-oil-30",
        groupId: "olive-oil",
        label: "Olive Oil 30g",
        shortLabel: "Olive Oil",
        sizeLabel: "30g",
        image: "/food/food12.webp",
        price: 10,
        protein: 0,
        carbs: 0,
        fat: 30,
        calories: 265,
      },
      {
        id: "olive-oil-50",
        groupId: "olive-oil",
        label: "Olive Oil 50g",
        shortLabel: "Olive Oil",
        sizeLabel: "50g",
        image: "/food/food12.webp",
        price: 15,
        protein: 0,
        carbs: 0,
        fat: 50,
        calories: 442,
      },
    ],
  },
  {
    id: "sauces",
    label: "CAT 4 - SAUCES",
    ctaLabel: "Add",
    options: [
      {
        id: "ketchup",
        groupId: "ketchup",
        label: "BBQ Sauce 30ml",
        shortLabel: "BBQ Sauce",
        sizeLabel: "30ml",
        image: "/food/food4.webp",
        price: 4,
        protein: 0,
        carbs: 5,
        fat: 0,
        calories: 20,
      },
      {
        id: "tahini-30",
        groupId: "tahini",
        label: "Tahini Dressing 30ml",
        shortLabel: "Tahini Dressing",
        sizeLabel: "30ml",
        image: "/food/food5.webp",
        price: 8,
        protein: 1,
        carbs: 2,
        fat: 7,
        calories: 78,
      },
      {
        id: "tahini-50",
        groupId: "tahini",
        label: "Tahini Dressing 50ml",
        shortLabel: "Tahini Dressing",
        sizeLabel: "50ml",
        image: "/food/food5.webp",
        price: 11,
        protein: 2,
        carbs: 4,
        fat: 11,
        calories: 129,
      },
      {
        id: "yogurt-50",
        groupId: "yogurt",
        label: "Yogurt Sauce 50ml",
        shortLabel: "Yogurt Sauce",
        sizeLabel: "50ml",
        image: "/food/food4.webp",
        price: 7,
        protein: 2,
        carbs: 3,
        fat: 3,
        calories: 48,
      },
      {
        id: "yogurt-70",
        groupId: "yogurt",
        label: "Yogurt Sauce 70ml",
        shortLabel: "Yogurt Sauce",
        sizeLabel: "70ml",
        image: "/food/food4.webp",
        price: 9,
        protein: 3,
        carbs: 4,
        fat: 4,
        calories: 67,
      },
      {
        id: "pesto-30",
        groupId: "pesto",
        label: "Pesto Sauce 30ml",
        shortLabel: "Pesto Sauce",
        sizeLabel: "30ml",
        image: "/food/food13.webp",
        price: 10,
        protein: 1,
        carbs: 2,
        fat: 9,
        calories: 96,
      },
    ],
  },
];

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

function getOptionGroups(options: BuilderOption[]) {
  const grouped = new Map<string, OptionGroup>();

  options.forEach((option) => {
    const current = grouped.get(option.groupId);
    if (current) {
      current.sizes.push(option);
      return;
    }

    grouped.set(option.groupId, {
      id: option.groupId,
      title: option.shortLabel,
      image: option.image,
      sizes: [option],
    });
  });

  return Array.from(grouped.values());
}

function getSelectedLabels(
  options: BuilderOption[],
  selectedCounts: Record<string, number>,
) {
  return options
    .filter((option) => (selectedCounts[option.id] ?? 0) > 0)
    .map((option) => `${option.label} x${selectedCounts[option.id]}`);
}

function CategoryOptionCard({
  categoryId,
  group,
  value,
  selectedCount,
  ctaLabel,
  onSizeChange,
  onSelect,
}: {
  categoryId: string;
  group: OptionGroup;
  value: string;
  selectedCount: number;
  ctaLabel: string;
  onSizeChange: (value: string) => void;
  onSelect: () => void;
}) {
  const previewOption = group.sizes.find((option) => option.id === value) ?? group.sizes[0];
  const isSelected = selectedCount > 0;

  return (
    <article
      className={`snap-start flex min-w-[190px] max-w-[190px] flex-col self-stretch rounded-xl border bg-white shadow-sm transition ${
        isSelected ? "border-zinc-900 ring-1 ring-zinc-900/10" : "border-zinc-300"
      }`}
    >
      <div className="relative h-20 overflow-hidden rounded-t-xl bg-zinc-100">
        <Image
          src={group.image}
          alt={group.title}
          fill
          className="object-cover"
          sizes="190px"
        />
        {isSelected ? (
          <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-white">
            &#10003;
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-base font-semibold text-zinc-900">
            {group.title}
          </p>
          <span className="shrink-0 text-[11px] font-semibold text-zinc-700">
            {previewOption ? `${previewOption.price.toFixed(2)} MAD` : ""}
          </span>
        </div>

        <select
          value={value}
          onChange={(event) => onSizeChange(event.target.value)}
          className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
        >
          <option value="">Choose size ({categoryId === "sauces" ? "ml" : "g"})</option>
          {group.sizes.map((option) => (
            <option key={option.id} value={option.id}>
              {option.sizeLabel}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onSelect}
          className="h-9 w-full rounded-md bg-zinc-700 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {selectedCount > 0 ? `${ctaLabel} x${selectedCount}` : ctaLabel}
        </button>
      </div>
    </article>
  );
}

function CategorySection({
  category,
  groupSelections,
  selectedCounts,
  onSizeChange,
  onSelect,
}: {
  category: CategoryConfig;
  groupSelections: Record<string, string>;
  selectedCounts: Record<string, number>;
  onSizeChange: (groupId: string, value: string) => void;
  onSelect: (optionId: string) => void;
}) {
  const groups = useMemo(() => getOptionGroups(category.options), [category.options]);
  const selectedEntries = getSelectedLabels(category.options, selectedCounts);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900">
          {category.label}
        </h3>
        {selectedEntries.length ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 sm:text-right">
            {selectedEntries.join(", ")}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto pb-2 pr-1">
        {groups.map((group) => {
          const value = groupSelections[group.id] ?? "";
          const selectedOptionId = value || group.sizes[0]?.id || "";
          const selectedCount = group.sizes.reduce(
            (total, option) => total + (selectedCounts[option.id] ?? 0),
            0,
          );

          return (
            <CategoryOptionCard
              key={group.id}
              categoryId={category.id}
              group={group}
              value={value}
              selectedCount={selectedCount}
              ctaLabel={category.ctaLabel ?? "Select"}
              onSizeChange={(nextValue) => onSizeChange(group.id, nextValue)}
              onSelect={() => onSelect(selectedOptionId)}
            />
          );
        })}
      </div>
    </section>
  );
}

function getCategorySummary(
  category: CategoryConfig,
  selectedCounts: Record<string, number>,
) {
  return getSelectedLabels(category.options, selectedCounts).join(", ");
}

function MealSummaryPanel({
  selectedCounts,
}: {
  selectedCounts: Record<string, number>;
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
    [selectedCounts],
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
    <aside className="xl:sticky xl:top-1 self-start rounded-2xl border border-zinc-200 bg-[#f6f4ef] p-5 sm:p-6">
      <h3 className="text-2xl font-semibold text-zinc-900">Your Meal Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-zinc-700">
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Protein</p>
          <p className="mt-1 font-medium text-zinc-900">{getCategorySummary(categories[0], selectedCounts) || "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Carbs</p>
          <p className="mt-1 font-medium text-zinc-900">{getCategorySummary(categories[1], selectedCounts) || "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Fat</p>
          <p className="mt-1 font-medium text-zinc-900">{getCategorySummary(categories[2], selectedCounts) || "Not selected"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Sauce</p>
          <p className="mt-1 font-medium text-zinc-900">{getCategorySummary(categories[3], selectedCounts) || "Not selected"}</p>
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

const initialSelections = {
  protein: {} as Record<string, string>,
  carbs: {} as Record<string, string>,
  fat: {} as Record<string, string>,
  sauces: {} as Record<string, string>,
};

export default function MakeYourPlanModal({
  isOpen,
  onClose,
  onSave,
}: MakeYourPlanModalProps) {
  const [planName, setPlanName] = useState("");
  const [selections, setSelections] =
    useState<Record<string, Record<string, string>>>(initialSelections);
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>({});

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
    [selectedCounts],
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

  const canSave = categories.every((category) =>
    category.options.some((option) => (selectedCounts[option.id] ?? 0) > 0),
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlanName("");
        setSelections(initialSelections);
        setSelectedCounts({});
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setPlanName("");
    setSelections(initialSelections);
    setSelectedCounts({});
    onClose();
  };

  const handleSave = () => {
    if (!canSave) return;

    const payload: SavedCustomMeal = {
      id: `custom-meal-${Date.now()}`,
      title: planName.trim() || "Make Your Own Plan",
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
              Make Your Own Plan
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
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_330px]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5">
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
                <CategorySection
                  key={category.id}
                  category={category}
                  groupSelections={selections[category.id]}
                  selectedCounts={selectedCounts}
                  onSizeChange={(groupId, value) =>
                    setSelections((prev) => ({
                      ...prev,
                      [category.id]: {
                        ...prev[category.id],
                        [groupId]: value,
                      },
                    }))
                  }
                  onSelect={(optionId) =>
                    setSelectedCounts((prev) => ({
                      ...prev,
                      [optionId]: (prev[optionId] ?? 0) + 1,
                    }))
                  }
                />
              ))}
            </div>

            <MealSummaryPanel
              selectedCounts={selectedCounts}
            />
          </div>
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

