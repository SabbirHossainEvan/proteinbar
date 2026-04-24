/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MonthlyPlan } from "@/data/monthlyPlans";
import { getSelectedMealsPath } from "@/lib/monthlyPlanFlow";
import MakeYourPlanTab from "@/components/monthly-plan/MakeYourPlanTab";
import type { SavedCustomMeal } from "@/components/monthly-plan/MakeYourPlanModal";
import type {
  MealLibraryItem,
  MonthlyPlanDetails,
} from "@/types/monthlyPlanFlow";

type ShowMealsSelection = {
  meals: string;
  days: string;
  weeks?: string;
  snacks: string;
  startDate: string;
  deliveryDays?: string;
  planType?: string;
  selectedMeals?: string;
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
  dateIso?: string;
};

type SelectedMealOption = {
  instanceId?: string;
  id: string;
  title: string;
  date?: string;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
};

function parseSelectedMeals(value?: string): SelectedMealOption[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        instanceId: item?.instanceId ? String(item.instanceId) : undefined,
        id: String(item?.id ?? ""),
        title: String(item?.title ?? ""),
        date: item?.date ? String(item.date) : undefined,
        calories: Number(item?.calories ?? 0),
        protein: Number(item?.protein ?? 0),
        carb: Number(item?.carb ?? 0),
        fat: Number(item?.fat ?? 0),
      }))
      .filter((item) => item.id && item.title);
  } catch {
    return [];
  }
}

type SelectedCardMealDetail = {
  selection: SelectedMealOption;
  meal: DayMeal;
  cardLabel: string;
};

const makeYourPlanTabId = "MAKE_YOUR_PLAN";
const weekdayIndexByName: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function toDateInputValue(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()))
    return new Date().toISOString().split("T")[0];
  return parsed.toISOString().split("T")[0];
}

function formatTabLabel(dateValue: string) {
  const date = new Date(dateValue);
  return {
    day: date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
    date: date.toISOString().split("T")[0],
  };
}

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

function isDataImageUrl(value: string) {
  return value.toLowerCase().startsWith("data:image/");
}

function toPositiveInt(value: string, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function toIsoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function buildCustomDeliveryDates({
  startDate,
  deliveryDays,
  weeks,
  totalDays,
}: {
  startDate: string;
  deliveryDays: string[];
  weeks?: string;
  totalDays?: string;
}) {
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return [] as string[];

  const selectedWeekDays = new Set(
    deliveryDays
      .map((day) => weekdayIndexByName[day.trim().toLowerCase()])
      .filter((day): day is number => Number.isInteger(day)),
  );

  if (selectedWeekDays.size === 0) {
    return [toIsoDate(start)];
  }

  const rangeDays = Math.max(
    1,
    weeks ? toPositiveInt(weeks, 1) * 7 : toPositiveInt(totalDays ?? "", 1),
  );

  const dates: string[] = [];
  for (let offset = 0; offset < rangeDays; offset += 1) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + offset);
    if (selectedWeekDays.has(nextDate.getDay())) {
      dates.push(toIsoDate(nextDate));
    }
  }

  return dates.length > 0 ? dates : [toIsoDate(start)];
}

