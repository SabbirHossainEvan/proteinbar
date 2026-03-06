"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import MonthlyPlanShowMeals from "@/components/monthly-plan/MonthlyPlanShowMeals";
import { useGetMonthlyPlansQuery } from "@/redux/api/publicApi";
import { mapApiPlan } from "@/lib/api-mappers";

export default function ShowMealsPage() {
  const params = useParams<{ planId: string }>();
  const searchParams = useSearchParams();
  const planId = typeof params?.planId === "string" ? params.planId : "";
  const { data, isLoading } = useGetMonthlyPlansQuery();
  const plans = (data?.data ?? []).map(mapApiPlan);
  const plan = plans.find((item) => item.id === planId);

  const selection = {
    meals: searchParams.get("meals") ?? "1",
    days: searchParams.get("days") ?? "7",
    snacks: searchParams.get("snacks") ?? "0",
    startDate: searchParams.get("startDate") ?? new Date().toISOString().split("T")[0],
    planType: searchParams.get("planType") ?? ""
  };

  if (isLoading) return <section className="py-10">Loading plan...</section>;
  if (!plan) return <section className="py-10">Plan not found.</section>;

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[58vh] w-full">
          <Image src="/location_hero.png" alt="Show meals" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[58vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">Show Meals</h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">Choose the meal plan for your goals</p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">Home</Link> <span className="px-1">{">"}</span>
                <Link href="/pages/monthly-plan" className="hover:text-white">Monthly Plans</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <MonthlyPlanShowMeals plan={plan} selection={selection} />
    </>
  );
}
