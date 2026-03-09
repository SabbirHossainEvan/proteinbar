"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MonthlyPlan } from "@/data/monthlyPlans";
import { getCheckoutPath } from "@/lib/monthlyPlanFlow";
import type { MealLibraryItem, MonthlyPlanDetails } from "@/types/monthlyPlanFlow";

type ShowMealsSelection = {
  meals: string;
  days: string;
  snacks: string;
  startDate: string;
  deliveryDays?: string;
  planType?: string;
};

type MonthlyPlanShowMealsProps = {
  plan: MonthlyPlan;
  selection: ShowMealsSelection;
  planDetails?: MonthlyPlanDetails;
};

type DayMeal = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  calories: number;
  fat: number;
  protein: number;
  carb: number;
};

type CustomCard = {
  id: string;
  label: string;
  mealLabel: string;
};

function toDateInputValue(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().split("T")[0];
  return parsed.toISOString().split("T")[0];
}

function formatTabLabel(dateValue: string) {
  const date = new Date(dateValue);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
    date: date.toISOString().split("T")[0],
  };
}

function toDayMeal(item: MealLibraryItem): DayMeal {
  return {
    id: item.id,
    title: item.name.toUpperCase(),
    subtitle: item.tags.length ? item.tags.join(" • ") : `${item.mealType} option`,
    image: item.image || "/food/food11.webp",
    calories: Number(item.calories ?? 0),
    fat: Number(item.fat ?? 0),
    protein: Number(item.protein ?? 0),
    carb: Number(item.carbs ?? 0),
  };
}

