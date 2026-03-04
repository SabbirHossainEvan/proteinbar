"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { MonthlyPlan } from "@/data/monthlyPlans";

type ShowMealsSelection = {
  meals: string;
  days: string;
  snacks: string;
  startDate: string;
  planType?: string;
};

type MonthlyPlanShowMealsProps = {
  plan: MonthlyPlan;
  selection: ShowMealsSelection;
};

type DayMeal = {
  id: string;
  title: string;
  subtitle: string;
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

const sampleMeals: DayMeal[] = [
  {
    id: "halooumi-sandwich",
    title: "HALOUMI SANDWICH 1PCS",
    subtitle: "Freshly prepared and portion-balanced",
  },
  {
    id: "protein-wrap",
    title: "PROTEIN WRAP 1PCS",
    subtitle: "High protein wrap with clean ingredients",
  },
  {
    id: "fruit-snack",
    title: "FRUIT SNACK BOX",
    subtitle: "Seasonal fruit add-on for better daily balance",
  },
];

export default function MonthlyPlanShowMeals({
  plan,
  selection,
}: MonthlyPlanShowMealsProps) {
  const initialDate = toDateInputValue(selection.startDate);
  const tabs = useMemo(() => {
    const start = new Date(initialDate);
    return Array.from({ length: 5 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index * 7);
      return formatTabLabel(date.toISOString());
    });
  }, [initialDate]);

  const [activeTab, setActiveTab] = useState(0);

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
          {sampleMeals.map((meal) => (
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
        </div>

        <div className="mt-8">
          <Link
            href={{
              pathname: `/pages/monthly-plan/${plan.id}/checkout`,
              query: {
                meals: selection.meals,
                days: selection.days,
                snacks: selection.snacks,
                startDate: selection.startDate,
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