function toDayMeal(item: MealLibraryItem): DayMeal {
  return {
    id: item.id,
    title: item.name.toUpperCase(),
    subtitle: item.tags.length
      ? item.tags.join(" | ")
      : `${item.mealType} option`,
    image: normalizeMealImage(item.image),
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
  const isCustom =
    plan.planKind === "custom" || plan.title.toLowerCase().includes("custom");
  const isNormalPlan = plan.planKind === "normal" && !isCustom;
  const initialDate = toDateInputValue(selection.startDate);
  const deliveryDays = useMemo(
    () =>
      (selection.deliveryDays ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [selection.deliveryDays],
  );

  const mealLibrary = useMemo(
    () =>
      (planDetails?.mealLibrary ?? []).filter(
        (item) => item.status === "active",
      ),
    [planDetails],
  );

  const mealById = useMemo(() => {
    return new Map(mealLibrary.map((item) => [item.id, item]));
  }, [mealLibrary]);
  const customMealSlotCount = toPositiveInt(selection.meals, 1);

  const weekDates = useMemo(() => {
    const dates =
      planDetails?.weekAssignments.flatMap((assignment) => {
        const fromMap = Object.keys(assignment.mealsByDate ?? {});
        const fromRange: string[] = [];

        if (assignment.startDate && assignment.endDate) {
          const start = new Date(`${assignment.startDate}T00:00:00`);
          const end = new Date(`${assignment.endDate}T00:00:00`);
          if (
            !Number.isNaN(start.getTime()) &&
            !Number.isNaN(end.getTime()) &&
            start <= end
          ) {
            const cursor = new Date(start);
            while (cursor <= end) {
              fromRange.push(cursor.toISOString().split("T")[0]);
              cursor.setDate(cursor.getDate() + 1);
            }
          }
        }

        return [...fromRange, ...fromMap];
      }) ?? [];

    return Array.from(new Set(dates)).sort((a, b) => a.localeCompare(b));
  }, [planDetails]);

  const customCategoryDefs = useMemo(
    () => planDetails?.plan?.content?.customStepTwo?.categories ?? [],
    [planDetails],
  );
  const customCategories = useMemo(() => {
    const fromCustomConfig = customCategoryDefs.map((item) =>
      item.name.toUpperCase(),
    );
    const fromLibrary = mealLibrary.flatMap((item) =>
      item.tags.length > 0
        ? item.tags.map((tag) => tag.toUpperCase())
        : [item.mealType.toUpperCase()],
    );

    const merged = Array.from(new Set([...fromCustomConfig, ...fromLibrary]));
    return merged.length > 0
      ? merged
      : ["BREAKFAST", "CHICKEN", "STEAK BEEF", "MINCED BEEF"];
  }, [customCategoryDefs, mealLibrary]);

  const customCards = useMemo(() => {
    if (weekDates.length > 0) {
      return weekDates.map((dateIso): CustomCard => {
        const items = (planDetails?.weekAssignments ?? []).flatMap(
          (assignment) => assignment.mealsByDate[dateIso] ?? [],
        );
        const mealCount = items.filter(
          (item) => item.mealType !== "Snack",
        ).length;
        const snackCount = items.filter(
          (item) => item.mealType === "Snack",
        ).length;
        const label = new Date(`${dateIso}T00:00:00`).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          },
        );

        return {
          id: `card-${dateIso}`,
          label,
          mealLabel: `${mealCount} Meals / ${snackCount} Snacks`,
          dateIso,
        };
      });
    }

    const deliveryDates = buildCustomDeliveryDates({
      startDate: initialDate,
      deliveryDays,
      weeks: selection.weeks,
      totalDays: selection.days,
    });

    return deliveryDates.map((dateIso, index) => {
      const date = new Date(`${dateIso}T00:00:00`);
      const label = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return {
        id: `card-${index}`,
        label,
        mealLabel: `${customMealSlotCount} Meal${customMealSlotCount > 1 ? "s" : ""}`,
        dateIso,
      };
    });
  }, [
    customMealSlotCount,
    deliveryDays,
    initialDate,
    planDetails,
    selection.days,
    selection.weeks,
    weekDates,
  ]);

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
  const customTabs = useMemo(
    () => [makeYourPlanTabId, ...customCategories],
    [customCategories],
  );
  const [activeCategory, setActiveCategory] = useState(makeYourPlanTabId);
  const [sliderPage, setSliderPage] = useState(0);
  const [detailMeal, setDetailMeal] = useState<DayMeal | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const storageKey = useMemo(
    () =>
      `proteinbar_selected_meals:${plan.id}:${selection.startDate}:${selection.meals}:${selection.days}:${selection.weeks ?? ""}:${selection.deliveryDays ?? ""}`,
    [
      plan.id,
      selection.days,
      selection.deliveryDays,
      selection.meals,
      selection.startDate,
      selection.weeks,
    ],
  );
  const [selectedMeals, setSelectedMeals] = useState<SelectedMealOption[]>(() =>
    parseSelectedMeals(selection.selectedMeals),
  );
  const [slotWarning, setSlotWarning] = useState("");
  const [selectionPopupMeal, setSelectionPopupMeal] = useState<DayMeal | null>(
    null,
  );
  const [selectionPopupQty, setSelectionPopupQty] = useState(1);
  const [selectionPopupDate, setSelectionPopupDate] = useState<
    string | undefined
  >(undefined);
  const [selectedCardMealDetail, setSelectedCardMealDetail] =
    useState<SelectedCardMealDetail | null>(null);

  useEffect(() => {
    if (!customTabs.includes(activeCategory)) {
      setActiveCategory(customTabs[0] ?? makeYourPlanTabId);
    }
  }, [activeCategory, customTabs]);

  useEffect(() => {
    setSliderPage(0);
  }, [activeCategory]);

  useEffect(() => {
    if (activeTab >= tabs.length) {
      setActiveTab(0);
    }
  }, [activeTab, tabs.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fromStorage = window.sessionStorage.getItem(storageKey);
    if (!fromStorage) {
      if (selection.selectedMeals) {
        setSelectedMeals(parseSelectedMeals(selection.selectedMeals));
      }
      return;
    }

    const parsed = parseSelectedMeals(fromStorage);
    if (parsed.length > 0) {
      setSelectedMeals(parsed);
      return;
    }

    if (selection.selectedMeals) {
      setSelectedMeals(parseSelectedMeals(selection.selectedMeals));
    }
  }, [selection.selectedMeals, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(storageKey, JSON.stringify(selectedMeals));
  }, [selectedMeals, storageKey]);

  const mealSelectionKey = (mealId: string, date?: string) =>
    `${mealId}::${date ?? "custom"}`;

  const selectedMealCount = (mealId: string, date?: string) =>
    selectedMeals.filter(
      (item) =>
        mealSelectionKey(item.id, item.date) === mealSelectionKey(mealId, date),
    ).length;

  const addMealSelection = (meal: DayMeal, quantity: number, date?: string) => {
    setSelectedMeals((prev) => {
      const requestedCount = Math.max(1, quantity);
      const now = Date.now();
      const additions: SelectedMealOption[] = [];
      let reachedLimit = false;

      if (!date && isCustom && customCards.length > 0) {
        const cardCounts = new Map(
          customCards.map((card) => [
            card.dateIso ?? card.id,
            prev.filter((item) => item.date === card.dateIso).length,
          ]),
        );

        for (let index = 0; index < requestedCount; index += 1) {
          const nextCard = customCards.find((card) => {
            const key = card.dateIso ?? card.id;
            return (cardCounts.get(key) ?? 0) < customMealSlotCount;
          });

          if (!nextCard) {
            reachedLimit = true;
            break;
          }

          const nextDate = nextCard?.dateIso;
          const nextKey = nextDate ?? nextCard?.id ?? "custom";
          cardCounts.set(nextKey, (cardCounts.get(nextKey) ?? 0) + 1);

          additions.push({
            instanceId: `${meal.id}-${nextDate ?? "custom"}-${now}-${index}`,
            id: meal.id,
            title: meal.title,
            date: nextDate,
            calories: meal.calories,
            protein: meal.protein,
            carb: meal.carb,
            fat: meal.fat,
          });
        }
      } else {
        additions.push(
          ...Array.from({ length: requestedCount }, (_, index) => ({
            instanceId: `${meal.id}-${date ?? "custom"}-${now}-${index}`,
            id: meal.id,
            title: meal.title,
            date,
            calories: meal.calories,
            protein: meal.protein,
            carb: meal.carb,
            fat: meal.fat,
          })),
        );
      }

      if (reachedLimit || additions.length < requestedCount) {
        setSlotWarning(
          "Meal slot limit reached. Extra meals were not added beyond the available slots.",
        );
      } else {
        setSlotWarning("");
      }

      return [...prev, ...additions];
    });
  };

  const addSavedCustomMealSelection = (
    savedMeal: SavedCustomMeal,
    quantity = 1,
  ) => {
    setSelectedMeals((prev) => {
      const requestedCount = Math.max(1, quantity);
      const now = Date.now();
      const additions: SelectedMealOption[] = [];
      let reachedLimit = false;

      if (isCustom && customCards.length > 0) {
        const cardCounts = new Map(
          customCards.map((card) => [
            card.dateIso ?? card.id,
            prev.filter((item) => item.date === card.dateIso).length,
          ]),
        );

        for (let index = 0; index < requestedCount; index += 1) {
          const nextCard = customCards.find((card) => {
            const key = card.dateIso ?? card.id;
            return (cardCounts.get(key) ?? 0) < customMealSlotCount;
          });

          if (!nextCard) {
            reachedLimit = true;
            break;
          }

          const nextDate = nextCard?.dateIso;
          const nextKey = nextDate ?? nextCard?.id ?? "custom";
          cardCounts.set(nextKey, (cardCounts.get(nextKey) ?? 0) + 1);

          additions.push({
            instanceId: `${savedMeal.id}-${nextDate ?? "custom"}-${now}-${index}`,
            id: savedMeal.id,
            title: savedMeal.title,
            date: nextDate,
            calories: savedMeal.totals.calories,
            protein: savedMeal.totals.protein,
            carb: savedMeal.totals.carbs,
            fat: savedMeal.totals.fat,
          });
        }
      } else {
        additions.push(
          ...Array.from({ length: requestedCount }, (_, index) => ({
            instanceId: `${savedMeal.id}-custom-${now}-${index}`,
            id: savedMeal.id,
            title: savedMeal.title,
            date: undefined,
            calories: savedMeal.totals.calories,
            protein: savedMeal.totals.protein,
            carb: savedMeal.totals.carbs,
            fat: savedMeal.totals.fat,
          })),
        );
      }

      if (reachedLimit || additions.length < requestedCount) {
        setSlotWarning(
          "Meal slot limit reached. Extra meals were not added beyond the available slots.",
        );
      } else {
        setSlotWarning("");
      }

      return [...prev, ...additions];
    });
  };

  const openSelectionPopup = (meal: DayMeal, date?: string) => {
    setSelectionPopupMeal(meal);
    setSelectionPopupQty(1);
    setSelectionPopupDate(date);
  };

  const closeSelectionPopup = () => {
    setSelectionPopupMeal(null);
    setSelectionPopupQty(1);
    setSelectionPopupDate(undefined);
  };

  const allMeals = useMemo(() => mealLibrary.map(toDayMeal), [mealLibrary]);

  const categoryMeals = useMemo(() => {
    if (allMeals.length === 0) return [];
    if (activeCategory === "ALL") return allMeals;

    const customCategory = customCategoryDefs.find(
      (item) => item.name.toUpperCase() === activeCategory,
    );
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
          item.tags.map((tag) => tag.toUpperCase()).includes(activeCategory),
      )
      .map(toDayMeal);
  }, [activeCategory, allMeals, customCategoryDefs, mealById, mealLibrary]);

  const activeDateIso = tabs[activeTab]?.date ?? "";
  const assignedMealsForDate = useMemo(() => {
    if (!activeDateIso) return [];

    const assigned = (planDetails?.weekAssignments ?? []).flatMap(
      (assignment) => assignment.mealsByDate[activeDateIso] ?? [],
    );
    return assigned.map((item) => {
      const meal = mealById.get(item.mealId);
      if (!meal) {
        return {
          id: item.id,
          title: item.mealName.toUpperCase(),
          subtitle: item.badges.join(" | ") || item.mealType,
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
        subtitle: item.badges.join(" | ") || mapped.subtitle,
      };
    });
  }, [activeDateIso, mealById, planDetails]);

  const hasNormalDateAssignments = !isCustom && weekDates.length > 0;
  const normalMeals = hasNormalDateAssignments
    ? assignedMealsForDate
    : allMeals;
  const normalAutoSelectedMeals = useMemo(() => {
    if (!isNormalPlan) return [] as SelectedMealOption[];

    if (hasNormalDateAssignments) {
      const seen = new Set<string>();
      const items: SelectedMealOption[] = [];

      for (const assignment of planDetails?.weekAssignments ?? []) {
        for (const [dateIso, assignedMeals] of Object.entries(
          assignment.mealsByDate ?? {},
        )) {
          for (const assignedMeal of assignedMeals) {
            const linkedMeal = mealById.get(assignedMeal.mealId);
            const mappedMeal = linkedMeal ? toDayMeal(linkedMeal) : null;
            const id = String(assignedMeal.id ?? assignedMeal.mealId ?? "");
            if (!id) continue;

            const selectionItem: SelectedMealOption = {
              instanceId: undefined,
              id,
              title:
                mappedMeal?.title ??
                String(assignedMeal.mealName ?? "").toUpperCase(),
              date: dateIso,
              calories: mappedMeal?.calories ?? 0,
              protein: mappedMeal?.protein ?? 0,
              carb: mappedMeal?.carb ?? 0,
              fat: mappedMeal?.fat ?? 0,
            };

            const key = `${selectionItem.id}::${selectionItem.date ?? "custom"}`;
            if (seen.has(key)) continue;
            seen.add(key);
            items.push(selectionItem);
          }
        }
      }

      return items;
    }

    return normalMeals.map((meal) => ({
      instanceId: undefined,
      id: meal.id,
      title: meal.title,
      date: undefined,
      calories: meal.calories,
      protein: meal.protein,
      carb: meal.carb,
      fat: meal.fat,
    }));
  }, [
    hasNormalDateAssignments,
    isNormalPlan,
    mealById,
    normalMeals,
    planDetails,
  ]);
  const selectedMealsForCheckout = isNormalPlan
    ? normalAutoSelectedMeals
    : selectedMeals;
  const pageSize = 3;

  const totalPages = Math.max(1, Math.ceil(categoryMeals.length / pageSize));
  const visibleMeals = categoryMeals.slice(
    sliderPage * pageSize,
    sliderPage * pageSize + pageSize,
  );

  const customCardStats = useMemo(() => {
    const undatedSelections = selectedMeals.filter((item) => !item.date);

    return customCards.map((card, index) => {
      const dateSelections = card.dateIso
        ? selectedMeals.filter((item) => item.date === card.dateIso)
        : selectedMeals;
      const items =
        dateSelections.length > 0
          ? dateSelections
          : undatedSelections.length > 0 && index === 0
            ? undatedSelections
            : [];

      const totals = items.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carb: acc.carb + meal.carb,
          fat: acc.fat + meal.fat,
        }),
        { calories: 0, protein: 0, carb: 0, fat: 0 },
      );

      return {
        count: items.length,
        ...totals,
      };
    });
  }, [customCards, selectedMeals]);
  const openSelectedCardMealDetail = (
    selectionItem: SelectedMealOption,
    cardLabel: string,
  ) => {
    const linkedMeal = mealById.get(selectionItem.id);
    const meal: DayMeal = linkedMeal
      ? toDayMeal(linkedMeal)
      : {
          id: selectionItem.id,
          title: selectionItem.title,
          subtitle: selectionItem.date ?? "Selected meal",
          image: "/food/food11.webp",
          calories: selectionItem.calories,
          fat: selectionItem.fat,
          protein: selectionItem.protein,
          carb: selectionItem.carb,
        };

    setSelectedCardMealDetail({
      selection: selectionItem,
      meal: {
        ...meal,
        title: selectionItem.title,
      },
      cardLabel,
    });
  };

  const deleteSelectedCardMeal = () => {
    if (!selectedCardMealDetail) return;

    setSelectedMeals((prev) =>
      prev.filter(
        (item) =>
          (item.instanceId ?? mealSelectionKey(item.id, item.date)) !==
          (selectedCardMealDetail.selection.instanceId ??
            mealSelectionKey(
              selectedCardMealDetail.selection.id,
              selectedCardMealDetail.selection.date,
            )),
      ),
    );
    setSelectedCardMealDetail(null);
  };

  const goToCheckout = () => {
    const query = new URLSearchParams({
      meals: selection.meals,
      days: selection.days,
      snacks: selection.snacks,
      startDate: selection.startDate,
    });

    if (selection.weeks) query.set("weeks", selection.weeks);
    if (selection.deliveryDays)
      query.set("deliveryDays", selection.deliveryDays);
    if (selection.planType) query.set("planType", selection.planType);
    if (selectedMealsForCheckout.length) {
      query.set(
        "selectedMeals",
        JSON.stringify(
          selectedMealsForCheckout.map((item) => ({
            instanceId: item.instanceId,
            id: item.id,
            title: item.title,
            date: item.date,
            calories: item.calories,
            protein: item.protein,
            carb: item.carb,
            fat: item.fat,
          })),
        ),
      );
    }

    router.push(`${getSelectedMealsPath(plan)}?${query.toString()}`);
  };

  if (isCustom) {
    return (
      <section className="py-10 sm:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
            CUSTOM PLAN
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            You can make your meal plan according to your specific schedule to
            achieve your own goals.
          </p>

          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {customTabs.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`h-12 min-w-[220px] rounded-md px-5 text-sm font-semibold transition ${
                      active
                        ? "bg-black text-white"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {category === makeYourPlanTabId
                      ? "Make Your Meal"
                      : category}
                  </button>
                );
              })}
            </div>
          </div>

          {activeCategory === makeYourPlanTabId ? (
            <MakeYourPlanTab
              className="mt-6"
              builder={planDetails?.customPlanBuilder}
              selectedCounts={selectedMeals.reduce<Record<string, number>>(
                (acc, item) => {
                  acc[item.id] = (acc[item.id] ?? 0) + 1;
                  return acc;
                },
                {},
              )}
              onSelectSavedMeal={addSavedCustomMealSelection}
              onDeleteSavedMeal={(mealId) =>
                setSelectedMeals((prev) =>
                  prev.filter((item) => item.id !== mealId),
                )
              }
            />
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleMeals.map((meal) => (
                  <article
                    key={`${meal.id}-${activeCategory}`}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex justify-center">
                      <div className="relative h-36 w-36 overflow-hidden rounded-full border border-zinc-200">
                        <Image
                          src={meal.image}
                          alt={meal.title}
                          fill
                          unoptimized={isDataImageUrl(meal.image)}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="mt-4 text-center text-2xl font-bold leading-tight text-zinc-900">
                      {meal.title}
                    </h3>
                    <p className="mt-2 text-center text-sm text-zinc-500">
                      {meal.subtitle}
                    </p>
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
                        onClick={() => openSelectionPopup(meal)}
                        className="h-10 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                      >
                        {selectedMealCount(meal.id)
                          ? `Selected x${selectedMealCount(meal.id)}`
                          : "Select"}
                      </button>
                    </div>
                  </article>
                ))}
                {!visibleMeals.length ? (
                  <p className="text-sm text-zinc-500">
                    No meals available in this category.
                  </p>
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
                  onClick={() =>
                    setSliderPage((prev) => Math.min(totalPages - 1, prev + 1))
                  }
                  disabled={sliderPage === totalPages - 1}
                  className="h-8 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}

          <div className="mt-6 rounded-xl bg-zinc-50 p-4 sm:p-5">
            <h4 className="text-3xl font-semibold text-zinc-900">Your Cards</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {customCards.map((card, index) => (
                <article
                  key={card.id}
                  className="rounded-xl border border-zinc-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                >
                  <div className="flex items-start gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#ff5a36]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h3V2Zm12 8H5v10h14V10ZM7 12h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2ZM7 16h2v2H7v-2Zm4 0h2v2h-2v-2Z" />
                    </svg>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-900">
                      {card.label}
                    </p>
                  </div>

                  <p className="mt-4 text-3xl font-semibold leading-none text-zinc-900">
                    Meals
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {Array.from({
                      length: customMealSlotCount,
                    }).map((_, itemIndex) => {
                      const cardSelections = selectedMeals.filter(
                        (item) => item.date === card.dateIso,
                      );
                      const selectedCount = Math.min(
                        customMealSlotCount,
                        customCardStats[index]?.count ?? 0,
                      );
                      const isSelected = itemIndex < selectedCount;
                      const selectedItem = cardSelections[itemIndex];

                      return (
                        <button
                          key={`${card.id}-meal-${itemIndex}`}
                          type="button"
                          onClick={() => {
                            if (isSelected && selectedItem) {
                              openSelectedCardMealDetail(
                                selectedItem,
                                card.label,
                              );
                            }
                          }}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition ${
                            isSelected
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-500 text-white"
                          }`}
                          aria-label={
                            isSelected
                              ? `Remove one meal from ${card.label}`
                              : `Empty meal slot for ${card.label}`
                          }
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m5 10 3 3 7-7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-zinc-600">
                    <p className="rounded-md bg-zinc-50 px-2.5 py-1.5">
                      Kcal: {customCardStats[index]?.calories.toFixed(0) ?? "0"}
                    </p>
                    <p className="rounded-md bg-zinc-50 px-2.5 py-1.5">
                      Protein:{" "}
                      {customCardStats[index]?.protein.toFixed(1) ?? "0"}g
                    </p>
                    <p className="rounded-md bg-zinc-50 px-2.5 py-1.5">
                      Carb: {customCardStats[index]?.carb.toFixed(1) ?? "0"}g
                    </p>
                    <p className="rounded-md bg-zinc-50 px-2.5 py-1.5">
                      Fat: {customCardStats[index]?.fat.toFixed(1) ?? "0"}g
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <h4 className="text-2xl font-semibold text-zinc-900">
              Selected Options
            </h4>
            {selectedMeals.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMeals.map((item) => (
                  <button
                    key={
                      item.instanceId ?? mealSelectionKey(item.id, item.date)
                    }
                    type="button"
                    onClick={() =>
                          setSelectedMeals((prev) =>
                            prev.filter(
                              (selected) =>
                                (selected.instanceId ??
                                  mealSelectionKey(selected.id, selected.date)) !==
                                (item.instanceId ??
                                  mealSelectionKey(item.id, item.date)),
                            ),
                          )
                        }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                No option selected yet.
              </p>
            )}
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
              className="w-full max-w-5xl rounded-[20px] bg-white p-6 shadow-xl sm:p-8"
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
              <div className="grid gap-6 lg:grid-cols-[334px_minmax(0,1fr)] lg:items-start">
                <div className="relative aspect-[1/1] overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={detailMeal.image}
                    alt={detailMeal.title}
                    fill
                    unoptimized={isDataImageUrl(detailMeal.image)}
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="border-b border-zinc-200 pb-5">
                    <h6 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 sm:text-[2.45rem]">
                      {detailMeal.title} - Meal Details
                    </h6>
                  </div>

                  <div className="border-b border-zinc-200 py-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_224px] sm:items-center">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-tight text-zinc-900">
                          {detailMeal.title}
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
                          {detailMeal.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-start gap-3 sm:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setDetailQty((prev) => Math.max(1, prev - 1))
                          }
                          className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-zinc-900 text-2xl font-semibold text-white transition hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <div className="inline-flex h-12 min-w-[108px] items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 px-4 text-2xl font-bold text-zinc-900">
                          {detailQty}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetailQty((prev) => prev + 1)}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-zinc-900 text-2xl font-semibold text-white transition hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-zinc-200 py-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_224px] sm:items-center">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-tight text-zinc-900">
                          Portion Size
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
                          Adjust how many portions of this meal you want to add.
                        </p>
                      </div>
                      <div className="flex justify-start sm:justify-end">
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 text-xl font-bold text-zinc-900">
                          {detailQty} PCS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Calories
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {(detailMeal.calories * detailQty).toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Fat
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {(detailMeal.fat * detailQty).toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Protein
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {(detailMeal.protein * detailQty).toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Carb
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {(detailMeal.carb * detailQty).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 border-t border-zinc-200 pt-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2 text-zinc-900">
                  <div className="flex items-center gap-4 text-xl">
                    <span className="font-medium uppercase">Base Price</span>
                    <span className="font-medium">
                      $
                      {(
                        (planDetails?.pricing?.basePriceFormula?.pricePerMeal ??
                          0) * detailQty
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xl">
                    <span className="font-medium uppercase">
                      Extras/Add-ons
                    </span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex items-center gap-4 text-[2rem] font-bold uppercase sm:text-[1.7rem]">
                    <span>Total Meal Price</span>
                    <span>
                      $
                      {(
                        (planDetails?.pricing?.basePriceFormula?.pricePerMeal ??
                          0) * detailQty
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white">
                    Selected x{selectedMealCount(detailMeal.id)}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailMeal(null)}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addMealSelection(detailMeal, detailQty);
                      setDetailMeal(null);
                    }}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {selectionPopupMeal ? (
          <div
            className="fixed inset-0 z-[125] flex items-center justify-center bg-black/60 p-4"
            onClick={closeSelectionPopup}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Select Meal
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold text-zinc-900">
                    {selectionPopupMeal.title}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    Add this meal multiple times to your custom plan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeSelectionPopup}
                  className="text-3xl leading-none text-zinc-500 transition hover:text-zinc-700"
                >
                  &times;
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectionPopupQty((prev) => Math.max(1, prev - 1))
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-2xl text-zinc-900"
                >
                  -
                </button>
                <div className="flex h-12 min-w-24 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xl font-semibold text-zinc-900">
                  {selectionPopupQty}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectionPopupQty((prev) => prev + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-2xl text-zinc-900"
                >
                  +
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeSelectionPopup}
                  className="h-11 rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addMealSelection(
                      selectionPopupMeal,
                      selectionPopupQty,
                      selectionPopupDate,
                    );
                    closeSelectionPopup();
                  }}
                  className="h-11 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Add To Plan
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {selectedCardMealDetail ? (
          <div
            className="fixed inset-0 z-[126] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelectedCardMealDetail(null)}
          >
            <div
              className="w-full max-w-5xl rounded-[20px] bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCardMealDetail(null)}
                  className="text-4xl leading-none text-zinc-500 transition hover:text-zinc-700"
                >
                  &times;
                </button>
              </div>
              <div className="grid gap-6 lg:grid-cols-[334px_minmax(0,1fr)] lg:items-start">
                <div className="relative aspect-[1/1] overflow-hidden rounded-md bg-zinc-100">
                  <Image
                    src={selectedCardMealDetail.meal.image}
                    alt={selectedCardMealDetail.meal.title}
                    fill
                    unoptimized={isDataImageUrl(
                      selectedCardMealDetail.meal.image,
                    )}
                    className="object-cover"
                  />
                </div>

                <div>
                  <div className="border-b border-zinc-200 pb-5">
                    <h6 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 sm:text-[2.45rem]">
                      {selectedCardMealDetail.meal.title} - Meal Details
                    </h6>
                  </div>

                  <div className="border-b border-zinc-200 py-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_224px] sm:items-center">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-tight text-zinc-900">
                          {selectedCardMealDetail.meal.title}
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
                          {selectedCardMealDetail.meal.subtitle}
                        </p>
                      </div>
                      <div className="flex justify-start sm:justify-end">
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 text-base font-bold text-zinc-900">
                          {selectedCardMealDetail.cardLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-zinc-200 py-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_224px] sm:items-center">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-tight text-zinc-900">
                          Portion Size
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
                          This selected meal currently fills one slot in your
                          card.
                        </p>
                      </div>
                      <div className="flex justify-start sm:justify-end">
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 px-5 py-3 text-xl font-bold text-zinc-900">
                          1 PCS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Calories
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {selectedCardMealDetail.meal.calories.toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Fat
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {selectedCardMealDetail.meal.fat.toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Protein
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {selectedCardMealDetail.meal.protein.toFixed(1)}
                  </p>
                </div>
                <div className="overflow-hidden rounded-md border border-zinc-200">
                  <p className="bg-zinc-900 py-2.5 text-center text-lg font-semibold text-white">
                    Carb
                  </p>
                  <p className="bg-zinc-50 py-3.5 text-center text-2xl font-medium text-zinc-900">
                    {selectedCardMealDetail.meal.carb.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 border-t border-zinc-200 pt-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2 text-zinc-900">
                  <div className="flex items-center gap-4 text-xl">
                    <span className="font-medium uppercase">Base Price</span>
                    <span className="font-medium">
                      $
                      {(
                        planDetails?.pricing?.basePriceFormula?.pricePerMeal ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xl">
                    <span className="font-medium uppercase">
                      Extras/Add-ons
                    </span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex items-center gap-4 text-[2rem] font-bold uppercase sm:text-[1.7rem]">
                    <span>Total Meal Price</span>
                    <span>
                      $
                      {(
                        planDetails?.pricing?.basePriceFormula?.pricePerMeal ??
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={deleteSelectedCardMeal}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-7 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCardMealDetail(null)}
                    className="inline-flex h-11 items-center justify-center rounded-full border-2 border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                </div>
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
          {!selection.weeks ? (
            <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
              Days: {selection.days}
            </span>
          ) : null}
          {selection.weeks ? (
            <span className="rounded-md bg-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700">
              Weeks: {selection.weeks}
            </span>
          ) : null}
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
                {/* <button
                  type="button"
                  onClick={() => {
                    if (!isNormalPlan) {
                      toggleMealSelection(meal, activeDateIso);
                    }
                  }}
                  disabled={isNormalPlan}
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isNormalPlan || isMealSelected(meal.id, activeDateIso)
                    ? "Selected"
                    : "Select"}
                </button> */}
              </div>
            </article>
          ))}
          {!normalMeals.length ? (
            <p className="text-sm text-zinc-500">
              No meals assigned for this date.
            </p>
          ) : null}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <h4 className="text-2xl font-semibold text-zinc-900">
              Selected Options
            </h4>
          {slotWarning ? (
            <p className="mt-3 text-sm font-medium text-amber-700">
              {slotWarning}
            </p>
          ) : null}
          {selectedMealsForCheckout.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedMealsForCheckout.map((item) =>
                isNormalPlan ? (
                  <span
                    key={item.instanceId ?? mealSelectionKey(item.id, item.date)}
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
                  >
                    {item.title} {item.date ? `(${item.date})` : ""}
                  </span>
                ) : (
                  <button
                    key={item.instanceId ?? mealSelectionKey(item.id, item.date)}
                    type="button"
                    onClick={() =>
                      setSelectedMeals((prev) =>
                        prev.filter(
                          (selected) =>
                            (selected.instanceId ??
                              mealSelectionKey(selected.id, selected.date)) !==
                            (item.instanceId ??
                              mealSelectionKey(item.id, item.date)),
                        ),
                      )
                    }
                    className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700"
                  >
                    {item.title} {item.date ? `(${item.date})` : ""}
                  </button>
                ),
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">
              No option selected yet.
            </p>
          )}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={goToCheckout}
            className="inline-flex h-12 min-w-56 items-center justify-center rounded-lg bg-black px-8 text-xl font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </section>
  );
}
