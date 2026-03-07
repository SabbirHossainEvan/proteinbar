"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMonthlyPlansQuery } from "@/redux/api/publicApi";
import { mapApiPlan } from "@/lib/api-mappers";
import { getPlanKind, getSetPlanPath } from "@/lib/monthlyPlanFlow";

const frontofficeFlows = [
  {
    id: "custom-plan",
    title: "Flow 1: Custom Plan",
    description:
      "Client configures number of meals, days, snacks, start date, delivery days, then picks meals.",
    href: "/pages/monthly-plan/flow/custom",
    cta: "Start Custom Plan"
  },
  {
    id: "pre-made-plan",
    title: "Flow 2: Pre-made Plan",
    description:
      "Client selects from pre-defined meal structure and confirms with limited customization.",
    href: "/pages/monthly-plan/flow/pre-made",
    cta: "Browse Pre-made Plans"
  }
];

export default function MonthlyPlanPage() {
  const { data, isLoading } = useGetMonthlyPlansQuery();
  const monthlyPlans = (data?.data ?? []).map(mapApiPlan);
  const customPlan = monthlyPlans.find((plan) => getPlanKind(plan) === "custom");

  return (
    <>
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-8 w-screen overflow-hidden sm:-mt-10">
        <div className="relative min-h-[62vh] w-full">
          <Image src="/location_hero.png" alt="Monthly plans" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />

          <div className="relative z-10 flex min-h-[62vh] items-center justify-center px-6 pt-24 text-center text-white">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">Monthly Plans</h1>
              <p className="mt-3 text-sm text-white/85 sm:text-base">Choose the meal plan for your goals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 pb-8 sm:mt-10">
        <div className="grid gap-5 md:grid-cols-2">
          {frontofficeFlows.map((flow) => (
            <article key={flow.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-900">{flow.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{flow.description}</p>
              <div className="mt-5">
                <Link
                  href={flow.id === "custom-plan" ? (customPlan ? getSetPlanPath(customPlan) : "/custom/4/set-plan") : flow.href}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium !text-white transition hover:bg-zinc-800"
                >
                  {flow.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-8 sm:pb-12">
        {isLoading ? <p className="text-sm text-zinc-500">Loading plans...</p> : null}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {monthlyPlans.map((plan) => (
            <article
              key={plan.id}
              className="group relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {plan.badge ? (
                <span className="absolute right-0 top-0 rounded-bl-xl rounded-tr-2xl bg-[#f04b23] px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  {plan.badge}
                </span>
              ) : null}

              <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full bg-zinc-100">
                <Image src={plan.image} alt={plan.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              </div>

              <h2 className="mt-6 text-center text-3xl font-semibold leading-[1.05] tracking-tight text-zinc-900">{plan.title}</h2>
              <p className="mt-3 text-center text-sm leading-6 text-zinc-600">{plan.description}</p>

              <div className="mt-6 flex justify-center pt-1">
                <Link
                  href={getSetPlanPath(plan)}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium !text-white transition hover:bg-zinc-800 hover:!text-white visited:!text-white"
                >
                  Subscribe Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
