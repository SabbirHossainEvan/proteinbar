"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MonthlyPlan } from "@/data/monthlyPlans";
import { getCheckoutPath } from "@/lib/monthlyPlanFlow";
import type { MonthlyPlanDetails } from "@/types/monthlyPlanFlow";

type SelectedMealsSummarySelection = {
  meals: string;
  days: string;
  weeks?: string;
  snacks: string;
  startDate: string;
  deliveryDays?: string;
  planType?: string;
  selectedMeals?: string;
};

type SelectedMealOption = {
  id: string;
  title: string;
  date?: string;
};

type SummaryMealCard = {
  key: string;
  id: string;
  title: string;
  date?: string;
  image: string;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
};

type MonthlyPlanSelectedMealsSummaryProps = {
  plan: MonthlyPlan;
  selection: SelectedMealsSummarySelection;
  planDetails?: MonthlyPlanDetails;
};

function normalizeMealImage(value?: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return "/food/food11.webp";

  if (
    raw.startsWith("data:image/") &&
    raw.includes(";base64") &&
    !raw.includes(";base64,")
  ) {
    return raw.replace(/^([^,]*;base64)(.*)$/, "$1,$2");
  }

  return raw;
}

function parseSelectedMeals(value?: string): SelectedMealOption[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        id: String(item?.id ?? ""),
        title: String(item?.title ?? ""),
        date: item?.date ? String(item.date) : undefined,
      }))
      .filter((item) => item.id && item.title);
  } catch {
    return [];
  }
}

function formatDateTab(date?: string) {
  if (!date) {
    return {
      label: "SELECTED MEALS",
      value: "",
    };
  }

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return {
      label: date.toUpperCase(),
      value: date,
    };
  }

  return {
    label: parsed
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toUpperCase(),
    value: date,
  };
}

export default function MonthlyPlanSelectedMealsSummary({
  plan,
  selection,
  planDetails,
}: MonthlyPlanSelectedMealsSummaryProps) {
  const router = useRouter();
  const selectedMeals = useMemo(
    () => parseSelectedMeals(selection.selectedMeals),
    [selection.selectedMeals],
  );

  const mealLibraryById = useMemo(() => {
    return new Map((planDetails?.mealLibrary ?? []).map((item) => [item.id, item]));
  }, [planDetails]);

  const groupedMeals = useMemo(() => {
    const groups = new Map<string, SummaryMealCard[]>();

    for (const meal of selectedMeals) {
      const linkedMeal = mealLibraryById.get(meal.id);
      const groupKey = meal.date ?? "selected-meals";
      const nextItem: SummaryMealCard = {
        key: `${meal.id}-${meal.date ?? "selected"}-${groups.get(groupKey)?.length ?? 0}`,
        id: meal.id,
        title: meal.title,
        date: meal.date,
        image: normalizeMealImage(linkedMeal?.image),
        calories: Number(linkedMeal?.calories ?? 0),
        protein: Number(linkedMeal?.protein ?? 0),
        carb: Number(linkedMeal?.carbs ?? 0),
        fat: Number(linkedMeal?.fat ?? 0),
      };

      groups.set(groupKey, [...(groups.get(groupKey) ?? []), nextItem]);
    }

    return Array.from(groups.entries()).map(([date, meals]) => ({
      date: date === "selected-meals" ? undefined : date,
      meals,
      ...formatDateTab(date === "selected-meals" ? undefined : date),
    }));
  }, [mealLibraryById, selectedMeals]);

  const [activeTab, setActiveTab] = useState(0);
  const activeGroup = groupedMeals[activeTab] ?? groupedMeals[0];

  const proceedToCheckout = () => {
    const query = new URLSearchParams({
      meals: selection.meals,
      days: selection.days,
      snacks: selection.snacks,
      startDate: selection.startDate,
    });

    if (selection.weeks) query.set("weeks", selection.weeks);
    if (selection.deliveryDays) query.set("deliveryDays", selection.deliveryDays);
    if (selection.planType) query.set("planType", selection.planType);
    if (selection.selectedMeals) query.set("selectedMeals", selection.selectedMeals);

    router.push(`${getCheckoutPath(plan)}?${query.toString()}`);
  };

  if (!selectedMeals.length) {
    return (
      <section className="py-10 sm:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-semibold text-zinc-900">Selected Meals</h2>
          <p className="mt-3 text-sm text-zinc-500">No selected meals found for this plan.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-7">
        <div className="flex flex-wrap gap-4 border-b border-zinc-200 pb-3">
          {groupedMeals.map((group, index) => {
            const active = activeTab === index;

            return (
              <button
                key={`${group.value || "selected"}-${index}`}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`min-w-[220px] border-b-2 px-2 pb-3 text-left transition ${
                  active
                    ? "border-black text-zinc-900"
                    : "border-transparent text-zinc-500"
                }`}
              >
                <p className="text-base font-semibold uppercase">{group.label}</p>
                <p className="mt-1 text-sm">{group.value || "Your selected meals"}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.10)]">
          <div className="p-4 sm:p-7">
            <h3 className="text-4xl font-semibold text-black">Meals</h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {activeGroup?.meals.map((meal) => (
                <article
                  key={meal.key}
                  className="rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex justify-center">
                    <div className="relative h-64 w-64 max-w-full overflow-hidden rounded-full bg-zinc-100">
                      <Image
                        src={meal.image}
                        alt={meal.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <h4 className="mt-6 text-2xl font-bold uppercase text-zinc-900">
                    {meal.title}
                  </h4>
                  <p className="mt-2 text-lg text-zinc-900">1PCS</p>

                  <div className="mt-6 border-t border-zinc-200 pt-5 text-sm italic text-black">
                    <div className="flex items-center justify-between gap-4">
                      <span>Calories: {meal.calories.toFixed(2)}</span>
                      <span>Protein: {meal.protein.toFixed(2)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span>Fat: {meal.fat.toFixed(2)}</span>
                      <span>Carb: {meal.carb.toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={proceedToCheckout}
            className="inline-flex h-12 min-w-[264px] items-center justify-center rounded-md bg-black px-8 text-lg font-medium text-white transition hover:bg-zinc-800"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </section>
  );
}
