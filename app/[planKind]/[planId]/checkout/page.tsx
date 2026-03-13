"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import MonthlyPlanCheckoutForm from "@/components/monthly-plan/MonthlyPlanCheckoutForm";
import { mapApiPlan } from "@/lib/api-mappers";
import { useGetMonthlyPlanByIdQuery } from "@/redux/api/publicApi";
import type { MonthlyPlanDetails } from "@/types/monthlyPlanFlow";

export default function PlanCheckoutPage() {
  const params = useParams<{ planId: string; planKind: string }>();
  const planKind = typeof params?.planKind === "string" ? params.planKind : "normal";
  const isCustomPlan = planKind === "custom";
  const searchParams = useSearchParams();
  const planId = typeof params?.planId === "string" ? params.planId : "";
  const { data, isLoading } = useGetMonthlyPlanByIdQuery(planId, { skip: !planId });
  const details = (data?.data ?? null) as MonthlyPlanDetails | null;
  const matchedPlan = details ? mapApiPlan(details.plan) : null;

  const selection = {
    meals: searchParams.get("meals") ?? "1",
    days: searchParams.get("days") ?? "7",
    snacks: searchParams.get("snacks") ?? "0",
    startDate: searchParams.get("startDate") ?? new Date().toISOString().split("T")[0],
    deliveryDays: searchParams.get("deliveryDays") ?? "",
    planType: searchParams.get("planType") ?? "",
    selectedMeals: searchParams.get("selectedMeals") ?? "[]"
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[40vh] w-full sm:min-h-[42vh]">
          <Image src="/location_hero.png" alt="Checkout" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[40vh] items-center justify-center px-6 pt-24 text-center text-white sm:min-h-[42vh]">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">Checkout</h1>
              <p className="mt-2 text-sm text-white/85 sm:text-base">Complete Your Purchase Order</p>
              <p className="mt-7 text-sm text-white/90">
                <Link href="/" className="hover:text-white">Home</Link> <span className="px-1">{">"}</span>
                <span>Checkout</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? <section className="py-10">Loading plan...</section> : null}
      {!isLoading && matchedPlan ? (
        <MonthlyPlanCheckoutForm plan={matchedPlan} selection={selection} planDetails={details ?? undefined} />
      ) : null}
      {!isLoading && !matchedPlan ? <section className="py-10">Plan not found.</section> : null}
    </>
  );
}
