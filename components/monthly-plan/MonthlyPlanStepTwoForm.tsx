"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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

const defaultMealOptions = ["1", "2", "3", "4", "5", "6"];
const defaultDayOptions = ["5", "6", "7", "14", "21", "28", "30"];
const defaultWeekOptions = ["1", "2", "3", "4"];
const calendarWeekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

function parseDateValue(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function formatDateInputLabel(value: string) {
  const date = parseDateValue(value);
  if (!date) return "mm/dd/yyyy";

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarDays(date: Date) {
  const monthStart = getMonthStart(date);
  const startDay = monthStart.getDay();
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - startDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + index);
    return day;
  });
}

export default function MonthlyPlanStepTwoForm({
  plan,
  planDetails,
}: MonthlyPlanStepTwoFormProps) {
  const router = useRouter();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const planKind = getPlanKind(plan);
  const isCustomPlan = planKind === "custom";

  const [meals, setMeals] = useState("");
  const [days, setDays] = useState("");
  const [weeks, setWeeks] = useState("");
  const [startDate, setStartDate] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => getMonthStart(new Date()));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const rules = planDetails?.rules;

  const availableWeekDays = useMemo(() => {
    const allowed = rules?.deliveryDaysRule?.allowedWeekDays;
    if (!allowed?.length) return weekDays;

    return allowed
      .map((dayIndex) => weekDays[dayIndex])
      .filter((label): label is string => Boolean(label));
  }, [rules]);
  const mealOptions = useMemo(() => {
    const options = rules?.allowedMealsPerDay?.length
      ? rules.allowedMealsPerDay.map((value) => String(value))
      : defaultMealOptions;

    return Array.from(new Set(options));
  }, [rules]);
  const dayOptions = useMemo(() => {
    const options = rules?.allowedDays?.length
      ? rules.allowedDays.map((value) => String(value))
      : defaultDayOptions;

    return Array.from(new Set(options));
  }, [rules]);
  const weekOptions = useMemo(() => {
    return Array.from(new Set(defaultWeekOptions));
  }, []);

  const requiresWeeks = isCustomPlan;
  const requiredDeliveryDayCount = useMemo(() => {
    if (requiresWeeks) return null;
    const parsedDays = Number(days);
    if (!Number.isFinite(parsedDays) || parsedDays < 1) return null;

    return Math.min(parsedDays, availableWeekDays.length);
  }, [availableWeekDays.length, days, requiresWeeks]);

  const dateLabel = useMemo(() => formatDateLabel(startDate), [startDate]);
  const startDateDisplayValue = useMemo(
    () => formatDateInputLabel(startDate),
    [startDate],
  );
  const calendarDays = useMemo(
    () => getCalendarDays(calendarMonth),
    [calendarMonth],
  );
  const selectedDate = useMemo(() => parseDateValue(startDate), [startDate]);

  useEffect(() => {
    setSelectedDays((prev) =>
      prev.filter((day) => availableWeekDays.includes(day)),
    );
  }, [availableWeekDays]);

  useEffect(() => {
    if (requiredDeliveryDayCount === null) return;

    setSelectedDays((prev) => prev.slice(0, requiredDeliveryDayCount));
  }, [requiredDeliveryDayCount]);



  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((item) => item !== day);
      }

      if (
        requiredDeliveryDayCount !== null &&
        prev.length >= requiredDeliveryDayCount
      ) {
        return prev;
      }

      return [...prev, day];
    });
  };

  const setAllWeek = () => {
    setSelectedDays((prev) => {
      const nextCount = requiredDeliveryDayCount ?? availableWeekDays.length;
      const nextSelection = availableWeekDays.slice(0, nextCount);

      return prev.length === nextSelection.length ? [] : nextSelection;
    });
  };

  const openDatePicker = () => {
    const nextMonth = selectedDate ? getMonthStart(selectedDate) : getMonthStart(new Date());
    setCalendarMonth(nextMonth);
    setCalendarOpen(true);
  };

  const moveCalendarMonth = (offset: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectCalendarDate = (date: Date) => {
    setStartDate(formatDateValue(date));
    setCalendarMonth(getMonthStart(date));
    setCalendarOpen(false);
  };

  const jumpToToday = () => {
    const today = new Date();
    selectCalendarDate(today);
  };

  const clearDate = () => {
    setStartDate("");
    setCalendarMonth(getMonthStart(new Date()));
    setCalendarOpen(false);
  };

  const isSameDate = (left: Date | null, right: Date) => {
    if (!left) return false;
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDate(today, date);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === calendarMonth.getMonth();
  };

  const monthHeading = useMemo(() => {
    return calendarMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [calendarMonth]);

  const handleDateFieldKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDatePicker();
    }
  };

  const goToShowMeals = () => {
    setSubmitAttempted(true);
    const mealsValue = Number(meals);
    const weeksValue = Number(weeks);
    const derivedDays = requiresWeeks ? String(Math.max(1, weeksValue || 1) * 7) : days;
    const daysValue = Number(derivedDays);
    const snacks = "0";


    if (
      !meals ||
      (!requiresWeeks && !days) ||
      (requiresWeeks && !weeks) ||
      !startDate ||
      selectedDays.length === 0
    ) {
      return;
    }
    if (
      !Number.isFinite(mealsValue) ||
      !Number.isFinite(daysValue) ||
      (requiresWeeks && (!Number.isFinite(weeksValue) || weeksValue < 1)) ||
      mealsValue < 1 ||
      daysValue < 1
    ) {
      return;
    }
    if (
      requiredDeliveryDayCount !== null &&
      selectedDays.length !== requiredDeliveryDayCount
    ) {
      return;
    }

    const query = new URLSearchParams({
      meals,
      days: derivedDays,
      snacks,
      startDate,
      deliveryDays: selectedDays.join(","),
    });

    if (requiresWeeks) query.set("weeks", weeks);

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


            <div>
              <label
                htmlFor="meals"
                className="text-base font-semibold text-zinc-800"
              >
                Number Of Meals <span className="text-black">*</span>
              </label>
              <select
                id="meals"
                value={meals}
                onChange={(event) => setMeals(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              >
                <option value="">Select number of meals</option>
                {mealOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {submitAttempted && !meals ? (
                <p className="mt-2 text-sm text-red-600">
                  Please select number of meals
                </p>
              ) : null}
            </div>

            {!isCustomPlan ? (
              <div>
                <label
                  htmlFor="days"
                  className="text-base font-semibold text-zinc-800"
                >
                  Number Of Days <span className="text-black">*</span>
                </label>
                <select
                  id="days"
                  value={days}
                  onChange={(event) => setDays(event.target.value)}
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
                >
                  <option value="">Select number of days</option>
                  {dayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {submitAttempted && !days ? (
                  <p className="mt-2 text-sm text-red-600">
                    Please select number of days
                  </p>
                ) : null}
              </div>
            ) : null}

            {isCustomPlan ? (
              <div>
                <label
                  htmlFor="weeks"
                  className="text-base font-semibold text-zinc-800"
                >
                  Number Of Week <span className="text-black">*</span>
                </label>
                <select
                  id="weeks"
                  value={weeks}
                  onChange={(event) => setWeeks(event.target.value)}
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
                >
                  <option value="">Select number of week</option>
                  {weekOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {submitAttempted && !weeks ? (
                  <p className="mt-2 text-sm text-red-600">
                    Please select number of week
                  </p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label
                htmlFor="startDate"
                className="text-base font-semibold text-zinc-800"
              >
                Start Date <span className="text-black">*</span>
              </label>
              <div
                ref={datePickerRef}
                className="relative mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_54px]"
              >
                <button
                  type="button"
                  onClick={openDatePicker}
                  onKeyDown={handleDateFieldKeyDown}
                  className="flex h-12 items-center rounded-lg border border-zinc-300 bg-white px-3 text-left text-zinc-800 outline-none transition focus:border-zinc-500"
                >
                  <span
                    id="startDate"
                    className={startDate ? "text-zinc-800" : "text-zinc-500"}
                  >
                    {startDateDisplayValue}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={openDatePicker}
                  className="flex h-12 items-center justify-center rounded-lg bg-[#f04b23] text-white"
                >
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
                </button>
                {calendarOpen ? (
                  <div className="absolute left-0 top-[calc(100%+12px)] z-30 w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl sm:max-w-[420px]">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => moveCalendarMonth(-1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-xl text-zinc-700 transition hover:bg-zinc-100"
                        aria-label="Previous month"
                      >
                        {"<"}
                      </button>
                      <p className="text-lg font-semibold text-zinc-900 sm:text-xl">
                        {monthHeading}
                      </p>
                      <button
                        type="button"
                        onClick={() => moveCalendarMonth(1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-xl text-zinc-700 transition hover:bg-zinc-100"
                        aria-label="Next month"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-7 gap-2 text-center">
                      {calendarWeekDays.map((day) => (
                        <div
                          key={day}
                          className="py-2 text-sm font-semibold uppercase tracking-wide text-zinc-500"
                        >
                          {day}
                        </div>
                      ))}
                      {calendarDays.map((date) => {
                        const selected = isSameDate(selectedDate, date);
                        const inMonth = isCurrentMonth(date);
                        const today = isToday(date);

                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => selectCalendarDate(date)}
                            className={`flex h-12 items-center justify-center rounded-xl text-base font-medium transition sm:h-14 sm:text-lg ${selected
                              ? "bg-[#f04b23] text-white shadow-md"
                              : inMonth
                                ? "bg-zinc-50 text-zinc-900 hover:bg-zinc-100"
                                : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                              } ${today && !selected ? "ring-2 ring-zinc-300" : ""}`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={clearDate}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={jumpToToday}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                ) : null}
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
              {requiredDeliveryDayCount !== null ? (
                <p className="mt-1 text-sm text-zinc-500">
                  Select exactly {requiredDeliveryDayCount} delivery day
                  {requiredDeliveryDayCount > 1 ? "s" : ""}.
                </p>
              ) : null}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableWeekDays.map((day) => {
                  const active = selectedDays.includes(day);
                  const limitReached =
                    requiredDeliveryDayCount !== null &&
                    selectedDays.length >= requiredDeliveryDayCount;
                  const disabled = !active && limitReached;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      disabled={disabled}
                      className={`h-11 rounded-lg border px-4 text-left text-sm font-semibold transition ${active
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                        } ${disabled ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    >
                      {day.toUpperCase()}
                    </button>
                  );
                })}
                {(() => {
                  const allWeekTargetCount =
                    requiredDeliveryDayCount ?? availableWeekDays.length;
                  const allWeekActive =
                    selectedDays.length === allWeekTargetCount &&
                    selectedDays.every((day) =>
                      availableWeekDays.slice(0, allWeekTargetCount).includes(day),
                    );

                  return (
                <button
                  type="button"
                  onClick={setAllWeek}
                  className={`h-11 rounded-lg border px-4 text-left text-sm font-semibold transition ${allWeekActive
                    ? "border-black bg-black text-white"
                    : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                    }`}
                >
                  ALL WEEK
                </button>
                  );
                })()}
              </div>
              {submitAttempted && selectedDays.length === 0 ? (
                <p className="mt-2 text-sm text-red-600">
                  Please select at least one delivery day
                </p>
              ) : null}
              {submitAttempted &&
              requiredDeliveryDayCount !== null &&
              selectedDays.length > 0 &&
              selectedDays.length !== requiredDeliveryDayCount ? (
                <p className="mt-2 text-sm text-red-600">
                  Please select exactly {requiredDeliveryDayCount} delivery day
                  {requiredDeliveryDayCount > 1 ? "s" : ""}.
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
