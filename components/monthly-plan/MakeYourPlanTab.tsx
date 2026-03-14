"use client";

import { useState } from "react";
import MakeYourPlanModal, { type SavedCustomMeal } from "@/components/monthly-plan/MakeYourPlanModal";

type MakeYourPlanTabProps = {
  className?: string;
};

const storageKey = "proteinbar_custom_meals";

function getSavedMeals() {
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

export default function MakeYourPlanTab({ className = "" }: MakeYourPlanTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [savedMeals, setSavedMeals] = useState<SavedCustomMeal[]>(() => getSavedMeals());

  const handleDeleteSavedMeal = (mealId: string) => {
    setSavedMeals((prev) => {
      const next = prev.filter((meal) => meal.id !== mealId);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      }
      return next;
    });
    setSavedMessage("Saved plan deleted");
  };

  return (
    <>
      <div className={className}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="flex min-h-[360px] flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="mt-2 text-center text-[2.2rem] font-bold leading-none text-zinc-900">
              Make Your Own Plan
            </h3>

            <div className="mt-auto pt-5">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="h-10 w-full rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Make Your Plan
              </button>

              {savedMessage ? (
                <p className="mt-3 text-center text-xs font-medium text-emerald-700">
                  {savedMessage}
                </p>
              ) : null}
            </div>
          </article>

          {savedMeals.map((savedMeal) => (
            <article
              key={savedMeal.id}
              className="flex min-h-[360px] flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mt-2 text-center text-[2.2rem] font-bold leading-none text-zinc-900">
                {savedMeal.title}
              </h3>
              <p className="mx-auto mt-3 min-h-[32px] max-w-[260px] text-center text-[1.05rem] text-zinc-500">
                {savedMeal.selections.protein?.label ?? "Custom meal"} + {savedMeal.selections.carbs?.label ?? "selection"}
              </p>
              <div className="mt-auto pt-5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteSavedMeal(savedMeal.id)}
                    className="h-10 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="h-10 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Select
                  </button>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                  <p className="rounded-md bg-zinc-50 px-3 py-2.5">
                    Kcal: <span className="font-semibold text-zinc-900">{savedMeal.totals.calories.toFixed(0)}</span>
                  </p>
                  <p className="rounded-md bg-zinc-50 px-3 py-2.5">
                    Protein: <span className="font-semibold text-zinc-900">{savedMeal.totals.protein.toFixed(1)}g</span>
                  </p>
                  <p className="rounded-md bg-zinc-50 px-3 py-2.5">
                    Carbs: <span className="font-semibold text-zinc-900">{savedMeal.totals.carbs.toFixed(1)}g</span>
                  </p>
                  <p className="rounded-md bg-zinc-50 px-3 py-2.5">
                    Fat: <span className="font-semibold text-zinc-900">{savedMeal.totals.fat.toFixed(1)}g</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <MakeYourPlanModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(meal) => {
          setSavedMeals((prev) => [...prev, meal]);
          setSavedMessage("Custom meal saved");
        }}
      />
    </>
  );
}
