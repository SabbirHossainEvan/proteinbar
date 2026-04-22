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

type GroupedMealCollection = {
  date?: string;
  meals: SummaryMealCard[];
  label: string;
  value: string;
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

function formatReadableDate(date?: string) {
  if (!date) return "Your selected meals";

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  const groupedMeals = useMemo<GroupedMealCollection[]>(() => {
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
  const totalMeals = selectedMeals.length;
  const deliveryDaysLabel = selection.deliveryDays
    ?.split(",")
    .map((day) => day.trim())
    .filter(Boolean)
    .join(" • ");

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
      <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="border-b border-zinc-200 bg-[linear-gradient(135deg,#faf7ef_0%,#ffffff_52%,#f3f4f6_100%)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Review Selection
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Selected Meals For {plan.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 sm:text-base">
                Review each delivery day, confirm your chosen meals, and continue
                to checkout when everything looks right.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  {totalMeals} meal{totalMeals > 1 ? "s" : ""}
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  {selection.meals} meals/day
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  {selection.weeks
                    ? `${selection.weeks} week${selection.weeks === "1" ? "" : "s"}`
                    : `${selection.days} days`}
                </span>
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
                  Start {selection.startDate}
                </span>
              </div>
            </div>

            <aside className="rounded-[24px] bg-zinc-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Delivery Summary
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-white/65">Plan</span>
                  <span className="text-right font-medium">{plan.title}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-white/65">Schedule</span>
                  <span className="text-right font-medium">
                    {selection.weeks
                      ? `${selection.weeks} week${selection.weeks === "1" ? "" : "s"}`
                      : `${selection.days} days`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                  <span className="text-white/65">Start Date</span>
                  <span className="text-right font-medium">{selection.startDate}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="pt-0.5 text-white/65">Delivery Days</span>
                  <span className="max-w-[180px] text-right font-medium text-white/92">
                    {deliveryDaysLabel || "Not specified"}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8">
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-3">
              {groupedMeals.map((group, index) => {
                const active = activeTab === index;

                return (
                  <button
                    key={`${group.value || "selected"}-${index}`}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`min-w-[200px] rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-zinc-950 bg-zinc-950 text-white shadow-lg"
                        : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
                    }`}
                  >
                    <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${active ? "text-white/70" : "text-zinc-500"}`}>
                      {group.label}
                    </p>
                    <p className="mt-2 text-base font-semibold">
                      {group.value || "Selected meals"}
                    </p>
                    <p className={`mt-2 text-sm ${active ? "text-white/72" : "text-zinc-500"}`}>
                      {group.meals.length} item{group.meals.length > 1 ? "s" : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_290px]">
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50/70 p-4 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                    Active Delivery Day
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                    {formatReadableDate(activeGroup?.date)}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-zinc-200">
                    {activeGroup?.meals.length ?? 0} selected
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {activeGroup?.meals.map((meal) => (
                  <article
                    key={meal.key}
                    className="group overflow-hidden rounded-[22px] border border-zinc-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.14)]"
                  >
                    <div className="relative aspect-[1.08/1] overflow-hidden bg-zinc-100">
                      <Image
                        src={meal.image}
                        alt={meal.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                        1 PCS
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h4 className="text-xl font-semibold uppercase leading-tight text-zinc-950">
                        {meal.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Balanced meal selection prepared for your current delivery
                        schedule.
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Calories
                          </p>
                          <p className="mt-2 text-lg font-semibold text-zinc-950">
                            {meal.calories.toFixed(0)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Protein
                          </p>
                          <p className="mt-2 text-lg font-semibold text-zinc-950">
                            {meal.protein.toFixed(0)}g
                          </p>
                        </div>
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Fat
                          </p>
                          <p className="mt-2 text-lg font-semibold text-zinc-950">
                            {meal.fat.toFixed(0)}g
                          </p>
                        </div>
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            Carbs
                          </p>
                          <p className="mt-2 text-lg font-semibold text-zinc-950">
                            {meal.carb.toFixed(0)}g
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Checkout Readiness
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                Everything looks ready
              </h3>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                Your selected meals are grouped by delivery day. Continue to
                checkout to confirm delivery details and finalize your order.
              </p>

              <div className="mt-6 space-y-3 rounded-[20px] bg-zinc-50 p-4 ring-1 ring-zinc-200">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Selected meals</span>
                  <span className="font-semibold text-zinc-950">{totalMeals}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Delivery groups</span>
                  <span className="font-semibold text-zinc-950">{groupedMeals.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-zinc-500">Snacks</span>
                  <span className="font-semibold text-zinc-950">{selection.snacks}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={proceedToCheckout}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-black px-6 text-base font-medium text-white transition hover:bg-zinc-800"
              >
                Proceed to checkout
              </button>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
