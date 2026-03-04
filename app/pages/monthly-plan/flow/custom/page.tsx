import Link from "next/link";
import { getMonthlyPlanById } from "@/data/monthlyPlans";

export default function CustomPlanFlowPage() {
  const customPlan = getMonthlyPlanById("custom-plan");

  return (
    <section className="py-10 sm:py-14">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Flow 1
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Custom Plan Builder
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 sm:text-base">
          Client chooses meals, days, snacks, start date, delivery days, then selects meals
          for each cycle before checkout.
        </p>
        <div className="mt-6">
          <Link
            href={`/pages/monthly-plan/${customPlan?.id ?? "custom-plan"}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-medium !text-white transition hover:bg-zinc-800"
          >
            Continue To Set Plan
          </Link>
        </div>
      </div>
    </section>
  );
}
