"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import MonthlyPlanStepTwoForm from "@/components/monthly-plan/MonthlyPlanStepTwoForm";
import { mapApiPlan } from "@/lib/api-mappers";
import { useGetMonthlyPlanByIdQuery } from "@/redux/api/publicApi";
import type { MonthlyPlanDetails } from "@/types/monthlyPlanFlow";

export default function SetPlanPage() {
  const params = useParams<{ planId: string; planKind: string }>();
  const planKind = typeof params?.planKind === "string" ? params.planKind : "normal";
  const planId = typeof params?.planId === "string" ? params.planId : "";
  const { data, isLoading } = useGetMonthlyPlanByIdQuery(planId, { skip: !planId });
  const details = (data?.data ?? null) as MonthlyPlanDetails | null;
  const matchedPlan = details ? mapApiPlan(details.plan) : null;
  const isCustomPlan = planKind === "custom";
  const heroTitle = details?.plan?.content?.heroTitle ?? (isCustomPlan ? "Custom Plan" : "Monthly Plan");
  const heroSubtitle =
    details?.plan?.content?.heroSubtitle ??
    (isCustomPlan
      ? "Build your own plan: meals, snacks, delivery days and start date."
      : "Configure your monthly subscription and continue to meal selection.");

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[62vh] w-full">
          <Image src="/location_hero.png" alt={heroTitle} fill priority className="object-cover" />
          <div className={`absolute inset-0 ${isCustomPlan ? "bg-black/80" : "bg-black/70"}`} />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[62vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">
                {isCustomPlan ? "Custom Monthly Plan" : "Monthly Plan"}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
                {heroTitle.toUpperCase()}
              </h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">{heroSubtitle}</p>
              <p className="mt-8 text-sm text-white/90">
                <Link href="/" className="hover:text-white">Home</Link> <span className="px-1">{">"}</span>
                <Link href="/plans" className="hover:text-white">Monthly Plans</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? <section className="py-10">Loading plan...</section> : null}
      {!isLoading && matchedPlan ? <MonthlyPlanStepTwoForm plan={matchedPlan} planDetails={details ?? undefined} /> : null}
      {!isLoading && !matchedPlan ? <section className="py-10">Plan not found.</section> : null}
    </>
  );
}
