"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { MonthlyPlan } from "@/data/monthlyPlans";
import { getPlanKind } from "@/lib/monthlyPlanFlow";
import type { MonthlyPlanDetails } from "@/types/monthlyPlanFlow";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type MonthlyPlanStepTwoFormProps = {
  plan: MonthlyPlan;
  planDetails?: MonthlyPlanDetails;
};

function formatDateLabel(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    weekday: "long",
  });
}

export default function MonthlyPlanStepTwoForm({
  plan,
  planDetails,
}: MonthlyPlanStepTwoFormProps) {
  const router = useRouter();
  const planKind = getPlanKind(plan);
  const isCustomPlan = planKind === "custom";
  const [planType, setPlanType] = useState("");
  const [planTypeTouched, setPlanTypeTouched] = useState(false);
  const [meals, setMeals] = useState("");
  const [days, setDays] = useState("");
  const [snacks, setSnacks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const rules = planDetails?.rules;
  const planTypeOptions = useMemo(
    () =>
      isCustomPlan
        ? rules?.planTypeOptions?.length
          ? rules.planTypeOptions
          : ["lose-weight", "gain-weight"]
        : [],
    [isCustomPlan, rules],
  );
  const availableWeekDays = useMemo(() => {
    const allowed = rules?.deliveryDaysRule?.allowedWeekDays;
    if (!allowed?.length) return weekDays;

    return allowed
      .map((dayIndex) => weekDays[dayIndex])
      .filter((label): label is string => Boolean(label));
  }, [rules]);
  const requiresPlanType = isCustomPlan && planTypeOptions.length > 0;

  const dateLabel = useMemo(() => formatDateLabel(startDate), [startDate]);

  useEffect(() => {
    setSelectedDays((prev) =>
      prev.filter((day) => availableWeekDays.includes(day)),
    );
  }, [availableWeekDays]);

  useEffect(() => {
    if (!requiresPlanType) {
      setPlanType("");
      return;
    }
    if (planType && !planTypeOptions.includes(planType)) {
      setPlanType("");
    }
  }, [planType, planTypeOptions, requiresPlanType]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const setAllWeek = () => {
    setSelectedDays((prev) =>
      prev.length === availableWeekDays.length ? [] : [...availableWeekDays],
    );
  };

  const goToShowMeals = () => {
    setSubmitAttempted(true);
    const mealsValue = Number(meals);
    const daysValue = Number(days);
    const snacksValue = Number(snacks);

    if (requiresPlanType && !planType) {
      setPlanTypeTouched(true);
      return;
    }
    if (!meals || !days || !snacks || !startDate || selectedDays.length === 0) {
      return;
    }
    if (
      !Number.isFinite(mealsValue) ||
      !Number.isFinite(daysValue) ||
      !Number.isFinite(snacksValue) ||
      mealsValue < 1 ||
      daysValue < 1 ||
      snacksValue < 0
    ) {
      return;
    }

    const query = new URLSearchParams({
      meals,
      days,
      snacks,
      startDate,
      deliveryDays: selectedDays.join(","),
    });
    if (requiresPlanType) query.set("planType", planType);

    router.push(`/${planKind}/${plan.id}/select-meals?${query.toString()}`);
  };

  return (
    <section className="py-10 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight text-black sm:text-6xl">
            {plan.title.toUpperCase()}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
            {plan.description}
          </p>

          <form className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
            {isCustomPlan ? (
              <div>
                <label
                  htmlFor="planType"
                  className="text-base font-semibold text-zinc-800"
                >
                  Plan Type <span className="text-black">*</span>
                </label>
                <select
                  id="planType"
                  value={planType}
                  onChange={(event) => {
                    setPlanType(event.target.value);
                    setPlanTypeTouched(true);
                  }}
                  onBlur={() => setPlanTypeTouched(true)}
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
                >
                  <option value="">Choose Plan Type</option>
                  {planTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option
                        .split("-")
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() + part.slice(1),
                        )
                        .join(" ")}
                    </option>
                  ))}
                </select>
                {requiresPlanType && planTypeTouched && !planType ? (
                  <p className="mt-2 text-sm text-red-600">
                    This field is required
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label
                htmlFor="meals"
                className="text-base font-semibold text-zinc-800"
              >
                Number Of Meals <span className="text-black">*</span>
              </label>
              <input
                id="meals"
                type="number"
                min={1}
                step={1}
                value={meals}
                onChange={(event) => setMeals(event.target.value)}
                placeholder="Enter number of meals"
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              />
              {submitAttempted && !meals ? (
                <p className="mt-2 text-sm text-red-600">
                  Please enter number of meals
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="days"
                className="text-base font-semibold text-zinc-800"
              >
                Number Of Days <span className="text-black">*</span>
              </label>
              <input
                id="days"
                type="number"
                min={1}
                step={1}
                value={days}
                onChange={(event) => setDays(event.target.value)}
                placeholder="Enter number of days"
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              />
              {submitAttempted && !days ? (
                <p className="mt-2 text-sm text-red-600">
                  Please enter number of days
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="snacks"
                className="text-base font-semibold text-zinc-800"
              >
                Number Of Snacks
              </label>
              <input
                id="snacks"
                type="number"
                min={0}
                step={1}
                value={snacks}
                onChange={(event) => setSnacks(event.target.value)}
                placeholder="Enter number of snacks"
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              />
              {submitAttempted && !snacks ? (
                <p className="mt-2 text-sm text-red-600">
                  Please enter number of snacks
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="text-base font-semibold text-zinc-800"
              >
                Start Date <span className="text-black">*</span>
              </label>
              <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_54px]">
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-12 rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
                />
                <div className="flex h-12 items-center justify-center rounded-lg bg-[#f04b23] text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="M8 3v4M16 3v4M4 10h16" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{dateLabel}</p>
              {submitAttempted && !startDate ? (
                <p className="mt-2 text-sm text-red-600">
                  Please select a start date
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-base font-semibold text-zinc-800">
                Delivery Days <span className="text-black">*</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Days you want your meals to be delivered
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableWeekDays.map((day) => {
                  const active = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`h-11 rounded-lg border px-4 text-left text-sm font-semibold transition ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                      }`}
                    >
                      {day.toUpperCase()}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={setAllWeek}
                  className={`h-11 rounded-lg border px-4 text-left text-sm font-semibold transition ${
                    selectedDays.length === availableWeekDays.length
                      ? "border-black bg-black text-white"
                      : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                  }`}
                >
                  ALL WEEK
                </button>
              </div>
              {submitAttempted && selectedDays.length === 0 ? (
                <p className="mt-2 text-sm text-red-600">
                  Please select at least one delivery day
                </p>
              ) : null}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={goToShowMeals}
                className="inline-flex h-11 min-w-32 items-center justify-center rounded-lg bg-black px-6 text-base font-medium !text-white transition hover:bg-zinc-800 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </form>
        </div>

        <aside className="pt-2 lg:pt-20">
          <p className="mb-3 text-center text-sm font-medium text-black">
            Check out our menu
          </p>
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-full border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="relative aspect-square overflow-hidden rounded-full">
              <Image
                src={plan.image}
                alt={plan.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
