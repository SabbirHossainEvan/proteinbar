"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { MonthlyPlan } from "@/data/monthlyPlans";

const weekDays = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

type MonthlyPlanStepTwoFormProps = {
  plan: MonthlyPlan;
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
}: MonthlyPlanStepTwoFormProps) {
  const router = useRouter();
  const isCustomPlan = plan.id === "custom-plan";
  const [planType, setPlanType] = useState("");
  const [planTypeTouched, setPlanTypeTouched] = useState(false);
  const [meals, setMeals] = useState("1");
  const [days, setDays] = useState("7");
  const [snacks, setSnacks] = useState("0");
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [selectedDays, setSelectedDays] = useState<string[]>(["Thursday"]);

  const dateLabel = useMemo(() => formatDateLabel(startDate), [startDate]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const setAllWeek = () => {
    setSelectedDays((prev) =>
      prev.length === weekDays.length ? [] : [...weekDays]
    );
  };

  const goToShowMeals = () => {
    if (isCustomPlan && !planType) {
      setPlanTypeTouched(true);
      return;
    }

    const query = new URLSearchParams({
      meals,
      days,
      snacks,
      startDate,
      deliveryDays: selectedDays.join(","),
    });
    if (isCustomPlan) query.set("planType", planType);

    router.push(`/pages/monthly-plan/${plan.id}/show-meals?${query.toString()}`);
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
                  <option value="lose-weight">Lose Weight</option>
                  <option value="gain-weight">Gain Weight</option>
                </select>
                {planTypeTouched && !planType ? (
                  <p className="mt-2 text-sm text-red-600">This field is required</p>
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
              <select
                id="meals"
                value={meals}
                onChange={(event) => setMeals(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

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
                <option value="7">7</option>
                <option value="14">14</option>
                <option value="21">21</option>
                <option value="30">30</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="snacks"
                className="text-base font-semibold text-zinc-800"
              >
                Number Of Snacks
              </label>
              <select
                id="snacks"
                value={snacks}
                onChange={(event) => setSnacks(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-800 outline-none focus:border-zinc-500"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
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
            </div>

            <div>
              <p className="text-base font-semibold text-zinc-800">
                Delivery Days <span className="text-black">*</span>
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Days you want your meals to be delivered
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weekDays.map((day) => {
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
                    selectedDays.length === weekDays.length
                      ? "border-black bg-black text-white"
                      : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
                  }`}
                >
                  ALL WEEK
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={goToShowMeals}
                disabled={isCustomPlan && !planType}
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