export default function MonthlyPlanShowMeals({
  plan,
  selection,
  planDetails,
}: MonthlyPlanShowMealsProps) {
  const router = useRouter();
  const isCustom = plan.planKind === "custom" || plan.title.toLowerCase().includes("custom");
  const initialDate = toDateInputValue(selection.startDate);
  const deliveryDays = useMemo(
    () =>
      (selection.deliveryDays ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [selection.deliveryDays]
  );

  const mealLibrary = useMemo(
    () => (planDetails?.mealLibrary ?? []).filter((item) => item.status === "active"),
    [planDetails]
  );

  const mealById = useMemo(() => {
    return new Map(mealLibrary.map((item) => [item.id, item]));
  }, [mealLibrary]);

  const weekDates = useMemo(() => {
    const dates = planDetails?.weekAssignments.flatMap((assignment) =>
      Object.keys(assignment.mealsByDate ?? {})
    ) ?? [];

    return Array.from(new Set(dates)).sort((a, b) => a.localeCompare(b));
  }, [planDetails]);

  const customCategoryDefs = planDetails?.plan?.content?.customStepTwo?.categories ?? [];
  const customCategories = useMemo(() => {
    const fromCustomConfig = customCategoryDefs.map((item) => item.name.toUpperCase());
    const fromLibrary = mealLibrary.flatMap((item) =>
      item.tags.length > 0
        ? item.tags.map((tag) => tag.toUpperCase())
        : [item.mealType.toUpperCase()]
    );

    const merged = Array.from(new Set([...fromCustomConfig, ...fromLibrary]));
    return merged.length > 0 ? merged : ["BREAKFAST", "CHICKEN", "STEAK BEEF", "MINCED BEEF"];
  }, [customCategoryDefs, mealLibrary]);

  const customCards = useMemo(() => {
    if (weekDates.length > 0) {
      return weekDates.slice(0, 3).map((dateIso): CustomCard => {
        const items = (planDetails?.weekAssignments ?? []).flatMap((assignment) => assignment.mealsByDate[dateIso] ?? []);
        const mealCount = items.filter((item) => item.mealType !== "Snack").length;
        const snackCount = items.filter((item) => item.mealType === "Snack").length;
        const label = new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        return {
          id: `card-${dateIso}`,
          label,
          mealLabel: `${mealCount} Meals / ${snackCount} Snacks`,
        };
      });
    }

    const start = new Date(initialDate);
    return Array.from({ length: 3 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index * 2);
      const label = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return {
        id: `card-${index}`,
        label,
        mealLabel: deliveryDays[index] ?? "Meals",
      };
    });
  }, [deliveryDays, initialDate, planDetails, weekDates]);

  const tabs = useMemo(() => {
    if (weekDates.length > 0) {
      return weekDates.map((dateIso) => formatTabLabel(`${dateIso}T00:00:00`));
    }

    const start = new Date(initialDate);
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index * 7);
      return formatTabLabel(date.toISOString());
    });
  }, [initialDate, weekDates]);

  const [activeTab, setActiveTab] = useState(0);
  const [activeCategory, setActiveCategory] = useState(customCategories[0] ?? "ALL");
  const [sliderPage, setSliderPage] = useState(0);
  const [detailMeal, setDetailMeal] = useState<DayMeal | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  useEffect(() => {
    if (!customCategories.includes(activeCategory)) {
      setActiveCategory(customCategories[0]);
    }
  }, [activeCategory, customCategories]);

  useEffect(() => {
    setSliderPage(0);
  }, [activeCategory]);

  const allMeals = useMemo(() => mealLibrary.map(toDayMeal), [mealLibrary]);

  const categoryMeals = useMemo(() => {
    if (allMeals.length === 0) return [];
    if (activeCategory === "ALL") return allMeals;

    const customCategory = customCategoryDefs.find((item) => item.name.toUpperCase() === activeCategory);
    if (customCategory) {
      const customMeals = customCategory.mealIds
        .map((mealId) => mealById.get(mealId))
        .filter((item): item is MealLibraryItem => Boolean(item))
        .map(toDayMeal);
      if (customMeals.length > 0) return customMeals;
    }

    return mealLibrary
      .filter(
        (item) =>
          item.mealType.toUpperCase() === activeCategory ||
          item.tags.map((tag) => tag.toUpperCase()).includes(activeCategory)
      )
      .map(toDayMeal);
  }, [activeCategory, allMeals, customCategoryDefs, mealById, mealLibrary]);

  const activeDateIso = tabs[activeTab]?.date ?? "";
  const assignedMealsForDate = useMemo(() => {
    if (!activeDateIso) return [];

    const assigned = (planDetails?.weekAssignments ?? []).flatMap((assignment) => assignment.mealsByDate[activeDateIso] ?? []);
    return assigned.map((item) => {
      const meal = mealById.get(item.mealId);
      if (!meal) {
        return {
          id: item.id,
          title: item.mealName.toUpperCase(),
          subtitle: item.badges.join(" • ") || item.mealType,
          image: "/food/food11.webp",
          calories: 0,
          fat: 0,
          protein: 0,
          carb: 0,
        } as DayMeal;
      }

      const mapped = toDayMeal(meal);
      return {
        ...mapped,
        id: item.id,
        subtitle: item.badges.join(" • ") || mapped.subtitle,
      };
    });
  }, [activeDateIso, mealById, planDetails]);

  const normalMeals = assignedMealsForDate.length > 0 ? assignedMealsForDate : allMeals;
  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(categoryMeals.length / pageSize));
  const visibleMeals = categoryMeals.slice(
    sliderPage * pageSize,
    sliderPage * pageSize + pageSize
  );

  const goToCheckout = () => {
    const query = new URLSearchParams({
      meals: selection.meals,
      days: selection.days,
      snacks: selection.snacks,
      startDate: selection.startDate,
    });

    if (selection.deliveryDays) query.set("deliveryDays", selection.deliveryDays);
    if (selection.planType) query.set("planType", selection.planType);

    router.push(`${getCheckoutPath(plan)}?${query.toString()}`);
  };

  if (isCustom) {
    return (
      <section className="py-10 sm:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">CUSTOM PLAN</h2>
          <p className="mt-2 text-sm text-zinc-600">
            You can make your meal plan according to your specific schedule to achieve your own goals.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {customCategories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`h-12 rounded-md text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleMeals.map((meal) => (
              <article
                key={`${meal.id}-${activeCategory}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex justify-center">
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border border-zinc-200">
                    <Image src={meal.image} alt={meal.title} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="mt-4 text-center text-2xl font-bold leading-tight text-zinc-900">{meal.title}</h3>
                <p className="mt-2 text-center text-sm text-zinc-500">{meal.subtitle}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailMeal(meal);
                      setDetailQty(1);
                    }}
                    className="h-10 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Select
                  </button>
                </div>
              </article>
            ))}
            {!visibleMeals.length ? (
              <p className="text-sm text-zinc-500">No meals available in this category.</p>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSliderPage((prev) => Math.max(0, prev - 1))}
              disabled={sliderPage === 0}
              className="h-8 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${dot === sliderPage ? "bg-black" : "bg-zinc-400"}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setSliderPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={sliderPage === totalPages - 1}
              className="h-8 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-zinc-50 p-4 sm:p-5">
            <h4 className="text-3xl font-semibold text-zinc-900">Your Cards</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {customCards.map((card) => (
                <article key={card.id} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{card.label}</p>
                  <p className="mt-2 text-xl font-semibold text-zinc-900">{card.mealLabel}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={goToCheckout}
              className="inline-flex h-11 min-w-36 items-center justify-center rounded-md border border-zinc-300 bg-white px-8 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Apply
            </button>
          </div>
        </div>

        {detailMeal ? (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setDetailMeal(null)}
          >
            <div
              className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-end">
                <button
                  type="button"
                  onClick={() => setDetailMeal(null)}
                  className="text-4xl leading-none text-zinc-500 transition hover:text-zinc-700"
                >
                  &times;
                </button>
              </div>
              <div className="flex justify-center">
                <div className="relative h-64 w-64 overflow-hidden rounded-full border border-zinc-200">
                  <Image src={detailMeal.image} alt={detailMeal.title} fill className="object-cover" />
                </div>
              </div>

              <h6 className="mt-6 text-center text-3xl font-bold text-zinc-900">
                {detailMeal.title}
              </h6>

              <div className="mt-5 border-t border-zinc-300 pt-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                  <p className="text-2xl font-semibold text-zinc-900">{detailMeal.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                      className="h-10 w-10 rounded-sm bg-zinc-900 text-2xl font-bold text-white"
                    >
                      -
                    </button>
                    <div className="flex h-10 min-w-16 items-center justify-center border border-zinc-300 bg-zinc-100 px-3 text-xl font-semibold text-zinc-900">
                      {detailQty}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailQty((prev) => prev + 1)}
                      className="h-10 w-10 rounded-sm bg-zinc-900 text-2xl font-bold text-white"
                    >
                      +
                    </button>
                    <span className="text-lg text-zinc-600">PCS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="overflow-hidden rounded-sm border border-zinc-200">
                  <p className="bg-zinc-900 py-2 text-center text-lg font-semibold text-white">Calories</p>
                  <p className="bg-zinc-100 py-3 text-center text-xl text-zinc-700">{(detailMeal.calories * detailQty).toFixed(2)}</p>
                </div>
                <div className="overflow-hidden rounded-sm border border-zinc-200">
                  <p className="bg-zinc-900 py-2 text-center text-lg font-semibold text-white">Fat</p>
                  <p className="bg-zinc-100 py-3 text-center text-xl text-zinc-700">{(detailMeal.fat * detailQty).toFixed(2)}</p>
                </div>
                <div className="overflow-hidden rounded-sm border border-zinc-200">
                  <p className="bg-zinc-900 py-2 text-center text-lg font-semibold text-white">Protein</p>
                  <p className="bg-zinc-100 py-3 text-center text-xl text-zinc-700">{(detailMeal.protein * detailQty).toFixed(2)}</p>
                </div>
                <div className="overflow-hidden rounded-sm border border-zinc-200">
                  <p className="bg-zinc-900 py-2 text-center text-lg font-semibold text-white">Carb</p>
                  <p className="bg-zinc-100 py-3 text-center text-xl text-zinc-700">{(detailMeal.carb * detailQty).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setDetailMeal(null)}
                  className="inline-flex h-11 min-w-40 items-center justify-center rounded-full bg-zinc-800 px-6 text-lg font-semibold text-white transition hover:bg-zinc-900"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <div>
        <h2 className="text-4xl font-semibold tracking-tight text-black sm:text-6xl">
          {plan.title.toUpperCase()}
        </h2>
        <p className="mt-4 max-w-5xl text-base leading-8 text-zinc-600 sm:text-lg">
          {plan.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {selection.planType ? (
            <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
              Plan Type: {selection.planType}
            </span>
          ) : null}
          <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
            Meals: {selection.meals}
          </span>
          <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
            Days: {selection.days}
          </span>
          <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
            Snacks: {selection.snacks}
          </span>
          <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
            Start: {initialDate}
          </span>
        </div>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-4">
            {tabs.map((tab, index) => {
              const active = activeTab === index;
              return (
                <button
                  key={tab.date}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`min-w-[220px] rounded-xl border px-5 py-4 text-center shadow-sm transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  <p className="text-sm font-semibold">{tab.day}</p>
                  <p className="mt-1 text-lg font-semibold">{tab.date}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 max-w-4xl space-y-4">
          {normalMeals.map((meal) => (
            <article
              key={`${tabs[activeTab]?.date}-${meal.id}`}
              className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-[100px_minmax(0,1fr)] sm:items-center sm:p-5"
            >
              <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-black text-4xl font-semibold text-white">
                PB
              </div>

              <div>
                <h3 className="text-3xl font-semibold leading-tight text-zinc-900">
                  {meal.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">{meal.subtitle}</p>
              </div>
            </article>
          ))}
          {!normalMeals.length ? <p className="text-sm text-zinc-500">No meals assigned for this date.</p> : null}
        </div>

        <div className="mt-8">
          <Link
            href={{
              pathname: getCheckoutPath(plan),
              query: {
                meals: selection.meals,
                days: selection.days,
                snacks: selection.snacks,
                startDate: selection.startDate,
                deliveryDays: selection.deliveryDays,
                planType: selection.planType,
              },
            }}
            className="inline-flex h-12 min-w-56 items-center justify-center rounded-lg bg-black px-8 text-xl font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
